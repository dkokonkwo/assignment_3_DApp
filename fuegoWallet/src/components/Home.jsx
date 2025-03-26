import React, { useState } from "react";
import { ethers } from "ethers";
import { Input, Button, Card, CardContent } from "@/components/ui";

const ERC20_ABI = [
  "function balanceOf(address owner) view returns (uint256)",
  "function transfer(address to, uint256 amount) returns (bool)",
];

const ERC20Transfer = () => {
  const [tokenAddress, setTokenAddress] = useState("");
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");
  const [balance, setBalance] = useState(null);
  const [loading, setLoading] = useState(false);

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
      const contract = new ethers.Contract(tokenAddress, ERC20_ABI, signer);
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
    <div className="flex flex-col items-center p-4">
      <Card className="w-full max-w-md p-4 shadow-md">
        <CardContent>
          <Input
            placeholder="ERC20 Token Address"
            value={tokenAddress}
            onChange={(e) => setTokenAddress(e.target.value)}
          />
          <Button onClick={getBalance} className="mt-2">
            Check Balance
          </Button>
          {balance !== null && (
            <p className="mt-2">Balance: {balance} Tokens</p>
          )}
        </CardContent>
      </Card>

      <Card className="w-full max-w-md mt-4 p-4 shadow-md">
        <CardContent>
          <Input
            placeholder="Recipient Address"
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
          />
          <Input
            placeholder="Amount"
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="mt-2"
          />
          <Button onClick={transferTokens} className="mt-2" disabled={loading}>
            {loading ? "Transferring..." : "Transfer Tokens"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default ERC20Transfer;
