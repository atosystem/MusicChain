pragma solidity >=0.4.0 <0.9.0;
// support return struct in functions
pragma experimental ABIEncoderV2;

// import "../node_modules/@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract MusicDApp {
    // Basic storage unit
    struct Music {
        // Music information
        address uploader;
        uint256 uploadTime;
        uint256 count;
        string name;
        string artist;
        // Music content
        string ipfsHash;
        string coverFrom;
    }

    // State variables
    address[] uploaderIndexes;
    Music[] musics;

    // (name, artist) as primary key
    mapping(string => mapping(string => Music)) internal music;

    // name as primary key
    mapping(string => Music[]) internal music_artist_list;

    // artist as primary key
    mapping(string => Music[]) internal artist_music_list;

    // events firing
    // event OnMusicUpload(string ipfsHash);
    // event OnMusicDownload(...)

    // Modifiers

    // Public methods
    function uploadMusic(
        string memory _ipfsHash,
        string memory _name,
        string memory _artist,
        string memory _coverFrom
    ) public {
        uploaderIndexes.push(msg.sender);
        Music memory _music =
            Music(
                msg.sender,
                block.timestamp,
                0,
                _name,
                _artist,
                _ipfsHash,
                _coverFrom
            );

        musics.push(_music);
        music[_name][_artist] = _music;
        music_artist_list[_name].push(_music);
        artist_music_list[_artist].push(_music);
    }

    function getMusic(string memory _name, string memory _artist)
        public
        view
        returns (Music memory)
    {
        Music memory _music = music[_name][_artist];

        return _music;
    }

    function getMusicWithCountIncrement(
        string memory _name,
        string memory _artist
    ) public returns (Music memory) {
        music[_name][_artist].count += 1;
        Music memory _music = music[_name][_artist];

        return _music;
    }

    function getMusicArtistList(string memory _name)
        public
        view
        returns (Music[] memory)
    {
        Music[] memory _music_list = music_artist_list[_name];

        return _music_list;
    }

    function getArtistMusicList(string memory _artist)
        public
        view
        returns (Music[] memory)
    {
        Music[] memory _artist_music_list = artist_music_list[_artist];

        return _artist_music_list;
    }

    // Private methods
}
