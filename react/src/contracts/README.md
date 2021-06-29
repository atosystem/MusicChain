# Smart Contract

In our project, we use Ethereum as our blockchain platform, the code is written in solidity.

## Setup
1. Make sure you first install [truffle](https://github.com/trufflesuite/truffle) and [ganache](https://github.com/trufflesuite/ganache) on your own computer.
2. Change to the source directory (from project root directory).
```
cd react/src/
```
3. Run truffle to compile the contract.
```
truffle compile
```
4. Deploy to ganache.
```
truffle migrate
```

If you want to reset the deployed contract, run the following command:
```
truffle migrate --reset
```

## Music Token

To simulate the transaction in the real life, we implement a `MusicToken` in our smart contract. 

The contract provides two main features:
- Allow internal tokens transaction.
- Allow transfer between ETH and our MusicToken.

### Token Pool
The token pool is the basic contract of our music token, which provides simple functionalities like `balanceOf` and `transferFrom`.

Features:
- **balanceOf**: Get the balance of the user (`msg.sender`).
- **transferFrom**: Transfer token from `sender` to `receiver`. You can also specify some `amount` to transfer to.

### DEX
The DEX (Decentralized Exchange) is the main contract of our music token, inherited from the token pool contract. The exchange ratio is Ether:Token = 1:10000.

Features:
- **buy**: But tokens from the contract.
- **sell**: Sell tokens to the contract.
- **transferToken**: A wrapper function that add check condition before actually transfering token.


## Music DApp
This is our main contract of the Music DApp. It inherits from the DEX contract, and add some data structures and helper functions for the sake of the need of our application.

### User Info
Each user has its own `upload_music_list` and `bought_music_list`. These two field is to record the music that the user own. If the music is found in one of the list, the user will not pay twice. We also have some helper functions to get user's balance or another detailed information.

### Upload Music
We have 2 upload function, one is `uploadMusic`, the other `uploadMusic_batch`. Each will insert the a `Music` onto the blockchain. 

The uploader is required to give 4 fields of information:
- name
- artist
- ipfsHash
- coverFrom

The only difference is `uploadMusic` use `msg.sender` as the uploader, while `uploadMusic_batch` has to explicitly put the uploader in the paramter list.

### Search Music
To simplify the search on the frontend, we implement several functions directly on the smart contract. Given name, artist, or even IPFS hash, there are different functions to get the wanted music. Actually, to fulfill this need, we have to insert a music into several different data structures when uploaded. Fortunately, we don't have to modify the music metadata. Therefore, it is safe from consisency problem.

A advanced **relevant** search is also implemented. In this function, given a `name` or `artist`, we will return those musics that contains these keyword. We also keep a `index` and `depth`. These are control flags to scan for interval searching. User have to be awared before using this function because it had not beed tested formally.


### Buy Music
User can buy a music through IPFS hash. Each music is set to 100 tokens. We design a simle algorithm for sharing profit.

The uploader and the covered uploader share profit with ratio 1:1.

To make matters concrete, consider 3 musics A, B, and C. The cover from relationship is C covers from B (denote C -> B), and B covers from A (B -> A). The whole chain is C -> B -> A. If a user spend 100 tokens for buying music C, then C and B each will get 50 tokens. However, B also covers from A, so the we have to do it again. This time, B and A each get 25 tokens. To sum up, C get 50 tokens, B get 25 tokens, and A get 25 tokens.

To prevent endless looping, we set the maximal depth as 7. In other words, the uploader at the end of the chain get 1 token. If the chain is longer, we just break the loop.