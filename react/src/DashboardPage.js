import React, { useState, useEffect } from "react";
import clsx from "clsx";

import musicChain_diagram from "./img/MusicChainArchitecture.svg";

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
              component="h2"
              variant="h6"
              gutterBottom
              style={{ color: "white", fontSize: 32 }}
            >
              Music Chain - Use Guide
            </Typography>
            <img
              src={musicChain_diagram}
              className={classes.websiteDiagram}
              alt=""
            ></img>
          </Paper>
        </Grid>
      </Grid>
      <Box pt={4}></Box>
    </Container>
  );
};

export default DashboardPage;
