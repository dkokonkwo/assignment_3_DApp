var Fuego = artifacts.require("Fuego");

module.exports = function (deployer, network, accounts) {
  const initialOwner = accounts[0];
  deployer.deploy(Fuego, initialOwner);
};
