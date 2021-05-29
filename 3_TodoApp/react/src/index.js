/* Reference: https://codepen.io/marekdano/pen/bVNYpq
Todo app structure

TodoApp
	- TodoHeader
	- TodoList
    - TodoListItem #1
		- TodoListItem #2
		  ...
		- TodoListItem #N
	- TodoForm
*/

import React from 'react';
import ReactDOM from 'react-dom';
import getWeb3 from "./utils/getWeb3";

import TodoAppContract from "./build/contracts/TodoApp.json"

import TodoHeader from './pages/TodoHeader';
import TodoForm from './pages/TodoForm';
import TodoList from './pages/TodoList';
import './index.css';

var todoItems = [];
  
class TodoApp extends React.Component {
  constructor (props) {
    super(props);
    this.addItem = this.addItem.bind(this);
    this.removeItem = this.removeItem.bind(this);
    this.markTodoDone = this.markTodoDone.bind(this);
    this.state = {todoItems: todoItems, web3: null, accounts: null, contract: null };
  }

  componentDidMount = async () => {
    try {
      const web3 = await getWeb3();
      const accounts = await web3.eth.getAccounts();
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = TodoAppContract.networks[networkId];
      const instance = new web3.eth.Contract(
        TodoAppContract.abi,
        deployedNetwork && deployedNetwork.address,
      );
      // console.log(instance);
      // console.log(accounts);
      this.setState({ web3, accounts, contract: instance });
    } catch (error) {
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };

  /* YOUR CODE HERE */
  // Maybe you sould take a look at https://github.com/truffle-box/react-box
  addTodoAsync = async (todoItemValue) => {
    const { accounts, contract } = this.state;
    const gas = await contract.methods.addTodo(todoItemValue).estimateGas();
    console.log('AddTodo: Estimated gas ', gas);

    await contract.methods.addTodo(todoItemValue).send({
      from: accounts[0],
      gas: 200000
    }).then(res => {
      console.log(res.events);
    });
  }
  removeTodoAsync = async (itemIndex) => {
    const { accounts, contract, todoItems } = this.state;

    const value = todoItems[itemIndex].value;
    let index = todoItems[itemIndex].index - 1;
    let found = false;

    while (!found) {
      const gas_val = await contract.methods.isTodoValid(index).estimateGas();
      console.log("IsTodoValid: Estimated gas ", gas_val);
      const isValid = await contract.methods.isTodoValid(index).call({
        from: accounts[0],
        gas: 200000
      })
      if (isValid) {
        const gas_get = await contract.methods.getTodo(index).estimateGas();
        console.log("GetTodo: Estimated gas ", gas_get);
        const Todo = await contract.methods.getTodo(index).call({
          from: accounts[0],
          gas: 200000
        })
        if (Todo[0] === value) {
          found = true;
          console.log("Target Todo: "+Todo[0]);
        } else {
          index ++;
        }
      } else {
        index ++;
      }
    }
    const gas_del = await contract.methods.deleteTodo(index).estimateGas();
    console.log('DeleteTodo: Estimated gas ', gas_del);
    await contract.methods.deleteTodo(index).send({
      from: accounts[0],
      gas: 200000
    }).then(res => {
      console.log(res.events);
    });
  }
  completeTodoAsync = async (itemIndex) => {
    const { accounts, contract, todoItems } = this.state;

    const value = todoItems[itemIndex].value;
    let index = todoItems[itemIndex].index - 1;
    let found = false;

    while (!found) {
      const gas_val = await contract.methods.isTodoValid(index).estimateGas();
      console.log("IsTodoValid: Estimated gas ", gas_val);
      const isValid = await contract.methods.isTodoValid(index).call({
        from: accounts[0],
        gas: 200000
      })
      if (isValid) {
        const gas_get = await contract.methods.getTodo(index).estimateGas();
        console.log("GetTodo: Estimated gas ", gas_get);
        const Todo = await contract.methods.getTodo(index).call({
          from: accounts[0],
          gas: 200000
        })
        if (Todo[0] === value) {
          found = true;
          console.log("Target Todo: "+Todo[0]);
        } else {
          index ++;
        }
      } else {
        index ++;
      }
    }
    const gas = await contract.methods.completeTodo(index).estimateGas();
    console.log('CompleteTodo: Estimated gas ', gas);

    await contract.methods.completeTodo(itemIndex).send({
      from: accounts[0],
      gas: 200000
    }).then(res => {
      console.log(res.events);
    });
  }
  undoneTodoAsync = async (itemIndex) => {
    const { accounts, contract, todoItems } = this.state;

    const value = todoItems[itemIndex].value;
    let index = todoItems[itemIndex].index - 1;
    let found = false;

    while (!found) {
      const gas_val = await contract.methods.isTodoValid(index).estimateGas();
      console.log("IsTodoValid: Estimated gas ", gas_val);
      const isValid = await contract.methods.isTodoValid(index).call({
        from: accounts[0],
        gas: 200000
      })
      if (isValid) {
        const gas_get = await contract.methods.getTodo(index).estimateGas();
        console.log("GetTodo: Estimated gas ", gas_get);
        const Todo = await contract.methods.getTodo(index).call({
          from: accounts[0],
          gas: 200000
        })
        if (Todo[0] === value) {
          found = true;
          console.log("Target Todo: "+Todo[0]);
        } else {
          index ++;
        }
      } else {
        index ++;
      }
    }
    const gas = await contract.methods.undoneTodo(index).estimateGas();
    console.log('UndoneTodo: Estimated gas ', gas);

    await contract.methods.undoneTodo(itemIndex).send({
      from: accounts[0],
      gas: 200000
    }).then(res => {
      console.log(res.events);
    });
  }
  

  addItem (todoItem) {
    todoItems.unshift({
      index: todoItems.length+1, 
      value: todoItem.newItemValue, 
      done: false
    });
    this.setState({todoItems: todoItems});
    console.log(todoItems);
    this.addTodoAsync(todoItem.newItemValue);
  }
  removeItem (itemIndex) {
    this.removeTodoAsync(itemIndex);
    todoItems.splice(itemIndex, 1);
    this.setState({todoItems: todoItems});
  }
  markTodoDone(itemIndex) {
    var todo = todoItems[itemIndex];
    if (todo.done) {
      // dark -> green
      this.undoneTodoAsync(itemIndex);
    } else {
      // green -> dark
      this.completeTodoAsync(itemIndex);
    }
    todoItems.splice(itemIndex, 1);
    todo.done = !todo.done;
    todo.done ? todoItems.push(todo) : todoItems.unshift(todo);
    this.setState({todoItems: todoItems});  
  }

  /* END OF YOUR CODE */

  render() {
    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (
      <div id="main">
        <TodoHeader />
        <TodoList items={this.props.initItems} removeItem={this.removeItem} markTodoDone={this.markTodoDone}/>
        <TodoForm addItem={this.addItem} />
      </div>
    );
  }
}

ReactDOM.render(
  <TodoApp initItems={todoItems}/>,
  document.getElementById('root')
);