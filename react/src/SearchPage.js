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

  // From props
  const web3 = props.web3;
  const accounts = props.accounts;
  const contract = props.contract;
  const setPlayersrc = props.setPlayersrc;
  const setPage = props.setPage;

  useEffect(() => {
    setPage("Search");
  }, []);

  // States
  const [searchMusic, setSearchMusic] = useState("");
  const [searchArtist, setSearchArtist] = useState("");
  const [searchRows, setSearchRows] = useState([]);
  const [isSearchPending, setSearchPending] = useState(false);

  const getSearchListJS = async () => {
    setSearchPending(true);
    let allMusics = [];
    let tempMusics = [];
    let result = [];

    // Get all musics from the blockchain
    allMusics = await contract.methods
      .getMusicList()
      .call({ from: accounts[0] });

    // Filter result based on music name
    if (searchMusic !== "") {
      tempMusics = allMusics.filter((music) => {
        let lowerCaseMusic = music.name.toLowerCase();
        let lowerCaseSearchMusic = searchMusic.toLowerCase();

        return lowerCaseMusic.includes(lowerCaseSearchMusic);
      });
    } else {
      tempMusics = allMusics;
    }

    // Filter result based on artist name
    if (searchArtist !== "") {
      result = tempMusics.filter((music) => {
        let lowerCaseArtist = music.artist.toLowerCase();
        let lowerCaseSearchArtist = searchArtist.toLowerCase();

        return lowerCaseArtist.includes(lowerCaseSearchArtist);
      });
    } else {
      result = tempMusics;
    }

    // Set result to be rendered
    setSearchRows(result);
    setSearchPending(false);
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
