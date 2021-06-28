pragma solidity >=0.4.0 <0.9.0;

// Support return struct in functions
pragma experimental ABIEncoderV2;

// Import DEX
import "./MusicToken.sol";

/*
 * The Music DApp contract.
 */
contract MusicDApp is DEX {
    // Music metadata
    struct Music {
        address uploader;
        uint256 uploadTime;
        uint256 count;
        string name;
        string artist;
        string ipfsHash;
        string coverFrom;
    }

    struct User {
        string[] upload_music_list;
        string[] bought_music_list;
        bool isValid;
    }

    // All musics
    Music[] internal musics;

    // All users
    mapping(address => User) internal users;

    // IPFS hash as key
    mapping(string => Music) internal music_hash;

    // (name, artist) as primary key
    mapping(string => mapping(string => Music)) internal music;

    // Name as primary key
    mapping(string => Music[]) internal music_artist_list;

    // Artist as primary key
    mapping(string => Music[]) internal artist_music_list;


    /* Public methods */

    /*
     * Check if user Exists. (Deprecated)
     */
    function userExists() public view returns (bool) {
        return users[msg.sender].isValid;
    }

    /*
     * Get user's balance.
     * 
     * @param[out] amount: The number of tokens the user has.
     */
    function getUserBalance() public view returns (uint256) {
        return token.balanceOf(msg.sender);
    }

    /*
     * Get user information.
     * 
     * @param[out] user: An user information including upload list and bought list.
     */
    function getUserInfo() public view returns (User memory) {
        return users[msg.sender];
    }

    /*
     * Get user's uploaded list. The user can listen to these musics without paying.
     * 
     * @param[out] uploaded list: The user's uploaded list.
     */
    function getUploadMusicList() public view returns (string[] memory) {
        return users[msg.sender].upload_music_list;
    }

    /*
     * Get user's bought list. The can listen to these musics after he/she buy the music.
     * 
     * @param[out] bought list: The user's bought list.
     */
    function getBoughtMusicList() public view returns (string[] memory) {
        return users[msg.sender].bought_music_list;
    }

    /*
     * Check if the user had upload this music before.
     * 
     * @param[in] _ipfsHash: The music IPFS hash.
     * @param[out] found: Find this music in the user's uploaded list or not.
     */
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

    /*
     * Check if the user had bought this music before.
     * 
     * @param[in] _ipfsHash: The music IPFS hash.
     * @param[out] found: Find this music in the user's bought list or not.
     */
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

    /*
     * Upload music on the blockchain
     * 
     * @param[in] _ipfsHash: The IPFS hash of the music.
     * @param[in] _name: The name of the music.
     * @param[in] _artist: The artist of the music.
     * @param[in] _coverFrom: The cover from music's IPFS hash of the uploaded music.
     */
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
                1,
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

    /*
     * Upload music in a batch on the blockchain
     * 
     * @param[in] _ipfsHash: The IPFS hash of the music.
     * @param[in] _name: The name of the music.
     * @param[in] _artist: The artist of the music.
     * @param[in] _coverFrom: The cover from music's IPFS hash of the uploaded music.
     * @param[in] uploader_addr: The uploader address.
     */
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

    /*
     * Check if the musics had already been uploaded on the blockchain.
     * 
     * @param[in] _name: The name of the music.
     * @param[in] _artist: The artist of the music.
     * @param[out] found: Find this music in the user's on the blockchain or not.
     */
    function musicExists(string memory _name, string memory _artist) 
        public 
        view
        returns (bool)
    {
        Music memory _music = music[_name][_artist];
        address _uploader = _music.uploader;
        bool exists = _uploader != address(0);
        return exists;
    }

    /*
     * Get music metadata from the blockchain using name and artist.
     * 
     * @param[in] _name: The name of the music.
     * @param[in] _artist: The artist of the music.
     * @param[out] _music: The searched result of given name and artist.
     */
    function getMusic(string memory _name, string memory _artist)
        public
        view
        returns (Music memory)
    {
        Music memory _music = music[_name][_artist];

        return _music;
    }

    /*
     * Get music metadata from the blockchain using IPFS hash.
     * 
     * @param[in] _ipfsHash: The IPFS hash of the music.
     * @param[out] _music: The searched result of given IPFS hash.
     */
    function getMusicByHash(string memory _ipfsHash)
        public
        view
        returns (Music memory)
    {
        Music memory _music = music_hash[_ipfsHash];

        return _music;
    }

    /*
     * Get all musics on the blockchain.
     * 
     * @param[out] musics: The musics array on the blockchain.
     */
    function getMusicList()
        public 
        view 
        returns (Music[] memory) 
    {
        return musics;
    }

    /*
     * Get all musics on the blockchain given the music name.
     * 
     * @param[in] _name: The music name.
     * @param[out] _music_artist_list: The music list array of the given music name.
     */
    function getMusicArtistList(string memory _name)
        public
        view
        returns (Music[] memory)
    {
        Music[] memory _music_artist_list = music_artist_list[_name];

        return _music_artist_list;
    }

    /*
     * Get all musics on the blockchain given the artist name.
     * 
     * @param[in] _artist: The artist name.
     * @param[out] _artist_music_list: The music list array of the given artist name.
     */
    function getArtistMusicList(string memory _artist)
        public
        view
        returns (Music[] memory)
    {
        Music[] memory _artist_music_list = artist_music_list[_artist];

        return _artist_music_list;
    }       

    /*
     * Buy music by given IPFS hash
     * 
     * @param[in] _ipfsHash: The music IPFS hash.
     */
    function buyMusicByHash(string memory _ipfsHash) public {
        address sender = msg.sender;
        Music memory _music = music_hash[_ipfsHash];
        string memory songHash = _ipfsHash;
        address uploader = _music.uploader;
        uint8[7] memory chain = [100, 50, 25, 12, 6, 3, 1];
        uint256 count = 0;

        // Uploader can listen to what he had uploaded
        if (findUploadMusic(songHash)) return;

        // Buyer will not pay twice
        if (findBoughtMusic(songHash)) return;

        while (true) {
            // The depth exceed the limit
            if (count >= 7) {
                break;
            }

            // Send token if the sender does not equals the receiver
            if (
                !(keccak256(abi.encodePacked(sender)) ==
                keccak256(abi.encodePacked(uploader)))
            ) {
                transferTokenFrom(sender, uploader, chain[count]);
            }

            // Hit the end of the chain
            if (
                keccak256(abi.encodePacked((_music.coverFrom))) ==
                keccak256(abi.encodePacked(("None")))
            ) {
                break;
            }

            // Go deeper for 1 level
            sender = uploader;
            _music = music_hash[_music.coverFrom];
            uploader = _music.uploader;

            count++;
        }

        // Add music to buyer's bought list
        users[msg.sender].bought_music_list.push(songHash);
    }

    /*
     * Get music cover from chain given IPFS hash.
     * 
     * @param[in] _ipfsHash: The music IPFS hash.
     * @param[in] depth: The depth of the searched chain.
     * @param[out] music_chain: The found music chain.
     */
    function getMusicChainByHash(string memory _ipfsHash, uint8 depth)
        public
        view
        returns (Music[] memory)
    {
        Music memory _music = music_hash[_ipfsHash];
        uint256 count = 0;
        Music[] memory music_chain = new Music[](depth);

        while (true) {
            // The depth exceed the limit
            if (count >= depth) {
                break;
            }

            music_chain[count] = _music;

            // Hit the end of the chain
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

    /*
     * Get relevant music list given name and artist.
     * 
     * @param[in] _name: The music name keyword.
     * @param[in] _artist: The artist name keyword.
     * @param[in] _index: The starting point.
     * @param[in] depth: The maximal length of returned list.
     * @param[out] returnList: The found music list.
     * @param[out] returnIndex: The stopping point of the search function, serving as the next search starting point.
     * @param[out] reachEnd: Whether the search function hit the end of the musics array.
     */
    function getRelevantMusicArtistList(string memory _name, string memory _artist, uint _index, uint depth) 
        public 
        view 
        returns (Music[10] memory, uint, bool) 
    {
        Music[10] memory returnList;
        uint returnIndex = 0;
        bool reachEnd = false;
        Music memory _music;
        uint index = _index;
        
        for(uint i = _index; i < musics.length; i++) {
            if(returnIndex >= depth) break;
            _music = musics[i];

            // If a music name contains input name or artist, put it into return list 
            if(str_contains(_name, _music.name) || str_contains(_artist, _music.artist)) {
                returnList[returnIndex] = _music;
                returnIndex++;
            }

            index++;
        }

        // Tell frontend we had reach the end of the list
        if (index == musics.length) {
            reachEnd = true;
        }

        return (returnList, returnIndex, reachEnd);
    }

    

    /* Private methods */ 

    /*
     * Check if string is contained in other string.
     * 
     * @param[in] what: The search keyword.
     * @param[in] where: The to be checked string.
     * @param[out] found: Whether containing the string or not.
     */
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
