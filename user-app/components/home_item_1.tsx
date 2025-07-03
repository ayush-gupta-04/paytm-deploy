'use client'

import { useRouter } from "next/navigation"


export function AddMoneyToWallet(){
    const router = useRouter();
    return(
        <div className="size-60 transition-all hover:scale-105 cursor-pointer" onClick={() => {router.push('./wallet')}}>
            <img src="./addMoneyToWallet.png" alt="" />
        </div>
    )
}
export function TrackExpense(){
    const router = useRouter();
    return(
        <div  className="size-60 transition-all hover:scale-105 cursor-pointer" onClick={() => {router.push('./history')}}>
            <img src="./trackExpenses.png" alt="" />
        </div>
    )
}
export function PayToUpiId(){
    const router = useRouter();
    return(
        <div  className="size-60 transition-all hover:scale-105 cursor-pointer" onClick={() => {router.push('./transfer')}}>
            <img src="./payToUpi.png" alt="" />
        </div>
    )
}
export function WithdrawFromWallet(){
    return(
        <div  className="size-60 transition-all hover:scale-105 cursor-pointer">
            <img src="./withdrawFromWallet.png" alt="" />
        </div>
    )
}