const socialNetwork = artifacts.require("socialNetwork");

module.exports = function(deployer) {
  deployer.deploy(socialNetwork);
};
