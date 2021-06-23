import React, { useState, useEffect } from 'react';
import clsx from 'clsx';

import {
  makeStyles,
  Container,
  Typography,
  Box,
  Grid,
  Paper,
  Button,
} from '@material-ui/core';

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
    setPage('DashBoard');
  }, []);

  return (
    <Container maxWidth='lg' className={classes.container}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper className={classes.paper}>
            <Typography
              component='h2'
              variant='h6'
              gutterBottom
              style={{ color: 'white', fontSize: 32 }}
            >
              Use Guide
            </Typography>

            <h2>Quick Start</h2>

            <h2>Account</h2>

            <h2>Search</h2>

            <h2>Upload</h2>

            <h2>Testing</h2>

            <h2>Links</h2>

            <ul>
              <li>Coffee</li>
              <li>Tea</li>
              <li>Milk</li>
            </ul>

          </Paper>
        </Grid>
      </Grid>
      <Box pt={4}></Box>
    </Container>
  );
};

export default DashboardPage;
