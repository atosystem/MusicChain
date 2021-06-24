import React, { useState, useEffect } from 'react';
import clsx from 'clsx';
import { downloadAudioIPFS } from './ipfs/download';
import Web3 from 'web3';

import {
  makeStyles,
  Container,
  Grid,
  Paper,
  Typography,
  TextField,
  Button,
} from '@material-ui/core';

import GetAppIcon from '@material-ui/icons/GetApp';

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
    height: 480,
  },
  inputForm: {
    '& .MuiTextField-root': {
      margin: theme.spacing(2),
      marginLeft: theme.spacing(4),
      marginRight: theme.spacing(4),
      width: '36ch',
    },
  },
  testingButtons: {
    '& > *': {
      margin: theme.spacing(2),
      marginBottom: theme.spacing(3),
    },
  },
  downloadForm: {
    '& .MuiTextField-root': {
      margin: theme.spacing(2),
      marginLeft: theme.spacing(4),
      marginRight: theme.spacing(4),
      marginBottom: theme.spacing(3),
      width: '60ch',
    },
  },
  downloadbutton: {
    position: 'relative',
    backgroundColor: '#39a9cb',
    margin: theme.spacing(2),
    marginLeft: theme.spacing(4),
    marginRight: theme.spacing(4),
    height: '5ch',
  },
  audioplayer: {
    margin: theme.spacing(2),
  },
}));

