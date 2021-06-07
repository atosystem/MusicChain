import React, { useState, useEffect } from 'react';
import clsx from 'clsx';

import {
  makeStyles,
  Container, Box, Grid, Paper
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

  setPage("DashBoard");

  return (
    <Container maxWidth="lg" className={classes.container} >
      <Grid container spacing={3}>

        <Grid item xs={12} md={8} lg={6} >
          <Paper className={fixedHeightPaper}>

          </Paper>
        </Grid>

        <Grid item xs={12} md={4} lg={6}>
          <Paper className={fixedHeightPaper}>

          </Paper>
        </Grid>

        <Grid item xs={12}>
          <Paper className={classes.paper}>

          </Paper>
        </Grid>
      </Grid>
      <Box pt={4}>

      </Box>
    </Container>
  )
}

export default DashboardPage;