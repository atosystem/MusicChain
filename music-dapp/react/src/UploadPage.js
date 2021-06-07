import React, { useState, useEffect } from 'react';
import { uploadAudioIPFS } from './ipfs/upload';
import clsx from 'clsx';

import {
  makeStyles,
  Container, Grid, Paper,
  Typography, TextField, Button, Snackbar, CircularProgress
} from '@material-ui/core';

import Alert from '@material-ui/lab/Alert';
// import {} from '@material-ui/lab/Alert';

import CloudUploadIcon from '@material-ui/icons/CloudUpload';

import MatchingResultList from './components/MatchingResultList'

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
    // height: 420,
  },
  backendInfoDisplay :{
    margin: theme.spacing(2),
    marginLeft: theme.spacing(4),
    marginRight: theme.spacing(4),
    // width: '36ch',
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
  useEffect(() => {
    setPage("Upload");
  },[]);

  // states
  const [songname, setSongName] = useState('');
  const [songartist, setSongArtist] = useState('');
  const [songdata, setSongData] = useState({ selectedFile: null });
  const [songHash, setSongHash] = useState('');
  const [fileTextField, setFileTextField] = useState("you haven't select a file yet...");
  const [fingerprstatus, setFingerprstatus] = useState('no file yet');
  const [backendInfo, setBackendInfo] = useState([]);

  // for alert msg
  const [alertmsg, setAlermsg] = useState('');
  const [openAlert, setOpenAlert] = useState(false);
  const handleCloseAlertMsg = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenAlert(false);
  };
  const callAlert = (msg) => {
    setAlermsg(msg);
    setOpenAlert(true);
  }

  // for HPCP matching progress UI
  const [matchresults, setMatchResults] = useState([
    // {
    //   "name": "song1",
    //   "artist": "artist1",
    //   "ipfs_hash": "hash ipfs",
    //   "uploader": "user1",
    //   "dist": "cover_dist1",
    //   "exact" : false
    // }
  ])
  const [pendingMsg, setPendingMsg] = useState('');
  const [uploadPending,setUploadPending] = useState(false);
  const showResult = (data) => {
    setMatchResults(data.map((r)=>{

      return  {
        "name": "song1",
        "artist": "artist1",
        "ipfs_hash": r.song_hash,
        "uploader": "user1",
        "dist": r.dist,
        "exact" : false
      }
    }).sort((x)=>-Number(x.dist)))
  }

  



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
      callAlert('You have to set the SONG name!');
      return;
    }
    if (!songartist) {
      callAlert('You have to set the ARTIST name!');
      return;
    }
    if (!songdata.selectedFile) {
      callAlert('You have to upload a file!');
      return;
    }

    if (songdata.selectedFile.size >= 100000000) {
      callAlert('The file limit is 100 MB!');
      setSongData({ selectedFile: null });
      return;
    }
    setUploadPending(true);
    uploadAudioIPFS(songdata.selectedFile, songname, (retHash) => {
      setSongHash(retHash);
      const source = new EventSource(
        `http://localhost:3001/processupload?h=${retHash}`,
        { withCredentials: true }
      );
      source.addEventListener('message', (message) => {
        console.log('Got', message.data);
        let msg_obj = JSON.parse(message.data);
        setBackendInfo(backendInfo.concat([msg_obj]))
        
        if (msg_obj.status === 'done') {
          
          source.close();
          setUploadPending(false);
        } else if (msg_obj.status === 'matching_results') {
          // let x = { "status": "matching_results", "payload": [{ "song_hash": "QmRhPHUnNHUodTJb5QciUj6zuEHZZd5fFVTBoJnUTwKh9N", "dist": 0.22824497520923615, "exact": false }, { "song_hash": "QmY3vX8TRHvM8RsgJCjHP4FVRNq1CgC6poTPUBxEHRRhkw", "dist": 0.15082646906375885, "exact": false }] }
          showResult(msg_obj.payload)
        } else {
          // setFingerprstatus(message.data);
        }
        console.log("backendInfo",backendInfo)
      });

      // uplaodMusicBlockchain(retHash);
    });

    // reset input data
    setSongName('');
    setSongArtist('');
    setFileTextField("you haven't select a file yet...");
  };


  return (
    <Container maxWidth="lg" className={classes.container} >
      <Snackbar open={openAlert} autoHideDuration={6000} onClose={handleCloseAlertMsg}>
        <Alert onClose={handleCloseAlertMsg} severity="error">
          {alertmsg}
        </Alert>
      </Snackbar>
      <Grid container spacing={6}>
        <Grid item xs={12} >
          <Paper className={UploadPaperHeight}>
            <Typography component="h2" variant="h6" gutterBottom style={{ color: 'white', fontSize: 20 }}>
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
                    setSongName(event.target.value)
                  }
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
                  onChange={(event) => {
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
            <div className={classes.backendInfoDisplay}>
              {/* {uploadPending && <CircularProgress />} */}
              {backendInfo.length ? backendInfo.map((b,ind)=>{
                return (
                  <Alert key={ind} severity="success">{b.status}</Alert>
                )
              }) 
              
              
              : null}
            </div>
            
            { backendInfo.length ? <MatchingResultList rows={matchresults}/> : null}
          </Paper>
        </Grid>
      </Grid>

    </Container>
  )
}

export default UploadPage;