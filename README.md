# **Fuego DApp**

## **📌 Overview**  
The **Fuego DApp** is a decentralized application that allows users to mint **2000 Fuego tokens (FGO) once** and transfer tokens to other users. Built using **Solidity, Hardhat, React, and ethers.js**, this DApp provides a seamless user experience on the Ethereum blockchain.

---

## **🛠️ Prerequisites**  
Ensure you have the following installed:
- **Node.js** (>=16.x) → [Download Here](https://nodejs.org/)
- **Hardhat** → `npm install --save-dev hardhat`
- **MetaMask** Extension → [Download Here](https://metamask.io/)
- **Ethereum Wallet with Testnet Funds**

---

## **🚀 1. Setup the Project**  
Clone the repository and install dependencies:  
```sh
git clone https://github.com/your-repo/fuego-dapp.git
cd fuego-dapp
npm install
```

---

## **🏗️ 2. Smart Contract Development**  

### **Initialize Hardhat (if not already set up)**  
```sh
npx hardhat
```
Choose **"Create an empty hardhat.config.js"** if prompted.

### **Compile the Contract**  
```sh
npx hardhat compile
```

### **Run Local Hardhat Node**  
```sh
npx hardhat node
```
This starts a local Ethereum blockchain.

---

## **📜 3. Deploy the Smart Contract**  
Create a `deploy.js` script inside the `scripts/` folder:

```js
const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying contract with the account:", deployer.address);

  const Fuego = await hre.ethers.getContractFactory("Fuego");
  const fuego = await Fuego.deploy(deployer.address);

  await fuego.waitForDeployment();
  console.log("Fuego deployed to:", await fuego.getAddress());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
```

Run the deployment script:
```sh
npx hardhat run scripts/deploy.js --network localhost
```
👉 **Save the contract address** for frontend integration.

---

## **✅ 4. Test the Smart Contract**  
Run the test cases to ensure everything works correctly:
```sh
npx hardhat test
```

---

## **🌍 5. Frontend Setup**  

### **Update Contract Address**  
Modify the `frontend/src/config.js` file:
```js
export const CONTRACT_ADDRESS = "YOUR_DEPLOYED_CONTRACT_ADDRESS";
```

### **Start the Frontend**  
```sh
cd frontend
npm install
npm start
```

---

## **📝 6. Using the DApp**  

### **🪙 Mint Fuego Tokens**  
- Open the **DApp** in your browser.
- Connect your MetaMask wallet.
- Click **"Mint 2000 Fuego"** (Only works once per user).

### **🔁 Transfer Tokens**  
- Enter the **receiver’s address** and the **amount**.
- Click **"Send"** to transfer tokens.

### **🔍 Check Balance**  
- The UI displays your **Fuego balance**.

---

## **🛠️ 7. Deploy to a Testnet (Optional)**  
To deploy on **Goerli, Sepolia, or any testnet**, update `hardhat.config.js`:

```js
module.exports = {
  solidity: "0.8.22",
  networks: {
    sepolia: {
      url: "https://eth-sepolia.alchemyapi.io/v2/YOUR_ALCHEMY_KEY",
      accounts: ["YOUR_PRIVATE_KEY"]
    }
  }
};
```

Then, deploy:
```sh
npx hardhat run scripts/deploy.js --network sepolia
```

---

## **📢 Conclusion**  
🎉 Your DApp is now **fully functional**! You can:  
✅ Mint tokens ✅ Transfer tokens ✅ Check balance ✅ Deploy to a testnet  

