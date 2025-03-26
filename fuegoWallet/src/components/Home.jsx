import React, { useState } from "react";
import { ethers } from "ethers";
import {
  Form,
  Button,
  Card,
  Container,
  Row,
  Col,
  Spinner,
} from "react-bootstrap";
import Fuego from "../artifacts/contracts/Fuego.sol/Fuego.json";
import WalletBalance from "./WalletBalance";

const ERC20_ABI = [
  "function balanceOf(address owner) view returns (uint256)",
  "function transfer(address to, uint256 amount) returns (bool)",
];

const contractAddress = "0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9";

function Home() {
  const [tokenAddress, setTokenAddress] = useState("");
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");
  const [balance, setBalance] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [account, setAccount] = useState(null);
  const [contract, setContract] = useState(null);
  const mintAmount = 2000;

  const getBalance = async () => {
    if (!window.ethereum) return alert("Please install MetaMask");

    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const contract = new ethers.Contract(tokenAddress, ERC20_ABI, provider);
    const balance = await contract.balanceOf(signer.address);
    setBalance(ethers.formatUnits(balance, 18));
  };

  const transferTokens = async () => {
    if (!window.ethereum) return alert("Please install MetaMask");

    setLoading(true);
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(contractAddress, Fuego.abi, signer);
      const tx = await contract.transfer(
        recipient,
        ethers.parseUnits(amount, 18)
      );
      await tx.wait();
      alert("Transfer successful!");
    } catch (error) {
      alert("Transfer failed: " + error.message);
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
              <Form>
                <Form.Group className="mb-3">
                  <Form.Label>ERC20 Token Address</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter token contract address"
                    value={tokenAddress}
                    onChange={(e) => setTokenAddress(e.target.value)}
                  />
                </Form.Group>
                <Button
                  variant="primary"
                  onClick={getBalance}
                  className="w-100"
                >
                  Check Balance
                </Button>
                {balance !== null && (
                  <p className="mt-2 text-center">Balance: {balance} Tokens</p>
                )}
              </Form>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6}>
          <Card className="shadow-lg">
            <Card.Header className="bg-primary text-white text-center">
              🔥 Claim 2000 Fuego Tokens
            </Card.Header>
            <Card.Body className="text-center">
              <Card.Text>
                Click the button below to claim your <strong>2000FTG Free</strong>{" "}
                tokens. You can only claim once!
              </Card.Text>

              {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}

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
                <Button variant="primary">
                  Claim
                </Button>
              )}
            </Card.Body>
            {account && (
              <Card.Footer className="text-muted text-center">
                Connected: {account}
              </Card.Footer>
            )}
          </Card>
          <Card className="p-3 shadow-sm mt-4">
            <Card.Body>
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
