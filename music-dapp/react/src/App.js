import './App.css';
import { Input } from 'antd';
import getWeb3 from './utils/getWeb3';
import React, { useState, useEffect } from 'react';
import { uploadAudioIPFS } from './ipfs/upload';
import { downloadAudioIPFS } from './ipfs/download';
import MusicDAppContract from './build/contracts/MusicDApp.json';

import clsx from 'clsx';
import {
  CssBaseline, makeStyles,
  Container, Box, Grid, Paper, AppBar, Toolbar, Drawer,
  List, Typography, Divider, Badge,
  TextField, Link, Button, IconButton
} from '@material-ui/core';

import Upload from './components/Upload';
import Dashboard from './components/Dashboard';
import Account from './components/Account';
import Testing from './components/Testing';
import { mainListItems, secondaryListItems } from './components/DrawerListItems';

import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import NotificationsIcon from '@material-ui/icons/Notifications';

// defines CSS style properties for App()
const drawerWidth = 240;
const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  toolbar: {
    paddingRight: 24, // keep right padding when drawer closed
    backgroundColor: '#a3d2ca'
  },
  toolbarIcon: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: '0 8px',
    ...theme.mixins.toolbar,
  },
  chevronleftIcon: {
    color: 'white'
  },
  listItems: {
    color: 'white'
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: 36,
  },
  menuButtonHidden: {
    display: 'none',
  },
  title: {
    flexGrow: 1,
  },
  drawerPaper: {
    backgroundColor: '#808080',
    position: 'relative',
    whiteSpace: 'nowrap',
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerPaperClose: {
    overflowX: 'hidden',
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    width: theme.spacing(7),
    [theme.breakpoints.up('sm')]: {
      width: theme.spacing(9),
    },
  },
  appBarSpacer: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    height: '100vh',
    overflow: 'auto',
    backgroundColor: '#202020',
  },
}));

function App() {
  const classes = useStyles();
  const [drawerOpen, setDrawerOpen] = useState(true);
  const [page, setPage] = useState("Testing");

  const [songname, setSongName] = useState('');
  const [songartist, setSongArtist] = useState('');
  const [songdata, setSongData] = useState({ selectedFile: null });
  const [fileTextField, setFileTextField] = useState("you haven't select a file yet...");
  const [songHash, setSongHash] = useState('');
  const [fingerprstatus, setFingerprstatus] = useState('no file yet');
  const [matchresult, setMatchresult] = useState('no file yet');
  const [web3, setWeb3] = useState({});
  const [accounts, setAccounts] = useState([]);
  const [contract, setContract] = useState({});

  // testing
  const [searchMusic, setSearchMusic] = useState('');
  const [searchArtist, setSearchArtist] = useState('');

  useEffect(async () => {
    try {
      const web3Instance = await getWeb3();
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
    } catch (error) {
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`
      );
      console.error(error);
    }
  });

  const handleDrawerOpen = () => {
    setDrawerOpen(true);
  };
  const handleDrawerClose = () => {
    setDrawerOpen(false);
  };

  const uplaodMusicBlockchain = async (retHash) => {
    try {
      const music = await contract.methods
        .uploadMusic(retHash, songname, songartist, 'None')
        .send({ from: accounts[0] });

      console.log(music);
    } catch (error) {
      console.log(error);
    }
  };

  const handleUploads = async () => {
    // console.log(`web3: ${web3}`);
    // console.log(`accounts: ${accounts}`);
    // console.log(`contract: ${contract}`);
    // Force user to fill these input field
    if (!songname) {
      alert('You have to set the SONG name!');
      return;
    }
    if (!songartist) {
      alert('You have to set the ARTIST name!');
      return;
    }
    if (!songdata.selectedFile) {
      alert('You have to upload a file!');
      return;
    }

    if (songdata.selectedFile.size >= 100000000) {
      alert('The file limit is 100 MB!');
      setSongData({ selectedFile: null });
      return;
    }

    uploadAudioIPFS(songdata.selectedFile, songname, (retHash) => {
      setSongHash(retHash);
      const source = new EventSource(
        `http://localhost:3001/processupload?h=${retHash}`,
        { withCredentials: true }
      );
      source.addEventListener('message', (message) => {
        console.log('Got', message.data);
        let msg_obj = JSON.parse(message.data);
        if (msg_obj.status === 'done') {
          source.close();
        } else if (msg_obj.status === 'matching_results') {
          setMatchresult(message.data);
        } else {
          setFingerprstatus(message.data);
        }
      });

      uplaodMusicBlockchain(retHash);
    });

    // reset input data
    setSongName('');
    setSongArtist('');
    setFileTextField("you haven't select a file yet...");
  };

  // components props passed down
  const uploadProps = {
    songname: songname, setSongName: setSongName,
    songartist: songartist, setSongArtist: setSongArtist,
    songdata: songdata, setSongData: setSongData,
    fileTextField: fileTextField, setFileTextField: setFileTextField,
    handleUploads: handleUploads,
  }

  const testingProps = {
    searchMusic: searchMusic, setSearchMusic: setSearchMusic,
    searchArtist: searchArtist, setSearchArtist: setSearchArtist,
    songHash: songHash, setSongHash: setSongHash,
    accounts: accounts,
    contract: contract,
    downloadAudioIPFS: downloadAudioIPFS,
  }

  // define routes of content pages
  let contentComponent = null;
  switch (page) {
    case "Dashboard":
      contentComponent = Dashboard();
      break;
    case "Upload":
      contentComponent = Upload(uploadProps);
      break;
    case "Account":
      contentComponent = Account();
      break;
    case "Testing":
      contentComponent = Testing(testingProps);
      break;
    default:
      contentComponent = Upload(uploadProps);
  }

  // return (
  //   <div className='App'>
  //     <div className='App-main'>
  //       <div className='App-interface'>
  //         <div className='upload-box'>
  //           <div className='content'>

  //             <div className='info-box'>
  //               <span>FingerPrint processing status :</span>
  //               {fingerprstatus}
  //               <br />
  //               {matchresult}
  //             </div>

              
  //           </div>
  //         </div>
  //       </div>
  //     </div>
  //   </div>
  // );

  return (
    <div className={classes.root}>
      <CssBaseline />

      <AppBar position="absolute" className={clsx(classes.appBar, drawerOpen && classes.appBarShift)}>
        <Toolbar className={classes.toolbar}>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            className={clsx(classes.menuButton, drawerOpen && classes.menuButtonHidden)}
          >
            <MenuIcon />
          </IconButton>

          <Typography component="h1" variant="h6" color="inherit" noWrap className={classes.title}>
            {page}
          </Typography>

          <IconButton color="inherit">
            <Badge badgeContent={3} color="secondary">
              <NotificationsIcon />
            </Badge>
          </IconButton>
        </Toolbar>
      </AppBar>

      <Drawer
        variant="permanent"
        classes={{
          paper: clsx(classes.drawerPaper, !drawerOpen && classes.drawerPaperClose),
        }}
        open={drawerOpen}
      >
        <div className={classes.toolbarIcon}>
          <IconButton onClick={handleDrawerClose}>
            <ChevronLeftIcon className={classes.chevronleftIcon}/>
          </IconButton>
        </div>

        <Divider />
        <List className={classes.listItems}>{mainListItems(setPage)}</List>
        <Divider />
        <List className={classes.listItems}>{secondaryListItems(setPage)}</List>
      </Drawer>

      {/* Main content of each page */}
      <main className={classes.content}>
        <div className={classes.appBarSpacer} />
        <div>{contentComponent}</div>
      </main>

      {/* Could design a music player in the footer */}
    </div>
  );
}

export default App;
