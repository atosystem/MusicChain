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

  // Get exact music
  const getMusic = async () => {
    const result = await contract.methods
                        .getMusic(searchMusic, searchArtist)
                        .call({ from: accounts[0] });

    return result;
  }

  // Get relevant music name list given start index and depth (how many names to return)
  const getRelevantMusicNameList = async (index, depth) => {
    const result = await contract.methods
                        .getRelevantMusicNameList(searchMusic, index, depth)
                        .call({ from: accounts[0] });

    return result;
  }

  // Get relevant artist name list given start index and depth (how many artists to return)
  const getRelevantArtistNameList = async (index, depth) => {
    const result = await contract.methods
                        .getRelevantArtistNameList(searchArtist, index, depth)
                        .call({ from: accounts[0] });

    return result;
  }

  // Get relevant music and artist name list given start index and depth (how many names and artist to return)
  const getRelevantMusicArtistList = async (index, depth) => {
    const result = await contract.methods
                        .getRelevantMusicArtistList(searchMusic, searchArtist, index, depth)
                        .call({ from: accounts[0] });

    return result;
  }

  // Perform search if given both music name and artist name
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

      return moreResult;
    }

    result = [result];
    return result;
  }

  // Perform search if given only artist name
  const getArtistSearchList = async (index, more = false) => {
    let result;

    // If we want more artists, we have to set result to 0
    if(!more) {
      result = await getMusicArtistList();
    } else {
      result = [];
    }

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

    return result;
  }

  // Perform search if given only music name
  const getMusicSearchList = async (index, more = false) => {
    let result;

    // If we want more music, we have to clear the set result to 0
    if(!more) {
      result = await getArtistMusicList();
    } else {
      result = [];
    }

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

  // The main search function
  const getSearchList = async () => {
    // Before perform each search, we will clear the previous search result
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
      setExactSearchRows(result);
    } else if (artistSearch) {
      result = await getArtistSearchList(0);
      setArtistSearchRows(result);
    } else if (musicSearch) {
      result = await getMusicSearchList(0);
      setMusicSearchRows(result);
    } else {
      alert("You have to input music or artist name!");
      setSearchPending(false);
      return;
    }

    setSearchRows(result)
    setSearchPending(false)
    console.log(result);
  }

  // Get more result, it should trigger to get more 10 result
  const getMoreSearchList = async () => {
    setSearchPending(true);
    let oldResult;
    let result;

    const exactSearch = searchMusic !== "" && searchArtist !== "";
    const artistSearch = searchMusic !== "";
    const musicSearch = searchArtist !== "";

    // For different condition, fetch different data from the blockchain
    if (exactSearch) {
      // No support for exact search when requesting more result
      alert("You have to type the right music and artist name!");
      setSearchPending(false);
      return;
    } else if (artistSearch) {
      if (artistSearchIndex < 0) {
        alert("No more music!");
        setSearchPending(false);
        return;
      }
      oldResult = artistSearchRows;
      result = await getArtistSearchList(artistSearchIndex, true);
      result = oldResult.concat(result);
      setArtistSearchRows(result);
    } else if (musicSearch) {
      if (musicSearchIndex < 0) {
        alert("No more music!");
        setSearchPending(false);
        return;
      }
      oldResult = musicSearchRows;
      result = await getMusicSearchList(musicSearchIndex, true);
      result = oldResult.concat(result);
      setMusicSearchRows(result);
    } else {
      alert("You have to input music or artist name!");
      setSearchPending(false);
      return;
    }

    setSearchRows(result)
    setSearchPending(false)
    console.log(result);
  }

  const getSearchListJS = async () => {
    setSearchPending(true);
    let allMusics = [];
    let tempMusics = [];
    let result = [];
    allMusics = await contract.methods
                      .getMusicList()
                      .call({ from: accounts[0] });
    
    if (searchMusic !== "") {
      tempMusics = allMusics.filter(music => music.name.includes(searchMusic));
    } else {
      tempMusics = allMusics;
    }

    if (searchArtist !== "") {
      result = tempMusics.filter(music => music.artist.includes(searchArtist));
    } else {
      result = tempMusics;
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
                    // handle_searchMusic();
                    getSearchListJS();
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
