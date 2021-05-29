const TodoApp = artifacts.require("TodoApp");

module.exports = function(deployer) {
  deployer.deploy(TodoApp);
};
