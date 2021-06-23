import React, { useState, useEffect } from 'react';
import clsx from 'clsx';
import { downloadAudioIPFS } from './ipfs/download';

import {
  makeStyles,
  Container,
  Grid,
  Paper,
  Typography,
  TextField,
  Button,
} from '@material-ui/core';

import GetAppIcon from '@material-ui/icons/GetApp';

import SearchResultList from './components/SearchResultList';

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
    // height: 480,
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

const SearchPage = (props) => {
  const classes = useStyles();
  const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);

  // from props
  const web3 = props.web3;
  const accounts = props.accounts;
  const contract = props.contract;
  const setPlayersrc = props.setPlayersrc;
  const setPage = props.setPage;

  useEffect(() => {
    setPage('Search');
  }, []);

  // states
  const [songHash, setSongHash] = useState('');
  const [searchMusic, setSearchMusic] = useState('');
  const [searchArtist, setSearchArtist] = useState('');
  const [searchHash, setSearchHash] = useState('');
  const [searchRows, setSearchRows] = useState([])
  const [isSearchPending, setSearchPending] = useState(false)

  const getArtistMusicList = async () => {

  }

  const getMusicArtistList = async () => {

  }

  const getMusic = async () => {

  }

  const getRelevantMusic = async () => {

  }

  const searchMusicHandler = async () => {
    setSearchPending(true);
    let result;

    const exactSearch = searchMusic !== "" && searchArtist !== "";
    const artistSearch = searchMusic !== "";
    const musicSearch = searchArtist !== "";

    // For different condition, fetch different data from the blockchain
    if (exactSearch) {
      result = await getMusic();
    } else if (artistSearch) {
      result = await getMusicArtistList();
    } else if (musicSearch) {
      result = await getArtistMusicList();
    } else {
      alert("You have to input music or artist name!")
      setSearchPending(false)
      return;
    }

    // TODO:
    // Try to fill the result to 10

    setSearchRows(result)
    setSearchPending(false)
    console.log(result);
  }

  const handle_searchMusic = async () => {
    setSearchPending(true);
    let result;
    if (searchMusic === "") {
      result = await contract.methods
        .getArtistMusicList(searchArtist)
        .call({ from: accounts[0] });
    } else {
      result = await contract.methods
        .getMusicArtistList(searchMusic)
        .call({ from: accounts[0] });
    }
    setSearchRows(result)
    setSearchPending(false)
    console.log(result);

  };

  

  return (
    <Container maxWidth='lg' className={classes.container}>
      <Grid container spacing={6}>
        <Grid item xs={12} md={8} lg={12}>
          <Paper className={fixedHeightPaper}>
            <Typography
              component='h2'
              variant='h6'
              gutterBottom
              style={{ color: 'white', fontSize: 20 }}
            >
              Search For Music
            </Typography>

            <form className={classes.inputForm} noValidate autoComplete='off'>
              <div>
                <TextField
                  id='name-textfield'
                  label='Name'
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
                  id='artist-textfield'
                  label='Artist'
                  placeholder="Type song's artist..."
                  multiline
                  variant='outlined'
                  size='small'
                  value={searchArtist}
                  onChange={(event) => {
                    setSearchArtist(event.target.value);
                  }}
                />
                <Button
                  variant='contained'
                  onClick={() => {
                    handle_searchMusic();
                  }}
                >
                  Search
                </Button>
              </div>

              <div className={classes.testingButtons}>

              </div>
            </form>

            <Typography
              component='h2'
              variant='h6'
              gutterBottom
              style={{ color: 'white', fontSize: 20 }}
            >
              Search Results
            </Typography>
            {isSearchPending || searchRows.length ? <SearchResultList rows={searchRows} /> : null}

          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default SearchPage;
