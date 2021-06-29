const MusicDApp = artifacts.require("MusicDApp");

module.exports = function (deployer) {
  deployer.deploy(MusicDApp);
};
