import './App.css';
import { Input } from 'antd';
import getWeb3 from './utils/getWeb3';
import React, { useState, useEffect } from 'react';
import { uploadAudioIPFS } from './ipfs/upload';
import { downloadAudioIPFS } from './ipfs/download';
import MusicDAppContract from './build/contracts/MusicDApp.json';

function App() {
  const [songname, setSongName] = useState('');
  const [songartist, setSongArtist] = useState('');
  const [songdata, setSongData] = useState({ selectedFile: null });
  const [uploads, setUploads] = useState({});
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

  const testGetMusic = async () => {
    const result = await contract.methods
      .getMusic(searchMusic, searchArtist)
      .call();
    console.log(result);
    console.log(result.ipfsHash);
    setSongHash(result.ipfsHash);
  };

  const testGetMusicArtistList = async () => {
    const result = await contract.methods
      .getMusicArtistList(searchMusic)
      .call();
    console.log(result);
  };

  const testGetArtistMusicList = async () => {
    const result = await contract.methods
      .getArtistMusicList(searchArtist)
      .call();
    console.log(result);
  };

  const testGetUserInfo = async () => {
    const result = await contract.methods.getUserInfo().call();
    console.log(result);
  };

  const testUserLogin = async () => {
    const result = await contract.methods.login().send({ from: accounts[0] });
    console.log(result);
  };

  // console.log(uploads);

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

    let obj = {
      name: songname,
      artist: songartist,
      data: songdata.selectedFile,
    };

    setUploads(obj);

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
    // setUploads([]);
    // setSongData({ selectedFile: null });
  };

  return (
    <div className='App'>
      <div className='App-header'></div>

      <div className='App-main'>
        <div className='App-sidebar'></div>

        <div className='App-interface'>
          <div className='upload-box'>
            <div className='title'>
              <span>Upload Music</span>
            </div>

            <div className='content'>
              <div className='info-box'>
                <span>Test Blockchain</span>
                <Input
                  placeholder='music name'
                  value={searchMusic}
                  onChange={(event) => {
                    setSearchMusic(event.target.value);
                  }}
                ></Input>
                <Input
                  placeholder='artist name'
                  value={searchArtist}
                  onChange={(event) => {
                    setSearchArtist(event.target.value);
                  }}
                ></Input>
                <button
                  type='button'
                  onClick={() => {
                    testGetMusic();
                  }}
                >
                  Test Get Music
                </button>
                <button
                  type='button'
                  onClick={() => {
                    testGetMusicArtistList();
                  }}
                >
                  Test Get Music List
                </button>
                <button
                  type='button'
                  onClick={() => {
                    testGetArtistMusicList();
                  }}
                >
                  Test Get Artist List
                </button>
                <button
                  type='button'
                  onClick={() => {
                    testGetUserInfo();
                  }}
                >
                  Test Get User Info
                </button>
                <button
                  type='button'
                  onClick={() => {
                    testUserLogin();
                  }}
                >
                  Test User Login
                </button>
              </div>

              <div className='info-box'>
                <span>Name</span>
                <Input
                  placeholder="type song's name..."
                  value={songname}
                  onChange={(event) => {
                    setSongName(event.target.value);
                  }}
                ></Input>
                <span>Artist</span>
                <Input
                  placeholder="type song's artist..."
                  value={songartist}
                  onChange={(event) => {
                    setSongArtist(event.target.value);
                  }}
                ></Input>
              </div>

              <div className='info-box'>
                <span>Music Upload</span>
                <form>
                  <input
                    type='file'
                    id='audio'
                    name='audio'
                    accept='audio/*'
                    onChange={(event) => {
                      setSongData({ selectedFile: event.target.files[0] });
                    }}
                  />
                  <button
                    type='button'
                    onClick={() => {
                      handleUploads();
                    }}
                  >
                    Upload
                  </button>
                </form>
              </div>

              <div className='info-box'>
                <span>FingerPrint processing status :</span>
                {fingerprstatus}
                <br />
                {matchresult}
              </div>

              <div className='info-box'>
                <span>Music Download</span>
                <form>
                  <Input
                    placeholder="type song's hash..."
                    value={songHash}
                    onChange={(event) => {
                      setSongHash(event.target.value);
                    }}
                  ></Input>
                  <button
                    type='button'
                    onClick={() => {
                      console.log(songHash);
                      downloadAudioIPFS(songHash);
                    }}
                  >
                    Download
                  </button>
                </form>
              </div>

              <div className='info-box'>
                <span>Music Play</span>
                <audio
                  controls
                  src='/media/cc0-audio/t-rex-roar.mp3'
                  id='music-play'
                >
                  Your browser does not support the
                  <code>audio</code> element.
                </audio>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
