import React, { useState, useEffect } from "react";
import clsx from "clsx";

import musicChain_diagram from './img/MusicChainArchitecture.svg';

import {
  makeStyles,
  Container,
  Typography,
  Box,
  Grid,
  Paper,
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
    backgroundColor: "#C0C0C0",
  },
  fixedHeight: {
    height: 240,
  },
  websiteDiagram: {
    width: "80%",
    margin: "auto",
  },
}));

const DashboardPage = (props) => {
  const classes = useStyles();
  const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);

  // from props
  const web3 = props.web3;
  const accounts = props.accounts;
  const contract = props.contract;
  const setPage = props.setPage;

  useEffect(() => {
    setPage("DashBoard");
  }, []);

  return (
    <Container maxWidth="lg" className={classes.container}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper className={classes.paper}>
            <Typography
              component='h2'
              variant='h6'
              gutterBottom
              style={{ color: 'white', fontSize: 32 }}
            >
              Music Chain - Use Guide
            </Typography>
            <img src={musicChain_diagram} className={classes.websiteDiagram}  alt=""></img>
            <h2>Quick Start</h2>

            <h2>Account</h2>

              <p>The page shows information of your Account.</p>

              <p>Each account has the following properties.</p>

              <ul>
                <li>The account token balance.</li>
                <li>The account upload music list.</li>
                <li>The account bought music list.</li>
              </ul>

              <p>
                In this page, you also have several buttons to buy and sell tokens, though we have some
                rules for it.
              </p>

              <p>
                You at least have to buy 100 tokens, which is the basic unit. At most you can buy 10000 
                tokens at a time. 
              </p>

              <p>
                If your tokens number is greater than 100, you are allowed to sell some of them. At most you
                can sell up to "CURRENT - 100" tokens.
              </p>

              <p>
                A special one is tranfer token. If you find an uploader is great, you can transfer some of you
                token to that uploader. But at the same time, the basic unit is 100 tokens. At most you can transfer 
                1000 tokens at a time.
              </p>


            <h2>Search</h2>

             <p>You can search music by name or artist.</p>

            <h2>Upload</h2>

              <p>You can upload the music on this page.</p>

              <p>Warning! You have to first connect the blockchain!</p>              

              <p>
                For each music to upload, the uploader are required to fill in the music name and artist name.
                After filled in the required information, you can press the "SELECT FILE" button to select the music.
                Then the music will be uploaded to IPFS, while it will also be sent to our backend server, which perform
                copyright check. If the check pass, then it will fire a transaction (pop up a Metamask window) for you 
                to approve. Once the transaction is successfully committed, your music is uploaded to the blockchain. 
              </p>

              <p>
                Before uploading, there are some constraint for uploading music.
              </p>
              <ol>
                <li>The combination of the (name, artist) pair must be unique.</li>
                <li>The uploader is not allowed to upload the same music. Our server will reject this upload.</li>
                <li>
                  If the upload music has similarity less than one of the music on the blockchain, it is said
                  it covers from another song. To preserve copyright, half of the revenue of this music will be
                  given to the original uploader. If there are several similiar musics, we will choose them most
                  similar one.
                </li>
              </ol>

            <h2>Testing</h2>

              <p>This page has several testing utilities for developer to use.</p>
              <p>
                There are four input field on the top of this page. When you scroll down, you can see 
                many buttons, each represent a unique public function that exposed by the smart contract.
                For some of the testing function, it may require some input value such as song name or 
                artist name. In this situation, you have to fill in the input field on top of this page. 
              </p>

              <p>
                For example, when you want to perform search a certain, you are required to give the music 
                name and artist name. After some typing, then press "TEST GET MUSIC" for testing this function.
              </p>

              <p>
                At the bottom, you can directly enter the IPFS hash of a song and download it. If the music
                exists in the IPFS, you will find the music player is loaded with a music, then you can listen 
                to the music by pressing the play button.
              </p>

              <p>
                Note that this page is just for testing purpose, if someone wants to deploy it on to your own
                server, make sure you remove this field, or it many lead to some security concerns.
              </p>

            <h2>Links</h2>

            <a href="https://github.com/woodcutter-eric/nmlab-final">GitHub Repo</a>

          </Paper>
        </Grid>
      </Grid>
      <Box pt={4}></Box>
    </Container>
  );
};

export default DashboardPage;
