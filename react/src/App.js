import { Input } from "antd";
import Web3 from "web3";
import getWeb3 from "./utils/getWeb3";
import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import { downloadAudioIPFS } from "./ipfs/download";
import MusicDAppContract from "./build/contracts/MusicDApp.json";
// import MusicCoinContract from './build/contracts/MusicCoin.json';
// import ERC20Contract from './build/contracts/IERC20.json';

import clsx from "clsx";
import {
  CssBaseline,
  makeStyles,
  Container,
  Box,
  Grid,
  Paper,
  AppBar,
  Toolbar,
  Drawer,
  List,
  Typography,
  Divider,
  Badge,
  TextField,
  Link,
  Button,
  IconButton,
  Snackbar,
} from "@material-ui/core";

import Alert from "@material-ui/lab/Alert";

import UploadPage from "./UploadPage";
import TestingPage from "./TestingPage";
import AccountPage from "./AccountPage";
import DashboardPage from "./DashboardPage";
import SearchPage from "./SearchPage";
import SongDetailPage from "./SongDetailPage";
import MusicPlayer from "./components/MusicPlayer";

import {
  mainListItems,
  secondaryListItems,
} from "./components/DrawerListItems";

import MenuIcon from "@material-ui/icons/Menu";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import NotificationsIcon from "@material-ui/icons/Notifications";

// defines CSS style properties for App()
const drawerWidth = 240;
const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },
  toolbar: {
    paddingRight: 24, // keep right padding when drawer closed
    backgroundColor: "#a3d2ca",
  },
  toolbarIcon: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    padding: "0 8px",
    ...theme.mixins.toolbar,
  },
  chevronleftIcon: {
    color: "white",
  },
  listItems: {
    color: "white",
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: 36,
  },
  menuButtonHidden: {
    display: "none",
  },
  title: {
    flexGrow: 1,
  },
  drawerPaper: {
    backgroundColor: "#808080",
    position: "relative",
    whiteSpace: "nowrap",
    width: drawerWidth,
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerPaperClose: {
    overflowX: "hidden",
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    width: theme.spacing(7),
    [theme.breakpoints.up("sm")]: {
      width: theme.spacing(9),
    },
  },
  appBarSpacer: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    height: "100vh",
    overflow: "auto",
    backgroundColor: "#202020",
  },
  footerbar: {
    zIndex: theme.zIndex.drawer + 1,
    top: "auto",
    bottom: 0,
    backgroundColor: "#FDFAF6",
    height: "11vh",
    justifyContent: "center",
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  footerbarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    top: "auto",
    bottom: 0,
    backgroundColor: "#FDFAF6",
    height: "11vh",
    justifyContent: "center",
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
}));

