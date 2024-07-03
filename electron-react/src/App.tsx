import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/electron-vite.animate.svg'
import cert from './assets/cert.json'
import './App.css'
import axios from 'axios'
import https from 'https'
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { styled, alpha } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import InputBase from '@mui/material/InputBase';
import SearchIcon from '@mui/icons-material/Search';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import Button from '@mui/material/Button';


// 3 functions below are styling for search bar
const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(1),
    width: 'auto',
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  width: '100%',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    [theme.breakpoints.up('sm')]: {
      width: '12ch',
      '&:focus': {
        width: '20ch',
      },
    },
  },
}));


// import json that store cfsssl cert
// httpsAgent for self-signed cert
const httpsAgent = new https.Agent({
  cert: cert.client_cert,
  key: cert.client_key,
  ca: cert.ca
});

function App() {
  // setting display pdf date
  const [data, setData] = useState([])

  // setting key for search e.g. name, file size, modified date
  const [key, setKey] = useState('')

  const handleChange = (event: SelectChangeEvent) => {
    setKey(event.target.value as string);
    // for debugging
    // console.error(event.target.value)
  };

  // setting value for search e.g. name = <key> where <key> = 'sample'
  const [queryValue, setQueryValue] = useState('')

  const handleInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQueryValue(event.target.value as string);
    // for debugging
    // console.error(event.target.value)
  };

  // submit the sql query to get specified pdf data
  const handleSubmit = (event) => {
    event.preventDefault()
    axios.get('https://localhost:8001/search?' + key + '=' + queryValue, {httpsAgent})
      .then(response => {
        // if return nil, ignore
        if(!Object.keys(response.data).length)
          return
        setData(response.data);
      })
      .catch(error => {
        console.error(error);
      });
  }


  // trigger when website is mounted
  useEffect(() => {
    axios.get('https://localhost:8001/showall', {httpsAgent})
      .then(response => {
        // if return nil ignore
        if(!Object.keys(response.data).length)
          return
        setData(response.data);
      })
      .catch(error => {
        console.error(error);
      });
  }, []);

  return (
  <>
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Typography
            variant="h6"
            noWrap
            component="div"
            align="left"
            sx={{ flexGrow: 1, display: { xs: 'none', sm: 'block' } }}
          >
            PDF FILE SYSTEM WITH MUI
          </Typography>
          <FormControl variant="filled" sx={{ m: 1, minWidth: 120 }}>
            <InputLabel id="demo-simple-select-label">Search Key</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={key}
              label="search_key"
              onChange={handleChange}
            >
              <MenuItem value={'name'}>File Name</MenuItem>
              <MenuItem value={'file_size'}>File Size</MenuItem>
              <MenuItem value={'modified_date'}>Modified Date</MenuItem>
            </Select>
          </FormControl>
          <form onSubmit={handleSubmit}>
            <Search>
              <SearchIconWrapper>
                <SearchIcon/>
              </SearchIconWrapper>
              <StyledInputBase
                placeholder="Search…"
                inputProps={{ 'aria-label': 'search' }}
                value={queryValue}
                onChange={handleInput}
              />
            </Search>
            <button hidden type='submit'>Search</button>
          </form>
          
      </Toolbar>
      </AppBar>
    </Box>

    <TableContainer component={Paper}>
    <Table sx={{ minWidth: 650 }} aria-label="simple table">
      <TableHead>
        <TableRow>
          <TableCell>Id</TableCell>
          <TableCell align="right">File Name</TableCell>
          <TableCell align="right">File Size</TableCell>
          <TableCell align="right">Modified Date</TableCell>
          <TableCell align="right">Preview</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {data.map((row) => (
          <TableRow
            key={row.id}
            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
          >
            <TableCell component="th" scope="row">
              {row.id}
            </TableCell>
            <TableCell align="right">{row.name}</TableCell>
            <TableCell align="right">{row.file_size}</TableCell>
            <TableCell align="right">{row.modified_date}</TableCell>
            <TableCell align="right">
              <Button variant="outlined" href={`https://localhost:8001/static/${row.name}.pdf`}>View</Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
    </TableContainer>
  </>
  );
}

export default App
