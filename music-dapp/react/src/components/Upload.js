import React, { useSate, useEffect } from 'react';
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


const Upload = (props) => {
  const classes = useStyles();
  const UploadPaperHeight = clsx(classes.paper, classes.uploadBoxFixedHeight);

  const { 
    songname, setSongName, 
    songartist, setSongArtist, 
    songdata, setSongData, 
    fileTextField, setFileTextField,
    handleUploads 
  } = props;

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

export default Upload;