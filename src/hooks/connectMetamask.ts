"use client"; // For Next.js Apps

import { useState, useEffect, useCallback } from "react";
import { ethers } from "ethers";

declare global {
  interface Window {
    ethereum?: any;
  }
}

const connectMetamask = () => {
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);
  const [signer, setSigner] = useState<ethers.Signer | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined" && window.ethereum) {
      const initProvider = new ethers.BrowserProvider(window.ethereum);
      setProvider(initProvider);
    }
    const savedAddress = localStorage.getItem("walletAddress");
    if (savedAddress) {
      setWalletAddress(savedAddress);
    }
    
  }, []);

  const connectWallet = useCallback(async () => {
    if (!window.ethereum) {
      alert("MetaMask is not installed. Please install it.");
      return;
    }

    try {
      const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
      if (accounts.length === 0) {
        console.warn("No accounts found.");
        return;
      }
      console.log("Accounts fetched from MetaMask:", accounts);
      const selectedAccount = accounts[0];
      const newProvider = new ethers.BrowserProvider(window.ethereum);
      const newSigner = await newProvider.getSigner();

      setWalletAddress(selectedAccount);
      localStorage.setItem("walletAddress", selectedAccount);
      setProvider(newProvider);
      setSigner(newSigner);

      console.log("Connected with MetaMask:", selectedAccount);
    } catch (error: any) {
      if (error.code === 4001) {
        console.error("User rejected the connection request.");
      } else {
        console.error("Error connecting wallet:", error);
      }
    }
  }, []);

  return { walletAddress, provider, signer, connectWallet };
};

export default connectMetamask;