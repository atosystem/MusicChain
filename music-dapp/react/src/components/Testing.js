import React, { useState, useEffect } from 'react';
import clsx from 'clsx';

import {
  makeStyles, 
  Container, Grid, Paper, 
  Typography, TextField, Button
} from '@material-ui/core';

import GetAppIcon from '@material-ui/icons/GetApp';

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
    height: 480,
  },
  inputForm: {
    '& .MuiTextField-root': {
      margin: theme.spacing(2),
      marginLeft: theme.spacing(4),
      marginRight: theme.spacing(4),
      width: '36ch',
    }, 
  },
  testingButtons: {
    '& > *': {
      margin: theme.spacing(2),
      marginBottom: theme.spacing(3),
    },
  },
  downloadForm: {
    '& .MuiTextField-root': {
      margin: theme.spacing(2),
      marginLeft: theme.spacing(4),
      marginRight: theme.spacing(4),
      marginBottom: theme.spacing(3),
      width: '60ch',
    }, 
  },
  downloadbutton: {
    position: 'relative',
    backgroundColor: '#39a9cb',
    margin: theme.spacing(2),
    marginLeft: theme.spacing(4),
    marginRight: theme.spacing(4),
    height: '5ch',
  },
  audioplayer: {
    margin: theme.spacing(2),
  },
}));

const Testing = (props) => {
  const classes = useStyles();
  const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);

  const { 
    searchMusic, setSearchMusic,
    searchArtist, setSearchArtist,
    songHash, setSongHash,
    accounts,
    contract,
    downloadAudioIPFS
  } = props;

  const testGetMusic = async () => {
    const result = await contract.methods
      .getMusic(searchMusic, searchArtist)
      .call();
    console.log(result);
    console.log(result.ipfsHash);
    setSongHash(result.ipfsHash);
  };

  const testGetMusicArtistList = async () => {
    const result = await contract.methods
      .getMusicArtistList(searchMusic)
      .call();
    console.log(result);
  };

  const testGetArtistMusicList = async () => {
    const result = await contract.methods
      .getArtistMusicList(searchArtist)
      .call();
    console.log(result);
  };

  const testGetUserInfo = async () => {
    const result = await contract.methods.getUserInfo().call();
    console.log(result);
  };

  const testUserLogin = async () => {
    const result = await contract.methods.login().send({ from: accounts[0] });
    console.log(result);
  };

  return (
    <Container maxWidth="lg" className={classes.container} >
      <Grid container spacing={6}>
        <Grid item xs={12} md={8} lg={12} >
            <Paper className={fixedHeightPaper}>
              <Typography component="h2" variant="h6" gutterBottom style={{color: 'white', fontSize: 20}}>
                Testing Blockchain
              </Typography>

              <form className={classes.inputForm} noValidate autoComplete='off'>
                <div>
                  <TextField
                    id="name-textfield"
                    label="Name"
                    placeholder="Type song's name..."
                    multiline
                    variant='outlined'
                    size='small'
                    value={searchMusic}
                    onChange={(event) => {
                      setSearchMusic(event.target.value);
                    }}
                  />
                  <TextField
                    id="artist-textfield"
                    label="Artist"
                    placeholder="Type song's artist..."
                    multiline
                    variant='outlined'
                    size='small'
                    value={searchArtist}
                    onChange={(event) => {
                      setSearchArtist(event.target.value);
                    }}
                  />
                </div>

                <div className={classes.testingButtons}>
                  <Button 
                    variant="contained"
                    onClick={() => {
                      testGetMusic();
                    }}
                  >
                    Test Get Music
                  </Button>

                  <Button 
                    variant="contained"
                    onClick={() => {
                      testGetMusicArtistList();
                    }}
                  >
                    Test Get Music List
                  </Button>

                  <Button 
                    variant="contained"
                    onClick={() => {
                      testGetArtistMusicList();
                    }}
                  >
                    Test Get Artist List 
                  </Button>

                  <Button 
                    variant="contained"
                    onClick={() => {
                      testGetUserInfo();
                    }}
                  >
                    Test Get User Info
                  </Button>

                  <Button 
                    variant="contained"
                    onClick={() => {
                      testUserLogin();
                    }}
                  >
                    Test User Login
                  </Button>
                </div>
              </form>

              <Typography component="h2" variant="h6" gutterBottom style={{color: 'white', fontSize: 20}}>
                Download Music
              </Typography>

              <form className={classes.downloadForm} noValidate autoComplete='off'>
                <div>
                  <TextField
                      id="artist-textfield"
                      label="Song's Hash"
                      placeholder="Type song's hash value..."
                      multiline
                      variant='outlined'
                      size='small'
                      value={songHash}
                      onChange={(event) => {
                        setSongHash(event.target.value);
                      }}
                    />

                  <Button
                    className={classes.downloadbutton}
                    variant='contained'
                    startIcon={<GetAppIcon />}
                    onClick={() => {
                      console.log(songHash);
                      downloadAudioIPFS(songHash);
                    }}
                  >
                    Download
                  </Button>
                </div>
              </form>

              <Typography component="h2" variant="h6" gutterBottom style={{color: 'white', fontSize: 20}}>
                Music Play
              </Typography>

              <div>
                <audio
                  className={classes.audioplayer}
                  controls
                  src='/media/cc0-audio/t-rex-roar.mp3'
                  id='music-play'
                >
                  Your browser does not support the
                  <code>audio</code> element.
                </audio>
              </div>
            </Paper>
        </Grid>
        
      </Grid>
      
    </Container>
  )
}

export default Testing;