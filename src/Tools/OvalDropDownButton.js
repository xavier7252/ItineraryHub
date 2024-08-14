import * as React from 'react';
import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import { purple } from '@mui/material/colors';

export const OvalDropDownButton = styled(Button)({
  boxShadow: 'none',
  textTransform: 'none',
  fontSize: 16,
  padding: '6px 12px',
  border: '1px solid',
  borderRadius: '150px',
  lineHeight: 2.5,
  backgroundColor: '#f2dcdf',
  borderColor: '#f5ced2',
  color: '#000',
  fontFamily: [
    '-apple-system',
    'BlinkMacSystemFont',
    '"Segoe UI"',
    'Roboto',
    '"Helvetica Neue"',
    'Arial',
    'sans-serif',
    '"Apple Color Emoji"',
    '"Segoe UI Emoji"',
    '"Segoe UI Symbol"',
  ].join(','),
  '&:hover': {
    backgroundColor: '#f5bfc4',
    // borderColor: '#0062cc',
    color: '#000',
    boxShadow: 'none',
  },
  '&:focus': {
    outline: 'none',
    backgroundColor: '#f2dcdf',
    color: '#000'
  },
  '&:active': {
    backgroundColor: '#f5ced2',
    borderColor: '#f5ced2',
    color: '#000',
  },
});

export default function CustomizedButtons() {
  return (
    <Stack spacing={2} direction="row">
      <OvalDropDownButton variant="contained" disableRipple>
        Bootstrap
      </OvalDropDownButton>
    </Stack>
  );
}
