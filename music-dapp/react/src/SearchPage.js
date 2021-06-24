import React, { useState, useEffect } from "react";
import clsx from "clsx";
import { downloadAudioIPFS } from "./ipfs/download";

import {
  makeStyles,
  Container,
  Grid,
  Paper,
  Typography,
  TextField,
  Button,
} from "@material-ui/core";

import GetAppIcon from "@material-ui/icons/GetApp";

import SearchResultList from "./components/SearchResultList";

const useStyles = makeStyles((theme) => ({
  container: {
    paddingTop: theme.spacing(5),
    paddingLeft: theme.spacing(5),
    paddingRight: theme.spacing(5),
    paddingBottom: theme.spacing(5),
    backgroundColor: "#202020",
  },
  paper: {
    padding: theme.spacing(2),
    display: "flex",
    overflow: "auto",
    flexDirection: "column",
    backgroundColor: "#808080",
  },
  fixedHeight: {
    // height: 480,
  },
  inputForm: {
    "& .MuiTextField-root": {
      margin: theme.spacing(2),
      marginLeft: theme.spacing(4),
      marginRight: theme.spacing(4),
      width: "36ch",
    },
  },
  testingButtons: {
    "& > *": {
      margin: theme.spacing(2),
      marginBottom: theme.spacing(3),
    },
  },
  downloadForm: {
    "& .MuiTextField-root": {
      margin: theme.spacing(2),
      marginLeft: theme.spacing(4),
      marginRight: theme.spacing(4),
      marginBottom: theme.spacing(3),
      width: "60ch",
    },
  },
  downloadbutton: {
    position: "relative",
    backgroundColor: "#39a9cb",
    margin: theme.spacing(2),
    marginLeft: theme.spacing(4),
    marginRight: theme.spacing(4),
    height: "5ch",
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
    setPage("Search");
  }, []);

  // states
  const [songHash, setSongHash] = useState('');
  const [searchHash, setSearchHash] = useState('');
  const [searchMusic, setSearchMusic] = useState('');
  const [searchArtist, setSearchArtist] = useState('');
  const [exactSearchIndex, setExactSearchIndex] = useState('');
  const [artistSearchIndex, setArtistSearchIndex] = useState('');
  const [musicSearchIndex, setMusicSearchIndex] = useState('');
  const [exactSearchRows, setExactSearchRows] = useState('');
  const [artistSearchRows, setArtistSearchRows] = useState('');
  const [musicSearchRows, setMusicSearchRows] = useState('');
  const [searchRows, setSearchRows] = useState([])
  const [isSearchPending, setSearchPending] = useState(false)

  // Get music list
  const getArtistMusicList = async () => {
    const result = await contract.methods
                        .getArtistMusicList(searchArtist)
                        .call({ from: accounts[0] });

    return result;
  }

  // Get artist list
  const getMusicArtistList = async () => {
    const result = await contract.methods
                        .getMusicArtistList(searchMusic)
                        .call({ from: accounts[0] });

    return result;
  }

  const getMusic = async () => {
    const result = await contract.methods
                        .getMusic(searchMusic, searchArtist)
                        .call({ from: accounts[0] });

    return result;
  }

  const getRelevantMusicNameList = async (index, depth) => {
    const result = await contract.methods
                        .getRelevantMusicNameList(searchMusic, index)
                        .call({ from: accounts[0] });

    return result;
  }

  const getRelevantArtistNameList = async (index, depth) => {
    const result = await contract.methods
                        .getRelevantArtistNameList(searchArtist, index, depth)
                        .call({ from: accounts[0] });

    return result;
  }

  const getRelevantMusicArtistList = async (index, depth) => {
    const result = await contract.methods
                        .getRelevantArtistNameList(searchMusic, searchArtist, index, depth)
                        .call({ from: accounts[0] });

    return result;
  }

  const getExactSearchList = async (index) => {
    let result = await getMusic();

    // Empty response, find relevant musics
    if(!result) {
      let [moreResult, returnIndex, reachEnd] = await getRelevantMusicArtistList(index, 10);

      // Set search index for later use
      if (reachEnd) {
        setExactSearchIndex(-1);
      } else {
        setExactSearchIndex(returnIndex);
      }

      setExactSearchRows(moreResult);
      return moreResult;
    }

    result = [result];
    setExactSearchRows(result);

    return result;
  }

  const getArtistSearchList = async (index) => {
    let result = await getMusicArtistList();

    if (result.length < 10) {
      const diff = 10 - result.length;
      let [moreResult, returnIndex, reachEnd] = await getRelevantArtistNameList(index, diff);

      // Set search index for later use
      if (reachEnd) {
        setArtistSearchIndex(-1);
      } else {
        setArtistSearchIndex(returnIndex);
      }

      result = result.concat(moreResult);
    }

    setArtistSearchRows(result);

    return result;
  }

  const getMusicSearchList = async (index) => {
    let result = await getArtistMusicList();

    if (result.length < 10) {
      const diff = 10 - result.length;
      let [moreResult, returnIndex, reachEnd] = await getRelevantMusicNameList(index, diff);

      // Set search index for later use
      if (reachEnd) {
        setMusicSearchIndex(-1);
      } else {
        setMusicSearchIndex(returnIndex);
      }

      result = result.concat(moreResult);
    }

    setMusicSearchRows(result);

    return result;
  }

  const clearSearchIndex = () => {
    setExactSearchIndex(0);
    setArtistSearchIndex(0);
    setMusicSearchIndex(0);
  }

  const clearSearchResult = () => {
    setExactSearchRows([]);
    setArtistSearchRows([]);
    setMusicSearchRows([]);
  }


  const getSearchList = async () => {
    clearSearchIndex();
    clearSearchResult();

    setSearchPending(true);
    let result;

    const exactSearch = searchMusic !== "" && searchArtist !== "";
    const artistSearch = searchMusic !== "";
    const musicSearch = searchArtist !== "";

    // For different condition, fetch different data from the blockchain
    if (exactSearch) {
      result = await getExactSearchList(0);
    } else if (artistSearch) {
      result = await getArtistSearchList(0);
    } else if (musicSearch) {
      result = await getMusicSearchList(0);
    } else {
      alert("You have to input music or artist name!");
      setSearchPending(false);
      return;
    }

    setSearchRows(result)
    setSearchPending(false)
    console.log(result);
  }

  const getMoreSearchList = async () => {
    setSearchPending(true);
    let oldResult = searchRows;
    let result;

    const exactSearch = searchMusic !== "" && searchArtist !== "";
    const artistSearch = searchMusic !== "";
    const musicSearch = searchArtist !== "";

    // TODO: check if reach END
    // For different condition, fetch different data from the blockchain
    if (exactSearch) {
      if (exactSearchIndex === -1) {
        alert("No more music!");
        setSearchPending(false);
        return;
      }
      result = await getExactSearchList(exactSearchIndex);
      result = result.concat(oldResult);
    } else if (artistSearch) {
      if (artistSearchIndex === -1) {
        alert("No more music!");
        setSearchPending(false);
        return;
      }
      result = await getArtistSearchList(artistSearchIndex);
      result = result.concat(oldResult);
    } else if (musicSearch) {
      if (musicSearchIndex === -1) {
        alert("No more music!");
        setSearchPending(false);
        return;
      }
      result = await getMusicSearchList(musicSearchIndex);
      result = result.concat(oldResult);
    } else {
      alert("You have to input music or artist name!");
      setSearchPending(false);
      return;
    }

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
    <Container maxWidth="lg" className={classes.container}>
      <Grid container spacing={6}>
        <Grid item xs={12} md={8} lg={12}>
          <Paper className={fixedHeightPaper}>
            <Typography
              component="h2"
              variant="h6"
              gutterBottom
              style={{ color: "white", fontSize: 20 }}
            >
              Search For Music
            </Typography>

            <form className={classes.inputForm} noValidate autoComplete="off">
              <div>
                <TextField
                  id="name-textfield"
                  label="Name"
                  placeholder="Type song's name..."
                  multiline
                  variant="outlined"
                  size="small"
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
                  variant="outlined"
                  size="small"
                  value={searchArtist}
                  onChange={(event) => {
                    setSearchArtist(event.target.value);
                  }}
                />
                <Button
                  variant="contained"
                  onClick={() => {
                    handle_searchMusic();
                  }}
                >
                  Search
                </Button>
              </div>

              <div className={classes.testingButtons}></div>
            </form>

            <Typography
              component="h2"
              variant="h6"
              gutterBottom
              style={{ color: "white", fontSize: 20 }}
            >
              Search Results
            </Typography>
            {isSearchPending || searchRows.length ? (
              <SearchResultList rows={searchRows} minColumns={false} />
            ) : null}
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default SearchPage;
