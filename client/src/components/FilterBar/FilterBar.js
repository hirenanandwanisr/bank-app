import React, { useState, useEffect } from 'react';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import PopoverComponent from '../Popover/PopoverComponent';
import useStyles from './styles';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Checkbox from '@material-ui/core/Checkbox';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import ListItemText from '@material-ui/core/ListItemText';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormLabel from '@material-ui/core/FormLabel';
import { getCityList } from '../../api';
import { useDebounce } from '../../utils/hooks';
import { useDispatch } from 'react-redux';
import { getPosts } from '../../actions/posts';

const FilterBar = (props) => {
  const classes = useStyles();
  const [cities, setCities] = useState([]);
  const dispatch = useDispatch();

  const [filter, setFilter] = useState({
    minBalance: '',
    maxBalance: '',
    city: [],
    haveMortgage: 'No',
    minCredit: '',
    maxCredit: '',
    relation: 'AND',
  });

  const deboundecFilter = useDebounce(filter, 750);

  useEffect(() => {
    let query = `?`;
    Object.keys(filter).map((key) => {
      if (key === 'city') {
        filter[key].map((c) => {
          query += `city=${c}&`;
        });
        return;
      }
      if (filter[key]) {
        query += `${key}=${filter[key]}&`;
      }
    });
    dispatch(getPosts(query));
  }, [deboundecFilter]);

  const fetchCityList = async () => {
    try {
      const { data } = await getCityList();
      setCities(data);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    fetchCityList();
  }, []);

  const handleChange = (e, filter) => {
    e.persist();
    setFilter((filters) => ({ ...filters, [filter]: e?.target?.value }));
  };

  return (
    <>
      <Box className={classes.filterWrapper}>
        <PopoverComponent
          element={
            <Button variant='outlined' className={classes.btn}>
              <Typography>Balance</Typography>
            </Button>
          }
        >
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <TextField
                variant='outlined'
                label='Min Balance'
                type='number'
                size='small'
                value={filter.minBalance}
                onChange={(e) => handleChange(e, 'minBalance')}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                variant='outlined'
                label='Max Balance'
                type='number'
                size='small'
                value={filter.maxBalance}
                onChange={(e) => handleChange(e, 'maxBalance')}
              />
            </Grid>
          </Grid>
        </PopoverComponent>

        <FormControl
          variant='outlined'
          className={classes.citySelect}
          size='small'
        >
          <InputLabel id='city-select'>City</InputLabel>
          <Select
            label='City'
            multiple
            labelId='city-select'
            value={filter.city}
            onChange={(e) => handleChange(e, 'city')}
            renderValue={(selected) => selected.join(', ')}
            MenuProps={{
              PaperProps: {
                style: {
                  maxHeight: 550,
                  width: 250,
                },
              },
            }}
          >
            {cities.map((city) => (
              <MenuItem key={city} value={city}>
                <Checkbox checked={filter.city.indexOf(city) > -1} />
                <ListItemText primary={city} />
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <PopoverComponent
          element={
            <Button variant='outlined' className={classes.btn}>
              <Typography>Have Mortgage</Typography>
            </Button>
          }
        >
          <FormControl component='fieldset'>
            <FormLabel component='legend'>Have Mortgage</FormLabel>
            <RadioGroup
              value={filter.haveMortgage}
              onChange={(e) => handleChange(e, 'haveMortgage')}
            >
              <FormControlLabel
                value={'Yes'}
                control={<Radio />}
                label='Yes'
              />
              <FormControlLabel
                value={'No'}
                control={<Radio />}
                label='No'
              />
            </RadioGroup>
          </FormControl>
        </PopoverComponent>

        <PopoverComponent
          element={
            <Button variant='outlined' className={classes.btn}>
              <Typography>No of cards</Typography>
            </Button>
          }
        >
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <TextField
                variant='outlined'
                label='Min No Of Cards'
                type='number'
                size='small'
                value={filter.minCredit}
                onChange={(e) => handleChange(e, 'minCredit')}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                variant='outlined'
                label='Max No Of Cards'
                type='number'
                size='small'
                value={filter.maxCredit}
                onChange={(e) => handleChange(e, 'maxCredit')}
              />
            </Grid>
          </Grid>
        </PopoverComponent>

        <PopoverComponent
          element={
            <Button variant='outlined' className={classes.btn}>
              <Typography>Relation</Typography>
            </Button>
          }
        >
          <FormControl component='fieldset'>
            <FormLabel component='legend'>Relation</FormLabel>
            <RadioGroup
              aria-label='gender'
              name='gender1'
              value={filter.relation}
              onChange={(e) => handleChange(e, 'relation')}
            >
              <FormControlLabel value={'AND'} control={<Radio />} label='And' />
              <FormControlLabel value={'OR'} control={<Radio />} label='Or' />
            </RadioGroup>
          </FormControl>
        </PopoverComponent>
      </Box>
    </>
  );
};

export default FilterBar;