const TestingPage = (props) => {
  const classes = useStyles();
  const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);

  // from props
  const web3 = props.web3;
  const accounts = props.accounts;
  const contract = props.contract;
  const setPlayersrc = props.setPlayersrc;
  const setPage = props.setPage;

  useEffect(() => {
    setPage('Test');
  }, []);

  // states
  const [songHash, setSongHash] = useState('');
  const [searchMusic, setSearchMusic] = useState('');
  const [searchArtist, setSearchArtist] = useState('');
  const [searchHash, setSearchHash] = useState('');
  const [searchCoverFrom, setSearchCoverFrom] = useState('');
  const [transToken, setTransToken] = useState('');
  const [batchUploadJsonFile, setBatchUploadJsonFile] = useState([]);

  const testGetMusic = async () => {
    const result = await contract.methods
      .getMusic(searchMusic, searchArtist)
      .call({ from: accounts[0] });
    console.log(result);
    console.log(result.ipfsHash);
    setSongHash(result.ipfsHash);
  };

  const testGetMusicArtistList = async () => {
    const result = await contract.methods
      .getMusicArtistList(searchMusic)
      .call({ from: accounts[0] });
    console.log(result);
  };

  const testGetArtistMusicList = async () => {
    const result = await contract.methods
      .getArtistMusicList(searchArtist)
      .call({ from: accounts[0] });
    console.log(result);
  };

  const testGetUserInfo = async () => {
    const result = await contract.methods
      .getUserInfo()
      .call({ from: accounts[0] });
    console.log(result);
  };

  const testRegisterUser = async () => {
    const result = await contract.methods
      .registerUser()
      .send({ from: accounts[0] });
    console.log(result);
  };

  const batch_upload = async () => {
    // const result = await contract.methods
    //   .uploadMusic()
    //   .send({ from: accounts[0] });
    // console.log(result);
    const bujf = batchUploadJsonFile;
    console.log(bujf);
    if (bujf.length <= 0) {
      return false;
    }

    const fr = new FileReader();

    fr.onload = function (e) {
      console.log(e);
      let result = JSON.parse(e.target.result);
      let formatted = JSON.stringify(result, null, 2);
      // console.log(result)
      // console.log(formatted)

      result.forEach(async (x) => {
        console.log(x)
        try {
          const music = await contract.methods
            .uploadMusic_batch(x["ipfs_hash"], x["title"], x["artist"], x["coverFrom"], x["uploader"])
            .send({ from: accounts[0] });
          console.log(music);
        } catch (error) {
          console.log(error);
        }
      })

    }

    fr.readAsText(bujf.item(0));
  };




  const testUserExists = async () => {
    const result = await contract.methods
      .userExists()
      .call({ from: accounts[0] });
    console.log(result);
  };

  const testUserBalance = async () => {
    const result = await contract.methods
      .getUserBalance()
      .call({ from: accounts[0] });
    console.log(result);
  };

  const testGetMusicByHash = async () => {
    const result = await contract.methods
      .getMusicByHash(searchHash)
      .call({ from: accounts[0] });
    console.log(result);
  };

  const testGetUploadMusicList = async () => {
    const result = await contract.methods
      .getUploadMusicList()
      .call({ from: accounts[0] });
    console.log(result);
  };

  const testGetBoughtMusicList = async () => {
    const result = await contract.methods
      .getBoughtMusicList()
      .call({ from: accounts[0] });
    console.log(result);
  };

  const testFindUploadMusic = async () => {
    const result = await contract.methods
      .findUploadMusic(searchHash)
      .call({ from: accounts[0] });
    console.log(result);
  };

  const testMsgSender = async () => {
    const result = await contract.methods
      .returnMsgSender()
      .call({ from: accounts[0] });
    console.log(result);
  };

  const testBuyToken = async () => {
    const result = await contract.methods
      .buy()
      .send({ from: accounts[0], value: web3.utils.toWei('0.01', 'ether') });
    console.log(result);
  };

  const testSellToken = async () => {
    const result = await contract.methods
      .sell(100)
      .send({ from: accounts[0] });
    console.log(result);
  };

  const testTransferToken = async () => {
    const receiver = "0x42162CE07c846a14026b0535BC9c5f4E59856479";
    const result = await contract.methods
      .transferToken(receiver, 100)
      .send({ from: accounts[0] });
    console.log(result);
  }

  const testInstance = () => {
    console.log(web3);
    console.log(contract);
    console.log(accounts);
  }

  const testGetPoolTokenBalance = async () => {
    const result = await contract.methods
      .getPoolTokenBalance()
      .call({ from: accounts[0] });
    console.log(result);
  };

  const testGetPoolEtherBalance = async () => {
    const result = await contract.methods
      .getPoolEtherBalance()
      .call({ from: accounts[0] });
    console.log(result);
  };

  const testGetContractAddress = async () => {
    const result = await contract.methods
      .getContractAddress()
      .call({ from: accounts[0] });
    console.log(result);
  };

  const testSetMusicCoverFrom = async () => {
    const result = await contract.methods
      .setMusicCoverFrom(searchHash, searchCoverFrom)
      .send({ from: accounts[0] });
    console.log(result);
  }

  const testPopulateMusic1 = async () => {
    const hash1 = "QmTs711cqrjHLfRifJ3sVq9uCfYcmBTXQYgQtQGETLqbFy";
    const name = "夜に駆ける";
    const artist1 = "YOASOBI";
    const coverFrom1 = "None";

    const music1 = await contract.methods
      .uploadMusic(hash1, name, artist1, coverFrom1)
      .send({ from: accounts[0] });

  }

  const testPopulateMusic2 = async () => {
    const hash2 = "QmZd8UPdjJyFqWn3EuWDQkaauoEg49zZaB9Rceg2MzyFXQ";
    const name = "夜に駆ける";
    const artist2 = "N.Flying";
    const coverFrom2 = "QmTs711cqrjHLfRifJ3sVq9uCfYcmBTXQYgQtQGETLqbFy";

    const music2 = await contract.methods
      .uploadMusic(hash2, name, artist2, coverFrom2)
      .send({ from: accounts[0] });
  }

  const testPopulateMusic3 = async () => {
    const hash3 = "QmXv286YdYGpgbwFyHCnLrerJbUPTUm5PSgZLQwCftEpf8";
    const name = "夜に駆ける";
    const artist3 = "百鬼あやめホロ";
    const coverFrom3 = "QmZd8UPdjJyFqWn3EuWDQkaauoEg49zZaB9Rceg2MzyFXQ";

    const music3 = await contract.methods
      .uploadMusic(hash3, name, artist3, coverFrom3)
      .send({ from: accounts[0] });
  }

  const testBuyMusicByHash = async () => {
    const result = await contract.methods
      .buyMusicByHash(searchHash)
      .send({ from: accounts[0] });
  }


  return (
    <Container maxWidth='lg' className={classes.container}>
      <Grid container spacing={6}>
        <Grid item xs={12} md={8} lg={12}>
          <Paper className={fixedHeightPaper}>
            <Typography
              component='h2'
              variant='h6'
              gutterBottom
              style={{ color: 'white', fontSize: 20 }}
            >
              Testing Blockchain
            </Typography>

            <form className={classes.inputForm} noValidate autoComplete='off'>
              <div>
                <TextField
                  id='name-textfield'
                  label='Name'
                  placeholder="Type song's name..."
                  multiline
                  variant='outlined'
                  size='small'
                  value={searchMusic}
                  onChange={(event) => {
                    setSearchMusic(event.target.value);
                  }}
                />
                <TextField
                  id='artist-textfield'
                  label='Artist'
                  placeholder="Type song's artist..."
                  multiline
                  variant='outlined'
                  size='small'
                  value={searchArtist}
                  onChange={(event) => {
                    setSearchArtist(event.target.value);
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
                <TextField
                  id='music-hash-textfield'
                  label='CoverFrom'
                  placeholder="Type song's Cover From..."
                  multiline
                  variant='outlined'
                  size='small'
                  value={searchCoverFrom}
                  onChange={(event) => {
                    setSearchCoverFrom(event.target.value);
                  }}
                />
                <TextField
                  id='music-hash-textfield'
                  label='Token'
                  placeholder="Type token value..."
                  multiline
                  variant='outlined'
                  size='small'
                  value={transToken}
                  onChange={(event) => {
                    setTransToken(event.target.value);
                  }}
                />
              </div>

              <div className={classes.testingButtons}>
                <input
                  accept='*/*'
                  id='contained-button-file'
                  type='file'
                  onChange={(event) => {
                    setBatchUploadJsonFile(event.target.files);
                  }}
                />
                < Button
                  variant='contained'
                  onClick={() => {
                    batch_upload();
                  }}
                >
                  Batch Upload
                </Button>
                <Button
                  variant='contained'
                  onClick={() => {
                    testPopulateMusic1();
                  }}
                >
                  Test testPopulateMusic 1
                </Button>
                <Button
                  variant='contained'
                  onClick={() => {
                    testPopulateMusic2();
                  }}
                >
                  Test testPopulateMusic 2
                </Button>
                <Button
                  variant='contained'
                  onClick={() => {
                    testPopulateMusic3();
                  }}
                >
                  Test testPopulateMusic 3
                </Button>
                <Button
                  variant='contained'
                  onClick={() => {
                    testBuyMusicByHash();
                  }}
                >
                  Test Buy Music By Hash
                </Button>
                <Button
                  variant='contained'
                  onClick={() => {
                    testGetMusic();
                  }}
                >
                  Test Get Music
                </Button>

                <Button
                  variant='contained'
                  onClick={() => {
                    testGetMusicArtistList();
                  }}
                >
                  Test Get Music List
                </Button>

                <Button
                  variant='contained'
                  onClick={() => {
                    testSetMusicCoverFrom();
                  }}
                >
                  Test Set Cover From
                </Button>

                <Button
                  variant='contained'
                  onClick={() => {
                    testGetArtistMusicList();
                  }}
                >
                  Test Get Artist List
                </Button>

                <Button
                  variant='contained'
                  onClick={() => {
                    testMsgSender();
                  }}
                >
                  Test Msg Sender
                </Button>

                <Button
                  variant='contained'
                  onClick={() => {
                    testGetUploadMusicList();
                  }}
                >
                  Test Get User Upload Music List
                </Button>

                <Button
                  variant='contained'
                  onClick={() => {
                    testGetBoughtMusicList();
                  }}
                >
                  Test Get User Bought Music List
                </Button>

                <Button
                  variant='contained'
                  onClick={() => {
                    testFindUploadMusic();
                  }}
                >
                  Test if user upload this music
                </Button>

                <Button
                  variant='contained'
                  onClick={() => {
                    testUserExists();
                  }}
                >
                  Test User Exists
                </Button>



                <Button
                  variant='contained'
                  onClick={() => {
                    testGetUserInfo();
                  }}
                >
                  Test Get User Info
                </Button>

                <Button
                  variant='contained'
                  onClick={() => {
                    testRegisterUser();
                  }}
                >
                  Test Register User
                </Button>

                <Button
                  variant='contained'
                  onClick={() => {
                    testUserBalance();
                  }}
                >
                  Test User Balance
                </Button>

                <Button
                  variant='contained'
                  onClick={() => {
                    testGetMusicByHash();
                  }}
                >
                  Test Get Music By Hash
                </Button>

                <Button
                  variant='contained'
                  onClick={() => {
                    testBuyToken();
                  }}
                >
                  Test Buy token
                </Button>

                <Button
                  variant='contained'
                  onClick={() => {
                    testSellToken();
                  }}
                >
                  Test Sell token
                </Button>

                <Button
                  variant='contained'
                  onClick={() => {
                    testTransferToken();
                  }}
                >
                  Test Transfer Token
                </Button>

                <Button
                  variant='contained'
                  onClick={() => {
                    testGetPoolTokenBalance();
                  }}
                >
                  Test Get Pool Token Balance
                </Button>

                <Button
                  variant='contained'
                  onClick={() => {
                    testGetPoolEtherBalance();
                  }}
                >
                  Test Get Pool Ether Balance
                </Button>

                <Button
                  variant='contained'
                  onClick={() => {
                    testInstance();
                  }}
                >
                  Test Instance
                </Button>

                <Button
                  variant='contained'
                  onClick={() => {
                    testGetContractAddress();
                  }}
                >
                  Test Get Contract Address
                </Button>

              </div>
            </form>

            <Typography
              component='h2'
              variant='h6'
              gutterBottom
              style={{ color: 'white', fontSize: 20 }}
            >
              Download Music
            </Typography>

            <form
              className={classes.downloadForm}
              noValidate
              autoComplete='off'
            >
              <div>
                <TextField
                  id='artist-textfield'
                  label="Song's Hash"
                  placeholder="Type song's hash value..."
                  multiline
                  variant='outlined'
                  size='small'
                  value={songHash}
                  onChange={(event) => {
                    setSongHash(event.target.value);
                  }}
                />

                <Button
                  className={classes.downloadbutton}
                  variant='contained'
                  startIcon={<GetAppIcon />}
                  onClick={async () => {
                    console.log(songHash);
                    let x = await downloadAudioIPFS(songHash);
                    console.log(x);
                    // setPlayersrc(x);
                    document.getElementById('music-play').src = x;
                    // downloadAudioIPFS(songHash);
                  }}
                >
                  Download
                </Button>
              </div>
            </form>

            <Typography
              component='h2'
              variant='h6'
              gutterBottom
              style={{ color: 'white', fontSize: 20 }}
            >
              Music Play
            </Typography>

            <div>
              <audio
                className={classes.audioplayer}
                controls
                src='/media/cc0-audio/t-rex-roar.mp3'
                id='music-play'
              >
                Your browser does not support the
                <code>audio</code> element.
              </audio>
            </div>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default TestingPage;
