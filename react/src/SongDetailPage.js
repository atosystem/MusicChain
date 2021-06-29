import React, { useState, useEffect } from "react";
import clsx from "clsx";
import { downloadAudioIPFS } from "./ipfs/download";
import Moment from "moment";
import AlbumIcon from "@material-ui/icons/Album";

import {
  makeStyles,
  Container,
  Grid,
  Paper,
  Typography,
  TextField,
  Button,
  Stepper,
  Step,
  StepContent,
  StepLabel,
} from "@material-ui/core";

import Timeline from "@material-ui/lab/Timeline";
import TimelineItem from "@material-ui/lab/TimelineItem";
import TimelineSeparator from "@material-ui/lab/TimelineSeparator";
import TimelineConnector from "@material-ui/lab/TimelineConnector";
import TimelineContent from "@material-ui/lab/TimelineContent";
import TimelineDot from "@material-ui/lab/TimelineDot";
import TimelineOppositeContent from "@material-ui/lab/TimelineOppositeContent";

import GetAppIcon from "@material-ui/icons/GetApp";
import { useParams, useHistory } from "react-router";
import { BrowserRouter as Router, Link } from "react-router-dom";

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
    height: 480,
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

const SongDetailPage = (props) => {
  const classes = useStyles();
  const fixedHeightPaper = clsx(classes.paper);
  const history = useHistory();

  // from props
  const web3 = props.web3;
  const accounts = props.accounts;
  const contract = props.contract;

  const musicList = props.musicList;
  const setMusicList = props.setMusicList;
  const setPage = props.setPage;

  // for alert msg
  const callAlert = props.callAlert;

  // states
  const [songHash, setSongHash] = useState("");
  const [songName, setSongName] = useState("");
  const [songArtist, setSongArtist] = useState("");
  const [searchHash, setSearchHash] = useState("");
  const [songData, setSongData] = useState({});
  const [isMyMusic, setIsMyMusic] = useState(false);
  const [isPurchased, setIsPurchased] = useState(false);
  const [copyrightChain, setCopyrightChain] = useState([]);
  const [userBalance, setUserBalance] = useState(0);

  const { queryhash } = useParams();

  useEffect(() => {
    setPage("Detail");
    setSearchHash(queryhash);
  }, []);

  useEffect(async () => {
    await getMusicByHash();
  }, [accounts, contract, queryhash]);

  useEffect(async () => {
    await getUserBalance();
  }, [accounts, contract]);

  // const testGetMusic = async () => {
  //   const result = await contract.methods
  //     .getMusic(searchMusic, searchArtist)
  //     .call({ from: accounts[0] });
  //   console.log(result);
  //   console.log(result.ipfsHash);
  //   setSongHash(result.ipfsHash);
  // };

  const getMusicByHash = async () => {
    if (contract.methods == undefined) {
      return;
    } else if (accounts.length == 0) {
      return;
    }
    const result = await contract.methods
      .getMusicByHash(queryhash)
      .call({ from: accounts[0] });
    setSongData(result);
    const result_own = await contract.methods
      .findUploadMusic(queryhash)
      .call({ from: accounts[0] });
    setIsMyMusic(result_own);

    const result_purchased = await contract.methods
      .findBoughtMusic(queryhash)
      .call({ from: accounts[0] });
    setIsPurchased(result_purchased);

    const result_chain = await contract.methods
      .getMusicChainByHash(queryhash, 10)
      .call({ from: accounts[0] });
    console.log("result_chain");
    console.log(result_chain.filter((x) => x.ipfsHash !== ""));
    setCopyrightChain(result_chain.filter((x) => x.ipfsHash !== ""));
  };

  const getUserBalance = async () => {
    if (contract.methods == undefined) {
      return;
    } else if (accounts.length == 0) {
      return;
    }
    const balance = await contract.methods
      .getUserBalance()
      .call({ from: accounts[0] });

    setUserBalance(balance);

    return balance;
  };

  const checkUserBalance = async () => {
    const balance = await contract.methods
      .getUserBalance()
      .call({ from: accounts[0] });

    setUserBalance(balance);

    if (parseInt(balance) < 100) {
      console.log("You have no enough balance!");
      return false;
    }

    return true;
  };
  const buyMusic = async () => {
    const hasEnoughBalance = await checkUserBalance();

    if (!hasEnoughBalance) {
      return;
    }

    const result = await contract.methods
      .buyMusicByHash(queryhash)
      .send({ from: accounts[0] });
    console.log(result);
    await getMusicByHash();
  };

  return (
    <Container maxWidth="lg" className={classes.container}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={8} lg={8}>
          <Paper className={fixedHeightPaper}>
            <div>
              <Typography
                component="h2"
                variant="h1"
                gutterBottom
                style={{ color: "white", fontSize: 40 }}
              >
                {songData["name"]}
              </Typography>
            </div>
            <div>
              <Typography
                component="h2"
                variant="h6"
                gutterBottom
                style={{ color: "white", fontSize: 20 }}
              >
                Artist : {songData["artist"]}
              </Typography>
            </div>
            <div>
              <Typography
                component="h2"
                variant="h6"
                gutterBottom
                style={{ color: "white", fontSize: 20 }}
              >
                Upload Time :{" "}
                {Moment.unix(songData["uploadTime"])
                  .zone(8)
                  .format("MM/D/YYYY, hh:mm:ss")}
              </Typography>
            </div>
            <div>
              <Typography
                component="h2"
                variant="h6"
                gutterBottom
                style={{ color: "white", fontSize: 20 }}
              >
                Ipfs Hash : {songData["ipfsHash"]}
              </Typography>
            </div>
            <div>
              <Typography
                component="h2"
                variant="h6"
                gutterBottom
                style={{ color: "white", fontSize: 20 }}
              >
                Uploader : {songData["uploader"]}
              </Typography>
            </div>

            <Typography
              component="h2"
              variant="h6"
              gutterBottom
              style={{ color: "white", fontSize: 15 }}
            >
              {/* need to beautify UI */}
              {/* {songData.hasOwnProperty('coverFrom') && Object.keys(songData).map((k) => {
                return <div key={k} > {k} : {songData[k]}</div>
              })
              } */}
            </Typography>

            <form className={classes.inputForm} noValidate autoComplete="off">
              {/* <div>
                
                <TextField
                  id='name-textfield'
                  label='Name'
                  placeholder="Type song's name..."
                  multiline
                  variant='outlined'
                  size='small'
                  value={songName}
                  onChange={(event) => {
                    setSongName(event.target.value);
                  }}
                />
                <TextField
                  id='artist-textfield'
                  label='Artist'
                  placeholder="Type song's artist..."
                  multiline
                  variant='outlined'
                  size='small'
                  value={songArtist}
                  onChange={(event) => {
                    setSongArtist(event.target.value);
                  }}
                />
                <TextField
                  id='music-hash-textfield'
                  label='Hash'
                  placeholder="Type song's hash..."
                  multiline
                  variant='outlined'
                  size='small'
                  value={searchHash}
                  onChange={(event) => {
                    setSearchHash(event.target.value);
                  }}
                />
              </div> */}

              <div className={classes.testingButtons}>
                <Button
                  variant="contained"
                  disabled={
                    !isMyMusic && !isPurchased && parseInt(userBalance) < 100
                  }
                  onClick={async () => {
                    if (isMyMusic || isPurchased) {
                      // code to call our footer music player
                      let music_src = await downloadAudioIPFS(
                        songData["ipfsHash"]
                      );
                      console.log(music_src);
                      // use songData["name"],songData["artist"],songData["uploader"]
                      let music = {
                        id: songData["ipfsHash"],
                        name: songData["name"],
                        artist: songData["artist"],
                        onChoose: true,
                        onPlay: true,
                        src: music_src,
                      };
                      let newList = musicList.map((m) => {
                        m.onPlay = true;
                        m.onChoose = false;
                        return m;
                      });
                      setMusicList([...newList, music]);
                    } else {
                      buyMusic();
                    }
                  }}
                >
                  {isMyMusic || isPurchased ? "Play Music" : "Buy Music"}
                </Button>
              </div>
            </form>
            <Typography
              component="h2"
              variant="h6"
              gutterBottom
              style={{ color: "orange", fontSize: 20 }}
            >
              {parseInt(userBalance) < 100 && !isMyMusic && !isPurchased
                ? "No enough balance!"
                : ""}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4} lg={4}>
          <Paper className={fixedHeightPaper}>
            <Typography
              component="h2"
              variant="h6"
              gutterBottom
              style={{ color: "white", fontSize: 20 }}
            >
              Copyright Chain
            </Typography>

            <Timeline align="right">
              {copyrightChain.length &&
                copyrightChain.map((ent, index) => {
                  return (
                    <TimelineItem key={ent.ipfsHash}>
                      <TimelineOppositeContent>
                        <Typography color="textSecondary">
                          {ent.artist}
                        </Typography>
                      </TimelineOppositeContent>
                      <TimelineSeparator>
                        <TimelineDot
                          color={index == 0 ? "secondary" : "primary"}
                        />
                        <TimelineConnector />
                      </TimelineSeparator>
                      <TimelineContent>
                        <Typography>
                          {/* <Link to={`/detail/${ent.ipfsHash}`}>{ent.name}</Link> */}
                          {searchHash == ent.ipfsHash ? (
                            ent.name
                          ) : (
                            <Button
                              onClick={() => {
                                history.push(`/detail/${ent.ipfsHash}`);
                              }}
                            >
                              {ent.name}
                            </Button>
                          )}
                        </Typography>
                      </TimelineContent>
                    </TimelineItem>
                  );
                })}
            </Timeline>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default SongDetailPage;
