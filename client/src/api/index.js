import axios from 'axios';

const url = 'http://localhost:5000/posts';

export const fetchPosts = (query) => axios.get(`${url}${query || ''}`);
export const createPost = (newPost) => axios.post(url, newPost);
export const likePost = (id) => axios.patch(`${url}/${id}/likePost`);
export const updatePost = (id, updatedPost) =>
  axios.patch(`${url}/${id}`, updatedPost);
export const deletePost = (id) => axios.delete(`${url}/${id}`);
export const getCityList = () => axios.get(`${url}/cityList`);
