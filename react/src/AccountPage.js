import React, { useState, useEffect } from "react";
import clsx from "clsx";

import SearchResultList from "./components/SearchResultList";

import {
  makeStyles,
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  TextField,
  Button,
} from "@material-ui/core";

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
    height: 240,
  },
}));

const AccountPage = (props) => {
  const classes = useStyles();
  const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);

  const [userBalance, setUserBalance] = useState(0);
  const [userUploadSongs, setUserUploadSongs] = useState([]);
  const [userBoughtSongs, setUserBoughtSongs] = useState([]);
  const [isPendingUploadSongs, setIsPendingUploadSongs] = useState(true);
  const [isPendingBoughtSongs, setIsPendingBoughtSongs] = useState(true);
  const [sellTokenNumber, setSellTokenNumber] = useState(0);

  // from props
  const web3 = props.web3;
  const accounts = props.accounts;
  const contract = props.contract;
  const setPage = props.setPage;
  // for alert msg
  const callAlert = props.callAlert;

  useEffect(() => {
    setPage("Account");
  }, []);

  useEffect(async () => {
    await getAllUserData();
  }, [accounts, contract]);

  const getAllUserData = async () => {
    if (contract.methods == undefined) {
      return;
    } else if (accounts.length == 0) {
      return;
    }

    await getUserBalance();
    await getUploadMusicList();
    await getBoughtMusicList();
  };

  const getUserBalance = async () => {
    const result = await contract.methods
      .getUserBalance()
      .call({ from: accounts[0] });
    console.log(result);
    setUserBalance(result);
  };

  const getUploadMusicList = async () => {
    setIsPendingUploadSongs(true);
    const result = await contract.methods
      .getUploadMusicList()
      .call({ from: accounts[0] });
    // console.log(result);
    let _uploadSongs = [];
    for (const x of result) {
      const song_metadata = await getMusicByHash(x);
      _uploadSongs.push(song_metadata);
    }
    console.log(_uploadSongs);
    setUserUploadSongs(_uploadSongs);
    setIsPendingUploadSongs(false);
  };

  const getBoughtMusicList = async () => {
    setIsPendingBoughtSongs(true);
    const result = await contract.methods
      .getBoughtMusicList()
      .call({ from: accounts[0] });
    let _boughtSongs = [];
    for (const x of result) {
      const song_metadata = await getMusicByHash(x);
      _boughtSongs.push(song_metadata);
    }
    console.log(_boughtSongs);
    setUserBoughtSongs(_boughtSongs);
    setIsPendingBoughtSongs(false);
  };

  const getMusicByHash = async (searchHash) => {
    const result = await contract.methods
      .getMusicByHash(searchHash)
      .call({ from: accounts[0] });
    return result;
  };

  const buy100Token = async () => {
    const result = await contract.methods
      .buy()
      .send({ from: accounts[0], value: web3.utils.toWei("0.01", "ether") });
    console.log(result);
    getUserBalance();
  };

  const buy1000Token = async () => {
    const result = await contract.methods
      .buy()
      .send({ from: accounts[0], value: web3.utils.toWei("0.1", "ether") });
    console.log(result);
    getUserBalance();
  };

  const buy10000Token = async () => {
    const result = await contract.methods
      .buy()
      .send({ from: accounts[0], value: web3.utils.toWei("1", "ether") });
    console.log(result);
    getUserBalance();
  };

  const sellToken = async () => {
    const balance = parseInt(userBalance);
    const sellNumber = parseInt(sellTokenNumber);
    if (balance < sellNumber) {
      console.log("not enough!");
      return;
    }
    const result = await contract.methods
      .sell(sellNumber)
      .send({ from: accounts[0] });
    console.log(result);
    getUserBalance();
    setSellTokenNumber(0);
  };

  return (
    <Container maxWidth="lg" className={classes.container}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={4} lg={4}>
          <Paper className={classes.paper}>
            <Typography
              component="h2"
              variant="h6"
              gutterBottom
              style={{ color: "white", fontSize: 20 }}
            >
              User Info
              <p></p>
              Balance: {userBalance}
              <p></p>
              Uploaded Songs: {userUploadSongs.length}
              <p></p>
              Bought Songs: {userBoughtSongs.length}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4} lg={4}>
          <Paper className={classes.paper}>
            <Typography
              component="h2"
              variant="h6"
              gutterBottom
              style={{ color: "white", fontSize: 20 }}
            >
              Buy
            </Typography>
            <Button
              variant="contained"
              onClick={() => {
                buy100Token();
              }}
            >
              Buy 100 Tokens
            </Button>
            <p></p>
            <Button
              variant="contained"
              onClick={() => {
                buy1000Token();
              }}
            >
              Buy 1000 Tokens
            </Button>
            <p></p>
            <Button
              variant="contained"
              onClick={() => {
                buy10000Token();
              }}
            >
              Buy 10000 Tokens
            </Button>
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
              Sell
            </Typography>
            <TextField
              id="name-textfield"
              label="Token"
              placeholder="Type token to sell..."
              multiline
              variant="outlined"
              size="small"
              value={sellTokenNumber}
              onChange={(event) => {
                setSellTokenNumber(event.target.value);
              }}
            />
            <p></p>
            <Button
              variant="contained"
              onClick={() => {
                sellToken();
              }}
            >
              Sell Token
            </Button>
            <p></p>
            <Typography
              component="h2"
              variant="h6"
              gutterBottom
              style={{ color: "orange", fontSize: 20 }}
            >
              {parseInt(userBalance) < parseInt(sellTokenNumber)
                ? "No enough balance!"
                : ""}
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6} lg={6}>
          <Paper className={fixedHeightPaper}>
            <Typography
              component="h2"
              variant="h6"
              gutterBottom
              style={{ color: "white", fontSize: 20 }}
            >
              Uploads
            </Typography>
            {isPendingUploadSongs || userUploadSongs.length ? (
              <SearchResultList rows={userUploadSongs} minColumns={true} />
            ) : (
              "No Songs Yet"
            )}
          </Paper>
        </Grid>

        <Grid item xs={12} md={6} lg={6}>
          <Paper className={fixedHeightPaper}>
            <Typography
              component="h2"
              variant="h6"
              gutterBottom
              style={{ color: "white", fontSize: 20 }}
            >
              Bought
            </Typography>
            {isPendingBoughtSongs || userBoughtSongs.length ? (
              <SearchResultList rows={userBoughtSongs} minColumns={true} />
            ) : (
              "No Songs Yet"
            )}
          </Paper>
        </Grid>
      </Grid>
      <Box pt={4}></Box>
    </Container>
  );
};

export default AccountPage;
