import * as React from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';

export default function CategorySelect() {
    return (
        <Autocomplete
            disablePortal
            id=""
            options={category}
            sx={{ width: 300 }}
            renderInput={(params) => <TextField {...params} label="Category" />}
        />
    );
}

// Top 100 films as rated by IMDb users. http://www.imdb.com/chart/top
const category = [
    { label: 'Food & Beverages'},
    { label: 'Entertainment'},
    { label: 'Scenics'},

    // { label: 'Monty Python and the Holy Grail', year: 1975 },
];
