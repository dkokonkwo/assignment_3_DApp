import React from "react";
import { ethers } from "ethers";
import { useState } from "react";
import { Modal, Button } from "react-bootstrap";
import Fuego from "../artifacts/contracts/Fuego.sol/Fuego.json";

function WalletBalance() {
  const [balance, setBalance] = useState();
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => {
    getBalance(); // Call the getBalance function
    setShow(true); // Then open the modal
  };

  // const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

  // const provider = new ethers.BrowserProvider(window.ethereum);

  // const signer = provider.getSigner();

  // const contract = new ethers.Contract(contractAddress, Krypton.abi, provider);

  // const getCount = async () => {
  //   try {
  //     const count = await contract.count();
  //     console.log("Total tokens minted:", count.toString());
  //   } catch (error) {
  //     console.error("Error calling count function:", error);
  //   }
  // };

  const getBalance = async () => {
    const [account] = await window.ethereum.request({
      method: "eth_requestAccounts",
    });
    console.log(account);
    const provider = new ethers.BrowserProvider(window.ethereum);
    const balance = await provider.getBalance(account);
    setBalance(ethers.formatEther(balance));
    console.log(ethers.formatEther(balance));

    const blockNumber = await provider.getBlockNumber();
    console.log("Current block number:", blockNumber);

    // getCount();
  };

  return (
      <div>
          <h3>My ETH Wallet</h3>
      <Button onClick={handleShow} className="balance-btn">
        Check Balance
      </Button>
      <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Account Balance</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <h4 className="balance">{balance} ETH</h4>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default WalletBalance;
