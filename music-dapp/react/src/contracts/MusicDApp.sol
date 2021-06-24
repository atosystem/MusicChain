pragma solidity >=0.4.0 <0.9.0;
// support return struct in functions
pragma experimental ABIEncoderV2;

// import "../../node_modules/@openzeppelin/contracts/token/ERC20/ERC20.sol";
// import "./MusicCoin.sol";
import "./MusicToken.sol";

contract MusicDApp is DEX {
    // Music metadata
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

    struct User {
        string[] upload_music_list;
        string[] bought_music_list;
        bool isValid;
    }

    // State variables
    Music[] internal musics;

    mapping(address => User) internal users;

    // ipfs hash as index
    mapping(string => Music) internal music_hash;

    // (name, artist) as primary key
    mapping(string => mapping(string => Music)) internal music;

    // name as primary key
    mapping(string => Music[]) internal music_artist_list;

    // artist as primary key
    mapping(string => Music[]) internal artist_music_list;

    // Modifiers

    // Public methods

    // Retrieve basic user information
    function userExists() public view returns (bool) {
        return users[msg.sender].isValid;
    }

    function getUserInfo() public view returns (User memory) {
        return users[msg.sender];
    }

    function getUserBalance() public view returns (uint256) {
        return token.balanceOf(msg.sender);
    }

    function registerUser() public returns (User memory) {
        if (!userExists()) {
            // Give 10000 token for new user
            uint256 dexBalance = token.balanceOf(address(this));
            require(10000 <= dexBalance, "Not enough tokens in the reserve");
            bool success = register();
            require(success, "Register Process failed.");
            // token.transfer(msg.sender, 10000);
            users[msg.sender].isValid = true;
            User memory user = users[msg.sender];
            return user;
        } else {
            return users[msg.sender];
        }
    }

    function getUploadMusicList() public view returns (string[] memory) {
        return users[msg.sender].upload_music_list;
    }

    function getBoughtMusicList() public view returns (string[] memory) {
        return users[msg.sender].bought_music_list;
    }

    // check if the user had upload this music
    function findUploadMusic(string memory _ipfsHash)
        public
        view
        returns (bool)
    {
        User memory user = users[msg.sender];
        string[] memory upload_list = user.upload_music_list;

        for (uint256 i = 0; i < upload_list.length; i++) {
            if (
                keccak256(abi.encodePacked(_ipfsHash)) ==
                keccak256(abi.encodePacked(upload_list[i]))
            ) {
                return true;
            }
        }

        return false;
    }

    // check if the user had bought this music
    function findBoughtMusic(string memory _ipfsHash)
        public
        view
        returns (bool)
    {
        User memory user = users[msg.sender];
        string[] memory bought_list = user.bought_music_list;

        for (uint256 i = 0; i < bought_list.length; i++) {
            if (
                keccak256(abi.encodePacked(_ipfsHash)) ==
                keccak256(abi.encodePacked(bought_list[i]))
            ) {
                return true;
            }
        }

        return false;
    }

    // upload music to the blockchain
    function uploadMusic(
        string memory _ipfsHash,
        string memory _name,
        string memory _artist,
        string memory _coverFrom
    ) public {
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

        // Global state update
        musics.push(_music);
        music[_name][_artist] = _music;
        music_hash[_ipfsHash] = _music;
        music_artist_list[_name].push(_music);
        artist_music_list[_artist].push(_music);

        // User state update
        users[msg.sender].upload_music_list.push(_ipfsHash);
    }

    function uploadMusic_batch(
        string memory _ipfsHash,
        string memory _name,
        string memory _artist,
        string memory _coverFrom,
        address uploader_addr
    ) public {
        Music memory _music =
            Music(
                uploader_addr,
                block.timestamp,
                0,
                _name,
                _artist,
                _ipfsHash,
                _coverFrom
            );

        // Global state update
        musics.push(_music);
        music[_name][_artist] = _music;
        music_hash[_ipfsHash] = _music;
        music_artist_list[_name].push(_music);
        artist_music_list[_artist].push(_music);

        // User state update
        users[uploader_addr].upload_music_list.push(_ipfsHash);
    }

    function getMusic(string memory _name, string memory _artist)
        public
        view
        returns (Music memory)
    {
        Music memory _music = music[_name][_artist];

        return _music;
    }

    function searchMusic(string memory _name, string memory _artist)
        public
        view
        returns (Music[] memory)
    {
        Music[] memory returnList = new Music[](musics.length);
        uint ind = 0;
        for (uint i=0; i<musics.length; i++) {
            if (str_contains(_name,musics[i].name) || str_contains(_artist,musics[i].artist))
            {
                returnList[ind] = musics[i];
                i = i + 1;
            }
        }
        return returnList;
    }

    function getMusicByHash(string memory _ipfsHash)
        public
        view
        returns (Music memory)
    {
        Music memory _music = music_hash[_ipfsHash];

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

    function buyMusicByHash(string memory _ipfsHash) public {
        address sender = msg.sender;
        Music memory _music = music_hash[_ipfsHash];
        string memory songHash = _ipfsHash;
        address uploader = _music.uploader;
        uint8[7] memory chain = [100, 50, 25, 12, 6, 3, 1];
        uint256 count = 0;

        // Uploader can listen to what he uploaded
        if (findUploadMusic(songHash)) return;

        // Buyer will not pay twice
        if (findBoughtMusic(songHash)) return;

        while (true) {
            // The depth excee the limit
            if (count >= 7) {
                break;
            }

            // Send token only if the 
            if (
                !(keccak256(abi.encodePacked(sender)) ==
                keccak256(abi.encodePacked(uploader)))
            ) {
                transferTokenFrom(sender, uploader, chain[count]);
            }
            // hit the end of the chain
            if (
                keccak256(abi.encodePacked((_music.coverFrom))) ==
                keccak256(abi.encodePacked(("None")))
            ) {
                break;
            }

            sender = uploader;
            _music = music_hash[_music.coverFrom];
            uploader = _music.uploader;

            count++;
        }

        // add music to listener list
        users[msg.sender].bought_music_list.push(songHash);
    }

    function getMusicChain(
        string memory _name,
        string memory _artist,
        uint8 depth
    ) public view returns (Music[] memory) {
        Music memory _music = music[_name][_artist];
        uint256 count = 0;
        Music[] memory music_chain = new Music[](depth);

        // transfer token to uploader at the beginning of the chain

        while (true) {
            // The depth excee the limit
            if (count >= depth) {
                break;
            }
            music_chain[count] = _music;
            // hit the end of the chain
            if (
                keccak256(abi.encodePacked((_music.coverFrom))) ==
                keccak256(abi.encodePacked(("None")))
            ) {
                break;
            }

            _music = music_hash[_music.coverFrom];

            count++;
        }

        return music_chain;
    }

    function getMusicChainByHash(string memory _ipfsHash, uint8 depth)
        public
        view
        returns (Music[] memory)
    {
        Music memory _music = music_hash[_ipfsHash];
        uint256 count = 0;
        Music[] memory music_chain = new Music[](depth);

        while (true) {
            // The depth excee the limit
            if (count >= depth) {
                break;
            }
            music_chain[count] = _music;
            // hit the end of the chain
            if (
                keccak256(abi.encodePacked((_music.coverFrom))) ==
                keccak256(abi.encodePacked(("None")))
            ) {
                break;
            }

            _music = music_hash[_music.coverFrom];

            count++;
        }

        return music_chain;
    }

    function getRelevantMusicNameList(string memory _name, uint _index) 
        public 
        view 
        returns (Music[10] memory, uint, bool) 
    {
        Music[10] memory returnList;
        uint returnIndex = 0;
        bool reachEnd = false;
        Music memory _music;
        
        for(uint i = _index; i < musics.length; i++) {
            if(returnIndex >= 10) break;
            _music = musics[i];

            // if a music name contains input name, put it into return list 
            if(str_contains(_name, _music.name)) {
                returnList[returnIndex] = _music;
                returnIndex++;
            }
        }

        // tell frontend we had reach the end of the list
        if (returnIndex == musics.length) {
            reachEnd = true;
        }

        return (returnList, returnIndex, reachEnd);
    }

    

    // Private methods
    // check if string contains in other string
    function str_contains (string memory what, string memory where) private pure returns (bool){
        bytes memory whatBytes = bytes (what);
        bytes memory whereBytes = bytes (where);
        if (keccak256(abi.encodePacked((what))) == keccak256(abi.encodePacked((where))))
        {
            return true;
        }
        bool found = false;
        for (uint i = 0; i < whereBytes.length - whatBytes.length; i++) {
            bool flag = true;
            for (uint j = 0; j < whatBytes.length; j++)
                if (whereBytes [i + j] != whatBytes [j]) {
                    flag = false;
                    break;
                }
            if (flag) {
                found = true;
                break;
            }
        }
        return (found);
    }
}
