const Fuego = artifacts.require("Fuego");

contract("FuegoContract", (accounts) => {
  let fuegoInstance;
  const owner = accounts[0];
  const user1 = accounts[1];
  const user2 = accounts[2];

  before(async () => {
    fuegoInstance = await Fuego.deployed();
  });

  it("should deploy the contract successfully", async () => {
    assert(fuegoInstance !== undefined, "Fuego contract should be defined");
  });

  it("should allow a user to mint 2000 tokens using mintOnce()", async () => {
    await fuegoInstance.mintOnce({ from: user1 });

    const balance = await fuegoInstance.balanceOf(user1);
    const expectedAmount = web3.utils.toBN(2000);

    assert(
      balance.eq(expectedAmount),
      `Token balance should be ${expectedAmount.toString()}, but got ${balance.toString()}`
    );
  });

  it("should prevent a user from calling mintOnce() twice", async () => {
    try {
      await fuegoInstance.mintOnce({ from: user1 });
      assert.fail("mintOnce() should not allow multiple calls");
    } catch (error) {
      assert(
        error.message.includes("Token minted already."),
        `Expected "Token minted already.", but got: ${error.message}`
      );
    }
  });

  it("should allow the owner to mint tokens to any account", async () => {
    const mintAmount = web3.utils.toBN(5000);
    await fuegoInstance.mint(user2, mintAmount, { from: owner });

    const balance = await fuegoInstance.balanceOf(user2);
    assert(
      balance.eq(mintAmount),
      `User2 should have ${mintAmount.toString()} tokens, but got ${balance.toString()}`
    );
  });

  it("should prevent non-owners from calling mint()", async () => {
    try {
      await fuegoInstance.mint(user2, 1000, { from: user1 });
      assert.fail("mint() should only be callable by the owner");
    } catch (error) {
      assert(
        error.message.includes("Ownable: caller is not the owner"),
        `Expected "Ownable: caller is not the owner", but got: ${error.message}`
      );
    }
  });

  it("should allow a user to transfer tokens", async () => {
    const transferAmount = web3.utils.toBN(500);
    await fuegoInstance.transfer(user2, transferAmount, { from: user1 });

    const balance1 = await fuegoInstance.balanceOf(user1);
    const balance2 = await fuegoInstance.balanceOf(user2);

    assert(
      balance1.eq(web3.utils.toBN(1500)),
      `User1 should have 1500 tokens left, but got ${balance1.toString()}`
    );
    assert(
      balance2.eq(web3.utils.toBN(5500)), // 5000 from mint + 500 from transfer
      `User2 should have 5500 tokens, but got ${balance2.toString()}`
    );
  });

  it("should prevent transfers exceeding balance", async () => {
    try {
      await fuegoInstance.transfer(user2, 10000, { from: user1 });
      assert.fail(
        "Transfer should not be allowed when balance is insufficient"
      );
    } catch (error) {
      assert(
        error.message.includes("ERC20: transfer amount exceeds balance"),
        `Expected "ERC20: transfer amount exceeds balance", but got: ${error.message}`
      );
    }
  });

  it("should return the correct balance of an account", async () => {
    const balance = await fuegoInstance.balanceOf(user1);
    assert(
      balance.eq(web3.utils.toBN(1500)),
      `User1 balance should be 1500, but got ${balance.toString()}`
    );
  });
});
