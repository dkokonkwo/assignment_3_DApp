// SPDX-License-Identifier: MIT
// Compatible with OpenZeppelin Contracts ^5.0.0
pragma solidity ^0.8.22;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {ERC20Permit} from "@openzeppelin/contracts/token/ERC20/extensions/ERC20Permit.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

contract Fuego is ERC20, Ownable, ERC20Permit {
    mapping(address => bool) private hasMinted;

    uint256 private constant MINT_AMOUNT = 2000; // 2000 FGO with 18 decimals

    constructor(address initialOwner)
        ERC20("Fuego", "FGO")
        ERC20Permit("Fuego")
        Ownable(initialOwner) // Ensuring proper Ownable setup
    {}

    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
    }

    function mintOnce() public {
        require(!hasMinted[msg.sender], "Token already claimed.");
        require(msg.sender == tx.origin, "Contracts not allowed."); // Prevent smart contract interactions
        hasMinted[msg.sender] = true;
        _mint(msg.sender, MINT_AMOUNT);
    }

    function checkBalance(address account) public view returns (uint256) {
        return balanceOf(account);
    }

    function transferTokens(address to, uint256 amount) public returns (bool) {
        _transfer(msg.sender, to, amount);
        return true;
    }
}


