import { React, useState } from 'react'
import './CountryBanner.css'
import Button from '@mui/material/Button'
import IconButton from "@mui/material/IconButton";
import { TextField, CircularProgress, Autocomplete } from '@mui/material';
import Select from 'react-select';
import axios from 'axios';
import SearchIcon from '@mui/icons-material/Search';
import { Search } from '@mui/icons-material';
import countries from '../data/Countries';

const CountryBanner = ({country}) => {

  const countryName = country;
  const countryData = countries.find(c => (c.name === countryName || c.name.toLowerCase() === countryName));

  if (!countryData) {
    return <div>Country not found</div>;
  }

  else

  return (
    <div className='CountryBanner' style={{ backgroundImage: `url(${countryData.image})` }}>
      <div className='CountryBanner-content'>
        <h1>{countryData.name}</h1>
        <p>{countryData.description}</p>
      </div> 
    </div>
  ); 
};

export default CountryBanner;