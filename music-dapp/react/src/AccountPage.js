import React, { useState, useEffect } from 'react';
import clsx from 'clsx';

import SearchResultList from './components/SearchResultList';


import {
  makeStyles,
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  TextField,
  Button,
} from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  container: {
    paddingTop: theme.spacing(5),
    paddingLeft: theme.spacing(5),
    paddingRight: theme.spacing(5),
    paddingBottom: theme.spacing(5),
    backgroundColor: '#202020',
  },
  paper: {
    padding: theme.spacing(2),
    display: 'flex',
    overflow: 'auto',
    flexDirection: 'column',
    backgroundColor: '#808080',
  },
  fixedHeight: {
    height: 240,
  },
}));

const AccountPage = (props) => {
  const classes = useStyles();
  const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);

  const [userBalance,setUserBalance] = useState(0)
  const [userUploadSongs,setUserUploadSongs] = useState([])
  const [userBoughtSongs,setUserBoughtSongs] = useState([])



  // from props
  const web3 = props.web3;
  const accounts = props.accounts;
  const contract = props.contract;
  const setPage = props.setPage;
  
  useEffect(() => {
    setPage("Account");
    
  },[]);

  useEffect(async () => {
    await getAllUserData();
  }, [accounts, contract])

  const getAllUserData = async () => {
    if (contract.methods == undefined) {
      return
    } else if (accounts.length == 0) {
      return
    }
    await getUserBalance();
    await getUploadMusicList();

  }


  const getUserBalance = async () => {
    const result = await contract.methods
      .getUserBalance()
      .call({ from: accounts[0] });
    console.log(result);
    setUserBalance(result)
  };

  const getUploadMusicList = async () => {
    
    const result = await contract.methods
      .getUploadMusicList()
      .call({ from: accounts[0] });
      // console.log(result);
      let _uploadSongs = []
      for (const x of result) {
        const song_metadata = await getMusicByHash(x)
        _uploadSongs.push(song_metadata)
      }
      console.log(_uploadSongs)
      setUserUploadSongs(_uploadSongs)
  };

  const getBoughtMusicList = async () => {
    const result = await contract.methods
      .getBoughtMusicList()
      .call({ from: accounts[0] });
    let _boughtSongs = []
    for (const x of result) {
      const song_metadata = await getMusicByHash(x)
      _boughtSongs.push(song_metadata)
    }
    console.log(_boughtSongs)
    setUserBoughtSongs(_boughtSongs)
  };

  const getMusicByHash = async (searchHash) => {
    const result = await contract.methods
      .getMusicByHash(searchHash)
      .call({ from: accounts[0] });
    return result;
  };

  const buyToken = async () => {
    const result = await contract.methods
      .buy()
      .send({ from: accounts[0], value: web3.utils.toWei('0.01', 'ether') });
    console.log(result);
    getUserBalance();
  };

  const sellToken = async () => {
    const result = await contract.methods
      .sell(100)
      .send({ from: accounts[0] });
    console.log(result);
    getUserBalance();
  };


  return (
    <Container maxWidth="lg" className={classes.container} >
      <Grid container spacing={3}>
      <Grid item xs={12}>
          <Paper className={classes.paper}>
          <Typography
              component='h2'
              variant='h6'
              gutterBottom
              style={{ color: 'white', fontSize: 20 }}
            >
              Balance: {userBalance}
            </Typography>
            < Button
                  variant='contained'
                  onClick={() => {
                    buyToken();
                  }}
                >
                  Buy $100
                </Button>
                <Button
                  variant='contained'
                  onClick={() => {
                    sellToken();
                  }}
                >
                  Sell
                </Button>
          </Paper>
        </Grid>
        <Grid item xs={12} md={8} lg={6} >
          <Paper className={fixedHeightPaper}>
          <Typography
              component='h2'
              variant='h6'
              gutterBottom
              style={{ color: 'white', fontSize: 20 }}
            >
              Uploads
            </Typography>
          <SearchResultList rows={userUploadSongs} minColumns={true} />
          </Paper>
        </Grid>

        <Grid item xs={12} md={4} lg={6}>
          <Paper className={fixedHeightPaper}>
          <Typography
              component='h2'
              variant='h6'
              gutterBottom
              style={{ color: 'white', fontSize: 20 }}
            >
              Bought
            </Typography>
          <SearchResultList rows={userBoughtSongs} minColumns={true} />
          </Paper>
        </Grid>

        
      </Grid>
      <Box pt={4}>

      </Box>
    </Container>
  )
}

export default AccountPage;