function App() {
  const classes = useStyles();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [page, setPage] = useState("Dashboard");

  const [songHash, setSongHash] = useState("");
  const [web3, setWeb3] = useState({});
  const [accounts, setAccounts] = useState([]);
  const [contract, setContract] = useState({});
  // const [playersrc, setPlayersrc] = useState("");

  const [musicList, setMusicList] = useState([
    // {id: 0, name: "Silence", artist: "Khalid", onChoose: true, onPlay: false, src: 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/308622/Marshmello%20-%20Silence%20ft.%20Khalid.mp3'},
    // {id: 1, name: "Fireproof", artist: "VAX, Teddy Sky", onChoose: false, onPlay: false, src: 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/308622/VAX%20-%20Fireproof%20Feat%20Teddy%20Sky.mp3'},
  ]);

  useEffect(async () => {
    document.title = "MusicChain";
    await connectWeb3();
  }, []);

  const getEthWeb3 = async () => {
    await window.ethereum.send("eth_requestAccounts");
    window.web3 = new Web3(window.ethereum);
    return window.web3;
  };

  const connectWeb3 = async () => {
    console.log("Connect To Blockchain");
    const web3Instance = await getEthWeb3();
    const accountsInstance = await web3Instance.eth.getAccounts();
    const networkId = await web3Instance.eth.net.getId();
    const deployedNetwork = MusicDAppContract.networks[networkId];
    const contractInstance = new web3Instance.eth.Contract(
      MusicDAppContract.abi,
      deployedNetwork && deployedNetwork.address
    );

    setWeb3(web3Instance);
    setAccounts(accountsInstance);
    setContract(contractInstance);
  };

  const handleDrawerOpen = () => {
    setDrawerOpen(true);
  };
  const handleDrawerClose = () => {
    setDrawerOpen(false);
  };

  // for alert msg
  const [alertmsg, setAlermsg] = useState("");
  const [openAlert, setOpenAlert] = useState(false);
  const handleCloseAlertMsg = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenAlert(false);
  };
  const callAlert = (msg) => {
    setAlermsg(msg);
    setOpenAlert(true);
  };

  return (
    <Router>
      <div className={classes.root}>
        <CssBaseline />

        <Snackbar
          open={openAlert}
          autoHideDuration={6000}
          onClose={handleCloseAlertMsg}
        >
          <Alert onClose={handleCloseAlertMsg} severity="error">
            {alertmsg}
          </Alert>
        </Snackbar>

        <AppBar
          position="absolute"
          className={clsx(classes.appBar, drawerOpen && classes.appBarShift)}
        >
          <Toolbar className={classes.toolbar}>
            <IconButton
              edge="start"
              color="inherit"
              aria-label="open drawer"
              onClick={handleDrawerOpen}
              className={clsx(
                classes.menuButton,
                drawerOpen && classes.menuButtonHidden
              )}
            >
              <MenuIcon />
            </IconButton>

            <Typography
              component="h1"
              variant="h6"
              color="inherit"
              noWrap
              className={classes.title}
            >
              {page}
            </Typography>

            <Typography
              component="h1"
              variant="h6"
              color="inherit"
              // noWrap
              className={classes.title}
            >
              {"MusicChain - "}
              {accounts.length ? accounts[0] : "no account selected yet"}
            </Typography>

            <div>
              <Button
                variant="contained"
                onClick={async () => {
                  connectWeb3();
                }}
              >
                Connect
              </Button>
            </div>

            {/* <IconButton color="inherit">
              <Badge badgeContent={3} color="secondary">
                <NotificationsIcon />
              </Badge>
            </IconButton> */}
          </Toolbar>
        </AppBar>

        <Drawer
          variant="permanent"
          classes={{
            paper: clsx(
              classes.drawerPaper,
              !drawerOpen && classes.drawerPaperClose
            ),
          }}
          open={drawerOpen}
        >
          <div className={classes.toolbarIcon}>
            <IconButton onClick={handleDrawerClose}>
              <ChevronLeftIcon className={classes.chevronleftIcon} />
            </IconButton>
          </div>

          <Divider />
          <List className={classes.listItems}>{mainListItems(setPage)}</List>
          <Divider />
          <List className={classes.listItems}>
            {secondaryListItems(setPage)}
          </List>
        </Drawer>

        {/* Main content of each page */}

        <main className={classes.content}>
          <div className={classes.appBarSpacer} />
          <Switch>
            <Route exact path="/">
              <DashboardPage
                web3={web3}
                contract={contract}
                accounts={accounts}
                setPage={setPage}
              />
            </Route>
            <Route exact path="/search">
              <SearchPage
                web3={web3}
                contract={contract}
                accounts={accounts}
                setPage={setPage}
                setMusicList={setMusicList}
              />
            </Route>
            <Route exact path="/test">
              <TestingPage
                web3={web3}
                contract={contract}
                accounts={accounts}
                setPage={setPage}
                setMusicList={setMusicList}
              />
            </Route>
            <Route exact path="/detail/:queryhash">
              <SongDetailPage
                web3={web3}
                contract={contract}
                accounts={accounts}
                setPage={setPage}
                musicList={musicList}
                setMusicList={setMusicList}
              />
            </Route>
            <Route exact path="/dashboard">
              <DashboardPage
                web3={web3}
                contract={contract}
                accounts={accounts}
                setPage={setPage}
              />
            </Route>
            <Route exact path="/upload">
              <UploadPage
                web3={web3}
                contract={contract}
                accounts={accounts}
                setPage={setPage}
                callAlert={callAlert}
              />
            </Route>
            <Route exact path="/account">
              <AccountPage
                web3={web3}
                contract={contract}
                accounts={accounts}
                setPage={setPage}
              />
            </Route>
          </Switch>
          {/* <div>{contentComponent}</div> */}
        </main>

        {/* Could design a music player in the footer */}
        <AppBar
          position="fixed"
          className={clsx(
            classes.footerbar,
            drawerOpen && classes.footerbarShift
          )}
        >
          <MusicPlayer musicList={musicList} setMusicList={setMusicList} />
        </AppBar>
      </div>
    </Router>
  );
}

export default App;
