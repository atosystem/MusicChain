import React, { useState, useEffect } from 'react';
import { uploadAudioIPFS } from './ipfs/upload';
import clsx from 'clsx';

import {
  makeStyles, 
  Container, Grid, Paper, 
  Typography, TextField, Button
} from '@material-ui/core';

import CloudUploadIcon from '@material-ui/icons/CloudUpload';

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
  // Upload Box style
  uploadBoxFixedHeight: {
    height: 320,
  },
  inputForm: {
    '& .MuiTextField-root': {
      margin: theme.spacing(2),
      marginLeft: theme.spacing(4),
      marginRight: theme.spacing(4),
      width: '36ch',
    }, 
  },
  uploadinput: {
    display: 'none'
  },
  selectbutton: {
    margin: theme.spacing(2),
    marginLeft: theme.spacing(4),
    marginRight: theme.spacing(4),
  },
  fileinput: {
    margin: theme.spacing(1),
    marginLeft: theme.spacing(4),
    width: '56ch',
  },
  uploadbutton: {
    position: 'relative',
    backgroundColor: '#39a9cb',
    margin: theme.spacing(2),
    marginLeft: theme.spacing(4),
    marginRight: theme.spacing(4),
    height: '5ch',
  } 
}))


const UploadPage = (props) => {
  const classes = useStyles();
  const UploadPaperHeight = clsx(classes.paper, classes.uploadBoxFixedHeight);

  // from props
  const web3 = props.web3;
  const accounts = props.accounts;
  const contract = props.contract;
  const setPage = props.setPage;

  setPage("Upload");

  // states
  const [songname, setSongName] = useState('');
  const [songartist, setSongArtist] = useState('');
  const [songdata, setSongData] = useState({ selectedFile: null });
  const [songHash, setSongHash] = useState('');
  const [fileTextField, setFileTextField] = useState("you haven't select a file yet...");
  const [fingerprstatus, setFingerprstatus] = useState('no file yet');
  const [matchresult, setMatchresult] = useState('no file yet');




  const uplaodMusicBlockchain = async (retHash) => {
    try {
      const music = await contract.methods
        .uploadMusic(retHash, songname, songartist, 'None')
        .send({ from: accounts[0] });

      console.log(music);
    } catch (error) {
      console.log(error);
    }
  };

  const handleUploads = async () => {
    // console.log(`web3: ${web3}`);
    // console.log(`accounts: ${accounts}`);
    // console.log(`contract: ${contract}`);
    // Force user to fill these input field
    if (!songname) {
      alert('You have to set the SONG name!');
      return;
    }
    if (!songartist) {
      alert('You have to set the ARTIST name!');
      return;
    }
    if (!songdata.selectedFile) {
      alert('You have to upload a file!');
      return;
    }

    if (songdata.selectedFile.size >= 100000000) {
      alert('The file limit is 100 MB!');
      setSongData({ selectedFile: null });
      return;
    }

    uploadAudioIPFS(songdata.selectedFile, songname, (retHash) => {
      setSongHash(retHash);
      const source = new EventSource(
        `http://localhost:3001/processupload?h=${retHash}`,
        { withCredentials: true }
      );
      source.addEventListener('message', (message) => {
        console.log('Got', message.data);
        let msg_obj = JSON.parse(message.data);
        if (msg_obj.status === 'done') {
          source.close();
        } else if (msg_obj.status === 'matching_results') {
          setMatchresult(message.data);
        } else {
          setFingerprstatus(message.data);
        }
      });

      uplaodMusicBlockchain(retHash);
    });

    // reset input data
    setSongName('');
    setSongArtist('');
    setFileTextField("you haven't select a file yet...");
  };


  return (
    <Container maxWidth="lg" className={classes.container} >
      <Grid container spacing={6}>
        <Grid item xs={12} >
          <Paper className={UploadPaperHeight}>
            <Typography component="h2" variant="h6" gutterBottom style={{color: 'white', fontSize: 20}}>
              Start upload your music!
            </Typography>

            <form className={classes.inputForm} noValidate autoComplete='off'>
              <div>
                <TextField
                  id="name-textfield"
                  label="Name"
                  placeholder="Type song's name..."
                  value={songname}
                  multiline
                  variant='outlined'
                  size='small'
                  onChange={(event) => {
                    setSongName(event.target.value)}
                  }
                />
                <TextField
                  id="artist-textfield"
                  label="Artist"
                  placeholder="Type song's artist..."
                  value={songartist}
                  multiline
                  variant='outlined'
                  size='small'
                  onChange={(event)=> {
                    setSongArtist(event.target.value)
                  }}
                />
              </div>
            </form>

            <div>
              <input
                accept='audio/*'
                id='contained-button-file'
                className={classes.uploadinput}
                type='file'
                onChange={(event) => {
                  setSongData({ selectedFile: event.target.files[0] });
                  setFileTextField(event.target.files[0].name);
                }}
              />
              <label htmlFor='contained-button-file'>
                <Button variant='contained' component='span' className={classes.selectbutton}>
                  Select File
                </Button>
              </label>

              <TextField 
                className={classes.fileinput}
                id='file-textfield'
                label='File Name'
                multiline
                value={fileTextField}
                InputProps={{
                  readOnly: true,
                }}
              />

              <Button
                className={classes.uploadbutton}
                variant='contained'
                startIcon={<CloudUploadIcon />}
                onClick={() => {
                  handleUploads();
                }}
              >
                Upload
              </Button>
            </div>
          </Paper>
        </Grid>
      </Grid>
      
    </Container>
  )
}

export default UploadPage;