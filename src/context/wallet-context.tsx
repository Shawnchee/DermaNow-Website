"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

// Add proper type definitions for window.ethereum
declare global {
  interface Window {
    ethereum?: {
      isMetaMask?: boolean
      request: (request: { method: string; params?: any[] }) => Promise<any>
      on: (eventName: string, callback: (...args: any[]) => void) => void
      removeListener: (eventName: string, callback: (...args: any[]) => void) => void
    }
  }
}

interface WalletContextType {
  walletAddress: string | null
  ethBalance: string | null
  connectWallet: () => Promise<string | null>
  disconnectWallet: () => void
  refreshBalance: () => Promise<void>
}

const WalletContext = createContext<WalletContextType | undefined>(undefined)

export function WalletProvider({ children }: { children: ReactNode }) {
  // Initialize with default values for preview mode
  const [walletAddress, setWalletAddress] = useState<string | null>("0x1234567890123456789012345678901234567890")
  const [ethBalance, setEthBalance] = useState<string | null>("0.45")

  // Initialize wallet from localStorage on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedAddress = localStorage.getItem("walletAddress")
      const storedBalance = localStorage.getItem("ethBalance") || "0.45"

      if (storedAddress) {
        setWalletAddress(storedAddress)
        setEthBalance(storedBalance)
      }
    }
  }, [])

  // Fetch ETH balance for the connected wallet
  const fetchBalance = async (address: string) => {
    try {
      if (typeof window !== "undefined" && window.ethereum) {
        // Try to get the actual balance from Sepolia testnet
        try {
          // First, check if we're on Sepolia network (chain ID 11155111)
          const chainId = await window.ethereum.request({ method: "eth_chainId" })

          // If we're not on Sepolia, we'll use mock data
          if (chainId !== "0xaa36a7") {
            // 0xaa36a7 is hex for 11155111 (Sepolia chain ID)
            console.log("Not on Sepolia network, using mock data")
            const mockBalance = "0.45"
            setEthBalance(mockBalance)
            localStorage.setItem("ethBalance", mockBalance)
            return
          }

          // Get actual balance from the network
          const balanceHex = await window.ethereum.request({
            method: "eth_getBalance",
            params: [address, "latest"],
          })

          // Convert from wei (hex) to ETH
          const balanceWei = Number.parseInt(balanceHex, 16)
          const balanceETH = (balanceWei / 1e18).toFixed(4)

          setEthBalance(balanceETH)
          localStorage.setItem("ethBalance", balanceETH)
        } catch (error) {
          console.error("Error fetching actual balance:", error)
          // Fallback to mock data
          const mockBalance = "0.45"
          setEthBalance(mockBalance)
          localStorage.setItem("ethBalance", mockBalance)
        }
      } else {
        // Set a default balance for demo purposes if ethereum is not available
        const mockBalance = "0.45"
        setEthBalance(mockBalance)
        localStorage.setItem("ethBalance", mockBalance)
      }
    } catch (error) {
      console.error("Error fetching balance:", error)
      // Set a fallback balance on error
      setEthBalance("0.45")
      localStorage.setItem("ethBalance", "0.45")
    }
  }

  const connectWallet = async () => {
    try {
      if (typeof window !== "undefined" && window.ethereum) {
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        })
        const account = accounts[0]
        setWalletAddress(account)
        localStorage.setItem("walletAddress", account)

        // Fetch balance after connecting
        await fetchBalance(account)

        return account
      } else {
        // For preview mode, set a mock wallet address
        const mockAddress = "0x1234567890123456789012345678901234567890"
        setWalletAddress(mockAddress)
        localStorage.setItem("walletAddress", mockAddress)

        // Set a default balance
        setEthBalance("0.45")
        localStorage.setItem("ethBalance", "0.45")

        return mockAddress
      }
    } catch (error) {
      console.error("Error connecting to MetaMask:", error)
      return null
    }
  }

  const disconnectWallet = () => {
    setWalletAddress(null)
    setEthBalance(null)
    localStorage.removeItem("walletAddress")
    localStorage.removeItem("ethBalance")
  }

  const refreshBalance = async () => {
    if (walletAddress) {
      await fetchBalance(walletAddress)
    } else {
      // For preview mode, set a default balance
      setEthBalance("0.45")
    }
  }

  // Listen for account changes in MetaMask
  useEffect(() => {
    if (typeof window !== "undefined" && window.ethereum) {
      const handleAccountsChanged = (accounts: string[]) => {
        if (accounts.length === 0) {
          // User disconnected their wallet
          disconnectWallet()
        } else if (accounts[0] !== walletAddress) {
          // User switched accounts
          setWalletAddress(accounts[0])
          localStorage.setItem("walletAddress", accounts[0])
          fetchBalance(accounts[0])
        }
      }

      window.ethereum.on("accountsChanged", handleAccountsChanged)

      return () => {
        window.ethereum?.removeListener("accountsChanged", handleAccountsChanged)
      }
    }
  }, [walletAddress])

  return (
    <WalletContext.Provider
      value={{
        walletAddress,
        ethBalance,
        connectWallet,
        disconnectWallet,
        refreshBalance,
      }}
    >
      {children}
    </WalletContext.Provider>
  )
}

export function useWallet() {
  const context = useContext(WalletContext)
  if (context === undefined) {
    throw new Error("useWallet must be used within a WalletProvider")
  }
  return context
}
