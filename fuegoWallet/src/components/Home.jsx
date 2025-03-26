import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import {
  Form,
  Button,
  Card,
  Container,
  Row,
  Col,
  Spinner,
  Modal,
} from "react-bootstrap";
import Fuego from "../artifacts/contracts/Fuego.sol/Fuego.json";
import WalletBalance from "./WalletBalance";

const ERC20_ABI = [
  "function balanceOf(address owner) view returns (uint256)",
  "function transfer(address to, uint256 amount) returns (bool)",
];

const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

function Home() {
  const [tokenAddress, setTokenAddress] = useState("");
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");
  const [balance, setBalance] = useState(null);
  const [loading, setLoading] = useState(false);
  const [account, setAccount] = useState(null);
  const [contract, setContract] = useState(null);
  const [minted, setMinted] = useState(false);
  const [action, setAction] = useState(null);

  const [showModal, setShowModal] = useState(false);
  const handleShow = () => setShowModal(true);
  const handleClose = () => setShowModal(false);

  const mintAmount = 2000;

  useEffect(() => {
    getBalance();
    console.log(balance);
  }, []);

  const getBalance = async () => {
    if (!window.ethereum) return alert("Please install MetaMask");

    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const contract = new ethers.Contract(contractAddress, Fuego.abi, provider);
    const newBalance = await contract.balanceOf(signer.address);
    console.log("balance: ", Number(newBalance));
    setBalance(Number(newBalance));
    setMinted(newBalance > 0);
    setAccount(signer.address);
  };

  const openModal = () => {
    getBalance();
    handleShow();
  };

  const mintTokens = async () => {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const contract = new ethers.Contract(contractAddress, Fuego.abi, signer);
    try {
      const result = await contract.mintOnce();
      console.log("Transaction sent. Waiting for confirmation...");
      await result.wait();
      setAction("You have minted 2000FTGs");
      console.log("You have minted tokens");
    } catch (error) {
      if (error.message.includes("Token already claimed")) {
        setAction("Tokens already claimed.");
        setMinted(true);
      }
      console.error("Error minting token:", error);
    }
  };

  const transferTokens = async () => {
    if (!window.ethereum) return alert("Please install MetaMask");

    setLoading(true);
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(contractAddress, Fuego.abi, signer);
      const tx = await contract.transferTokens(recipient, BigInt(amount));
      console.log("Transaction sent. Waiting for confirmation...");
      await tx.wait();
      //   alert("Transfer successful!");
      setAction(`You have sent ${amount} to ${recipient}`);
    } catch (error) {
      alert("Transfer failed: " + error.message);
      console.log("Error: ", error);
    }
    setLoading(false);
  };

  return (
    <Container className="mt-4">
      <Row className="justify-content-center">
        <Col md={6}>
          <Card className="p-3 shadow-sm">
            <WalletBalance />
          </Card>
          <Card className="p-3 shadow-sm mt-4">
            <Card.Body>
              <h5>Fuego Token Balance</h5>
              <Form>
                <Button onClick={openModal} className="w-100 balance-btn">
                  Check Balance
                </Button>
              </Form>
              <AccountBalanceModal
                show={showModal}
                onClose={handleClose}
                account={account}
                balance={balance}
              />
            </Card.Body>
          </Card>
        </Col>
        <Col md={6}>
          <Card className="shadow-lg">
            <Card.Header className="bg-success text-white text-center">
              🔥 Claim 2000 Fuego Tokens
            </Card.Header>
            <Card.Body className="text-center">
              <ActionCompleted action={action} />
              <Card.Text>
                Click the button below to claim your{" "}
                <strong>2000FTG Free</strong> tokens. You can only claim once!
              </Card.Text>
              {account ? (
                <Button
                  variant={minted ? "secondary" : "success"}
                  onClick={mintTokens}
                  disabled={minted || loading}
                >
                  {loading ? (
                    <Spinner as="span" animation="border" size="sm" />
                  ) : minted ? (
                    "Already Claimed"
                  ) : (
                    "Mint 2000 Fuego"
                  )}
                </Button>
              ) : (
                <Button className="balance-btn">Claim</Button>
              )}
            </Card.Body>
            {account && (
              <Card.Footer className="text-muted text-center title-3">
                Connected: {account}
              </Card.Footer>
            )}
          </Card>
          <Card className="p-3 shadow-sm mt-4">
            <Card.Body>
              <h5>Transfer Fuego(FTG) Tokens</h5>
              <Form>
                <Form.Group className="mb-3">
                  <Form.Label>Recipient Address</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter recipient address"
                    value={recipient}
                    onChange={(e) => setRecipient(e.target.value)}
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Amount</Form.Label>
                  <Form.Control
                    type="number"
                    placeholder="Enter amount"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                  />
                </Form.Group>
                <Button
                  variant="success"
                  onClick={transferTokens}
                  className="w-100"
                  disabled={loading}
                >
                  {loading ? (
                    <Spinner animation="border" size="sm" />
                  ) : (
                    "Transfer Tokens"
                  )}
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default Home;

const ActionCompleted = ({ action }) => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (action) {
      setShow(true);
      const timer = setTimeout(() => setShow(false), 3000);

      return () => clearTimeout(timer); // Cleanup timeout
    }
  }, [action]); // Runs only when `action` changes

  return (
    <Modal show={show} onHide={() => setShow(false)} centered>
      <Modal.Body>{action}</Modal.Body>
    </Modal>
  );
};

const AccountBalanceModal = ({ show, onClose, account, balance }) => {
  return (
    <Modal show={show} onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title className="title">Account Balance</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Container className="text-center">
          <Row className="justify-content-center mb-3">
            <Col sm={12} md={8}>
              <Card className="shadow-sm title">
                <Card.Body>
                  <h4 className="mb-3 title-2">Account: {account}</h4>
                  <h5 className="text-success">Balance: {balance} FGO</h5>
                </Card.Body>
              </Card>
            </Col>
          </Row>
          <Button variant="secondary" onClick={onClose} className="w-100 mt-3">
            Close
          </Button>
        </Container>
      </Modal.Body>
    </Modal>
  );
};
