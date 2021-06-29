pragma solidity >=0.4.0 <0.9.0;

/*
 * A simple token pool implement token exchange functionlity. 
 */
interface TokenPool {
    function totalSupply() external view returns (uint256);

    function balanceOf(address account) external view returns (uint256);

    function transferFrom(
        address sender,
        address recipient,
        uint256 amount
    ) external returns (bool);

    event Transfer(address indexed from, address indexed to, uint256 value);
    
}


contract MusicCoin is TokenPool {
    string public constant name = "MusicCoin";
    string public constant symbol = "MUC";
    uint8 public constant decimals = 2;

    // Map user address to the amount of balance
    mapping(address => uint256) balances;

    uint256 _totalSupply = 100 ether;

    using SafeMath for uint256;

    // Create token when the contract is created
    constructor() {
        balances[msg.sender] = _totalSupply;
    }

    /*
     * The total amount of tokens in the pool.
     */
    function totalSupply() public view override returns (uint256) {
        return _totalSupply;
    }

    /*
     * The balance of the user.
     * 
     * @param[in] tokenOwner: The user address.
     * @param[out] balance: The user balance.
     */
    function balanceOf(address tokenOwner)
        public
        view
        override
        returns (uint256)
    {
        return balances[tokenOwner];
    }

    /*
     * Transfer tokens from one account to another.
     * 
     * @param[in] owner: The sender address.
     * @param[in] buyer: The receiver address.
     * @param[in]: numTokens: The number of tokens to transfer.
     */
    function transferFrom(
        address owner,
        address buyer,
        uint256 numTokens
    ) public override returns (bool) {
        require(numTokens <= balances[owner], "The owner has no enough balance!");
        balances[owner] = balances[owner].sub(numTokens);
        balances[buyer] = balances[buyer].add(numTokens);
        emit Transfer(owner, buyer, numTokens);
        return true;
    }
}

library SafeMath {
    function sub(uint256 a, uint256 b) internal pure returns (uint256) {
        assert(b <= a);
        return a - b;
    }

    function add(uint256 a, uint256 b) internal pure returns (uint256) {
        uint256 c = a + b;
        assert(c >= a);
        return c;
    }
}

/*
 * A simple decentralized exchange system.
 * 
 */
contract DEX {
    event Bought(uint256 amount);
    event Sold(uint256 amount);

    TokenPool public token;
    uint256 public exchange_rate = 10**14;

    constructor() {
        token = new MusicCoin();
    }

    /*
     * Get the total supply of the token pool.
     */
    function getTokenSupply() public view returns (uint256) {
        return token.totalSupply();
    }

    /*
     * Get the contract address.
     */
    function getContractAddress() public view returns (address) {
        return address(this);
    }

    /*
     * Get the token balance of the DEX.
     */
    function getPoolTokenBalance() public view returns (uint256) {
        return token.balanceOf(address(this));
    }

    /*
     * Get the ETH balance of the DEX.
     */
    function getPoolEtherBalance() public view returns (uint256) {
        return address(this).balance;
    }

    /*
     * Buy tokens from the contract using ETH. 
     * The ratio is Ether:Token = 1:10000.
     */
    function buy() public payable {
        uint256 amountTobuy = msg.value;
        uint256 dexBalance = token.balanceOf(address(this));
        require(amountTobuy > 0, "You need to send some Ether");
        require(amountTobuy <= dexBalance, "Not enough tokens in the reserve");
        token.transferFrom(address(this), msg.sender, amountTobuy / exchange_rate);
        emit Bought(amountTobuy);
    }

    /*
     * Sell contract the user owns then convert to ETH.
     * The ratio is Ether:Token = 1:10000.
     * 
     * @param[in] amount: The number of tokens to be sold.
     */
    function sell(uint256 amount) public {
        require(amount > 0, "You need to sell at least some tokens");
        token.transferFrom(msg.sender, address(this), amount);

        uint256 weiAmount = amount * exchange_rate;

        (bool success, ) = msg.sender.call{value: weiAmount}("");

        require(success, "Transfer Ether failed.");
        emit Sold(amount);
    }

    /*
     * Transfer tokens from msg.sender to receiver.
     * 
     * @param[in] receiver: The receiver address.
     * @param[in] amount: The number of tokens to be transfered.
     */
    function transferToken(
        address receiver,
        uint256 amount
    ) public {
        require(amount > 0, "You need to enter at least some tokens");
        token.transferFrom(msg.sender, receiver, amount);
    }

    /*
     * Transfer token from sender to receiver.
     * 
     * @param[in] sender: The sender address.
     * @param[in] receiver: The receiver address.
     * @param[in] amount: The number of tokens to be transfered.
     */
    function transferTokenFrom(
        address sender,
        address receiver,
        uint256 amount
    ) internal {
        require(amount > 0, "You need to enter at least some tokens");
        token.transferFrom(sender, receiver, amount);
    }
}
