import express, { query } from 'express';
import mongoose from 'mongoose';

import PostMessage from '../models/postMessage.js';

const router = express.Router();

export const getPosts = async (req, res) => { 
    try {
        let relation = req.query.relation || 'AND';
        let city = req.query.city;
        let minBalance = req.query.minBalance;
        let maxBalance = req.query.maxBalance;
        let minCredit = req.query.minCredit;
        let maxCredit = req.query.maxCredit;
        let haveMortgage = req.query.haveMortgage;

        let balanceQuery;
        
        if(minBalance && maxBalance){
            balanceQuery = {"balance": {$gt:minBalance, $lt:maxBalance}};
        }else{
            if(minBalance)
            {
                balanceQuery = {"balance": {$gt:minBalance}};
            }else if(maxBalance){
                balanceQuery = {"balance": {$lt:maxBalance}};
            }
        }
        let creditQuery;
        if(minCredit && maxCredit){
            creditQuery = {"numCreditCards": {$gt:minCredit, $lt:maxCredit}};
        }else{
            if(minCredit)
            {
                creditQuery = {"numCreditCards": {$gt:minCredit}};
            }else if(maxCredit){
                creditQuery = {"numCreditCards": {$lt:maxCredit}};
            }
        }

        let cityQuery;
        if(city){
            cityQuery = { city: { $in: city }};
        }

        let queryArray = [];
        if(balanceQuery){
            queryArray.push(balanceQuery);
        }
        if(creditQuery){
            queryArray.push(creditQuery);
        }
        if(cityQuery){
            queryArray.push(cityQuery);
        }
        if(haveMortgage){
            queryArray.push({'haveMortgage': haveMortgage});
        }

        let where;
        if(queryArray.length>0){
            if(relation === 'AND'){
                where= { $and: queryArray }
            }else{
                where = { $or: queryArray }
            }
        }else{
            where = {}
        }

        const posts = await PostMessage.find(where);
        res.status(200).json(posts);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}

export const getPost = async (req, res) => { 
    const { id } = req.params;

    try {
        const post = await PostMessage.findById(id);
        
        res.status(200).json(post);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}

export const cityList = async (req,res)=>{
    try{
        let city = await PostMessage.find().select('city');
        let cities=[];city.forEach((element) => {
            if(!cities.includes(element.city))
            {
                cities.push(element.city);
            }
        });

        res.status(200).json(cities);
    }catch(error){
        res.status(404).json({ message:error.message });
    }
}

export const createPost = async (req, res) => {
    const { balance, city, clientName, haveMortgage, numCreditCards, selectedFile } = req.body;

    const newPostMessage = new PostMessage({ clientName, city, balance, haveMortgage, numCreditCards, selectedFile })

    try {
        await newPostMessage.save();

        res.status(201).json(newPostMessage );
    } catch (error) {
        res.status(409).json({ message: error.message });
    }
}

export const updatePost = async (req, res) => {
    const { id } = req.params;
    const { clientName, city, balance, haveMortgage, numCreditCards, selectedFile } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send(`No post with id: ${id}`);

    const updatedPost = { clientName, city, balance, haveMortgage, numCreditCards, selectedFile, selectedFile, _id: id };

    await PostMessage.findByIdAndUpdate(id, updatedPost, { new: true });

    res.json(updatedPost);
}

export const deletePost = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send(`No post with id: ${id}`);

    await PostMessage.findByIdAndRemove(id);

    res.json({ message: "Post deleted successfully." });
}

export const likePost = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send(`No post with id: ${id}`);

    const post = await PostMessage.findById(id);

    const updatedPost = await PostMessage.findByIdAndUpdate(id, { likeCount: post.likeCount + 1 }, { new: true });
 
    res.json(updatedPost);
}


export default router;
