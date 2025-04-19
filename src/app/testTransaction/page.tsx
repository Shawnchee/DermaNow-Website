import SmartContractTransaction from "@/components/smart-contract-transaction"
import WalletAddressTransaction from "@/components/wallet-address-transaction"  
import FlaggedTransactions from "@/components/flagging"

export default function TestTransaction() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <WalletAddressTransaction />
            <FlaggedTransactions />
        </div>
    )
}