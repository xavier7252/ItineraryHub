import { React, useState } from 'react'
import './Banner.css'
import Button from '@mui/material/Button'
import IconButton from "@mui/material/IconButton";
import { TextField, CircularProgress, Autocomplete } from '@mui/material';
import Select from 'react-select';
import axios from 'axios';
import CountrySelect from './CountrySelect';
import CategorySelect from './CategorySelect';
import SearchIcon from '@mui/icons-material/Search';
import { Search } from '@mui/icons-material';


function Banner() {

  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleInputChange = async (inputValue) => {
    if (inputValue.length < 3) {
      setOptions([]);
      return;
    }

    setLoading(true);
    const response = await axios.get(
      `https://maps.googleapis.com/maps/api/place/autocomplete/json`,
      {
        params: {
          input: inputValue,
          key: 'AIzaSyBSvaB_7bp2BpHI10ZEGEIFuYZ-m3OkLOc',
          types: '(cities)',
        },
      }
    );

    const newOptions = response.data.predictions.map((prediction) => ({
      value: prediction.place_id,
      label: prediction.description,
    }));

    setOptions(newOptions);
    setLoading(false);
  };

  return (
    <div className='banner'>
      <div className='country-selector'>
        <CountrySelect></CountrySelect>
      </div>
      <div className='category-selector'>
        <CategorySelect></CategorySelect>
      </div>
      <div className='search'>
        <IconButton variant='text'>
          <SearchIcon className='search-icon'></SearchIcon>
        </IconButton>

      </div>
    </div>
  )
}

export default Banner;