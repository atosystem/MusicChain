import './App.css';
import { Input } from 'antd';
import React, {useState, useEffect } from 'react';


function App() {
  const [songname, setSongName] = useState("")
  const [songartist, setSongArtist] = useState("")
  const [songdata, setSongData] = useState({selectedFile: null})
  const [uploads, setUploads] = useState([])

  console.log(uploads)

  const handleUploads = () => {
    const obj = {
      name: songname,
      artist: songartist,
      data: songdata.selectedFile
    }
    console.log(obj)
    setUploads([...obj])
  }

  return (
    <div className="App">
      <div className="App-header">
        
      </div>

      <div className="App-main">
        <div className="App-sidebar">
          
        </div>

        <div className="App-interface">
          <div className="upload-box">
            <div className="title">
              <span>Upload Music</span>
            </div>

            <div className="content">
              <div className="info-box">
                <span>Name</span>
                <Input 
                  placeholder="type song's name..."
                  value={songname}
                  onChange={(event) => {setSongName(event.target.value)}}
                ></Input>
                <span>Artist</span>
                <Input
                  placeholder="type song's artist..."
                  value={songartist}
                  onChange={(event) => {setSongArtist(event.target.value)}}
                ></Input>
              </div>

              <div className="info-box">
                <span>Music File</span>
                <form>
                  <input type="file" id="audio" name="audio" accept="audio/*"
                    onChange={(event) => {setSongData({selectedFile: event.target.value})}}/>
                  <button onClick={() => {
                    handleUploads()
                    setSongName("")
                    setSongArtist("")
                    setSongData({selectedFile: null})
                  }}
                  >Upload</button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
