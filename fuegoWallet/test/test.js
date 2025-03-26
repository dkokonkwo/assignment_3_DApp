let Fuego = artifacts.require("./Fuego.sol");

let fuegoInstance;

console.log("Running test file");

contract("FuegoContract", function (accounts) {
  //accounts[0] is the default account
  //Test case 1
  it("Contract deployment", function () {
    //Fetching the contract instance of our smart contract
    return Fuego.deployed().then(function (instance) {
      //We save the instance in a gDlobal variable and all smart contract functions are called using this
      fuegoInstance = instance;
      assert(fuegoInstance !== undefined, "Fuego contract should be defined");
    });
  });

  //Test Case for checking if mintOnce function worked
  it("Should mint token for account", function () {
    return fuegoInstance
      .mintOnce({ from: accounts[1] })
      .then(function (result) {
        return fuegoInstance.balanceOf(accounts[1]).then(function (result) {
          const expectedAmount = web3.utils.toBN(2000);
          assert.equal(
            result,
            expectedAmount,
            `Token balance should be ${expectedAmount.toString()}, but got ${
              result.toString
            }`
          );
        });
      });
  });
});
