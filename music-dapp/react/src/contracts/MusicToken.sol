pragma solidity >=0.4.0 <0.9.0;

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

    mapping(address => uint256) balances;

    uint256 _totalSupply = 100 ether;

    using SafeMath for uint256;

    constructor() {
        balances[msg.sender] = _totalSupply;
    }

    function totalSupply() public view override returns (uint256) {
        return _totalSupply;
    }

    function balanceOf(address tokenOwner)
        public
        view
        override
        returns (uint256)
    {
        return balances[tokenOwner];
    }

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

contract DEX {
    event Bought(uint256 amount);
    event Sold(uint256 amount);

    TokenPool public token;
    uint256 public exchange_rate = 10**14;

    constructor() {
        token = new MusicCoin();
    }

    function getTokenSupply() public view returns (uint256) {
        return token.totalSupply();
    }

    function getContractAddress() public view returns (address) {
        return address(this);
    }

    function getPoolTokenBalance() public view returns (uint256) {
        return token.balanceOf(address(this));
    }

    function getPoolEtherBalance() public view returns (uint256) {
        return address(this).balance;
    }

    function register() public returns (bool) {
        uint amount = 10000;
        uint256 dexBalance = token.balanceOf(address(this));
        require(amount <= dexBalance, "Not enough tokens in the reserve");
        token.transferFrom(address(this), msg.sender, amount);
        return true;
    }

    function buy() public payable {
        uint256 amountTobuy = msg.value;
        uint256 dexBalance = token.balanceOf(address(this));
        require(amountTobuy > 0, "You need to send some Ether");
        require(amountTobuy <= dexBalance, "Not enough tokens in the reserve");
        token.transferFrom(address(this), msg.sender, amountTobuy / exchange_rate);
        emit Bought(amountTobuy);
    }

    function sell(uint256 amount) public {
        require(amount > 0, "You need to sell at least some tokens");
        token.transferFrom(msg.sender, address(this), amount);

        // Send seller the sell price
        uint256 weiAmount = amount * exchange_rate;

        (bool success, ) = msg.sender.call{value: weiAmount}("");
        // payable(msg.sender).transfer(weiAmount);
        require(success, "Transfer Ether failed.");
        emit Sold(amount);
    }

    function transferToken(
        address receiver,
        uint256 amount
    ) public {
        require(amount > 0, "You need to enter at least some tokens");
        token.transferFrom(msg.sender, receiver, amount);
    }
}
