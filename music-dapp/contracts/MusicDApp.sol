pragma solidity ^0.5.0;
pragma experimental ABIEncoderV2; // support return struct in functions

contract MusicDApp {

  // state variables 
  address[] uploaderIndexes;
  mapping(string => mapping(string => Music)) internal music; // (name, artist) as primary key
  mapping(string => Music[]) internal music_list; // name as primary key

  // events firing
    // event OnMusicUpload(...)
    // event OnMusicDownload(...)

  // data structures
  struct Music {
    address   uploader;
    bytes     ipfsHash;
    string    name;
    string    artist;
    string    coverFrom;
    uint      uploadTime;
    // uint      count;
  }

  // Modifiers

  // Public methods
  function uploadMusic(bytes memory _ipfsHash, string memory _name, string memory _artist, string memory _coverFrom) public {
    uploaderIndexes.push(msg.sender);
    Music memory _music = Music(msg.sender, _ipfsHash, _name, _artist, _coverFrom, now);

    music[_name][_artist] = _music;
    music_list[_name].push(_music);
  }

  function getMusic(string memory _name, string memory _artist) public view returns(Music memory) {
    Music memory _music = music[_name][_artist];

    return _music;
  }

  function getMusicList(string memory _name) public view returns(Music[] memory) {
    Music[] memory _music_list = music_list[_name];

    return _music_list;
  }

  // Private methods

}