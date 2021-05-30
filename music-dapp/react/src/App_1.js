import './App.css';
import { Input } from 'antd';
import React, { useState, useEffect } from 'react';
import { uploadAudioIPFS } from './ipfs/upload';
import { downloadAudioIPFS } from './ipfs/download';

function App() {
  const [songname, setSongName] = useState('');
  const [songartist, setSongArtist] = useState('');
  const [songdata, setSongData] = useState({ selectedFile: null });
  const [uploads, setUploads] = useState([]);
  const [songHash, setSongHash] = useState('');
  const [fingerprstatus, setFingerprstatus] = useState('no file yet');
  const [matchresult,setMatchresult] = useState('no file yet');

  console.log(uploads);


  

  const handleUploads = async () => {
    let obj = {
      name: songname,
      artist: songartist,
      data: songdata.selectedFile,
    };

    setUploads([...uploads, obj]);

    uploadAudioIPFS(songdata.selectedFile, songname ,(retHash) =>{
      setSongHash(retHash)
      const source = new EventSource(`http://localhost:3001/processupload?h=${retHash}`,{withCredentials:true});
      source.addEventListener('message', message => {
        console.log('Got', message.data);
        let msg_obj = JSON.parse(message.data)
        if (msg_obj.status === "done"){
          source.close()
        }else if(msg_obj.status === 'matching_results'){
          setMatchresult(message.data)
        }else{
          setFingerprstatus(message.data);
        }
      });
    });
    
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
                <span>Music File</span>
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
                      setSongName('');
                      setSongArtist('');
                      setSongData({ selectedFile: null });
                    }}
                  >
                    Upload
                  </button>
                </form>
                
              </div>
              <div className='info-box'><span>FingerPrint processing status :</span>{fingerprstatus}<br/>{matchresult}</div>
              <div className='info-box'>
                <span>Music Download</span>
                <form>
                  <Input
                    placeholder="type song's name..."
                    value={songname}
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
