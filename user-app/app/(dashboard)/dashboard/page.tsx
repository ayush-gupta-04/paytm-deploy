import { getServerSession } from "next-auth";
import UpiHeading from "../../../components/upiheading";
import { NEXT_AUTH } from "../../../lib/auth";
import  prisma  from "../../../lib/db";
import { AddMoneyToWallet, PayToUpiId, TrackExpense, WithdrawFromWallet } from "../../../components/home_item_1";
import RecentTransactions from "../../../components/recentTransactions";

async function getUpi(){
    const session = await getServerSession(NEXT_AUTH);
    if(!session){
        return null;
    }
    try {
        const data = await prisma.user.findFirst({
            where : {
                id : session.user.id
            },select : {
                upi : true
            }
        })
        if(!data){
            return null;
        }
        return data.upi;
    } catch (error) {
        return null;
    }
}

async function getOnRampTransactions(){
    const session = await getServerSession(NEXT_AUTH);
    if(!session || !session.user){
        return []
    }
    const userId = session?.user?.id;
    try {
        const data = await prisma.onRampTransaction.findMany({
            where : {
                userId : userId
            },
            orderBy : {
                startTime : 'desc'
            },
            take : 5,
        })
        return data.map((tnx) => {
            return{
                onRamp : true,
                send : false,
                p2p : false,
                time : tnx.startTime.toDateString() + " " + tnx.startTime.toLocaleTimeString(),
                amount : tnx.amount,
                status : tnx.status.toString(),
                provider : tnx.provider,
                transactionId : tnx.id,
                timeInSeconds : tnx.startTime.getTime(),
            }
        })
    } catch (error) {
        return []
    }
}


async function getP2PTransactions(){
    const session =await getServerSession(NEXT_AUTH);
    if(!session || !session.user){
        return []
    }
    const userId = session?.user?.id;
    try {
        const data = await prisma.p2pTransfer.findMany({
            where : {
                OR : [
                    {
                        fromUserId : userId
                    },
                    {
                        toUserId : userId
                    }
                ]
            },
            orderBy : {
                timestamp : 'desc'
            },
            take : 5,
            select : {
                fromUser : {
                    select : {
                        firstname : true,
                        lastname : true,
                    }
                },
                toUser : {
                    select : {
                        firstname : true,
                        lastname : true,
                    }
                },
                fromUserPhone : true,
                fromUserUpi : true,
                toUserPhone : true,
                toUserUpi : true,
                fromUserId : true,
                toUserId : true,
                timestamp : true,
                amount : true,
                id : true,
            }
        })
    
        return data.map((tnx) => {
            if(tnx.fromUserId == userId){
                return {
                    onRamp : false,
                    p2p : true,
                    send : true,
                    transactionId : tnx.id,
                    sender : {
                        name : tnx.fromUser.firstname + " " + tnx.fromUser.lastname,
                        phone : tnx.fromUserPhone,
                        upi : tnx.fromUserUpi
                    },
                    receiver : {
                        name : tnx.toUser.firstname + " " + tnx.toUser.lastname,
                        phone : tnx.toUserPhone,
                        upi : tnx.toUserUpi
                    },
                    amount : tnx.amount,
                    time : tnx.timestamp.toDateString() + " " + tnx.timestamp.toLocaleTimeString(),
                    timeInSeconds : tnx.timestamp.getTime(),
                }
            }else{
                return {
                    onRamp : false,
                    p2p : true,
                    send : false,
                    transactionId : tnx.id,
                    sender : {
                        name : tnx.fromUser.firstname + " " + tnx.fromUser.lastname,
                        phone : tnx.fromUserPhone,
                        upi : tnx.fromUserUpi
                    },
                    receiver : {
                        name : tnx.toUser.firstname + " " + tnx.toUser.lastname,
                        phone : tnx.toUserPhone,
                        upi : tnx.toUserUpi
                    },
                    amount : tnx.amount,
                    time : tnx.timestamp.toDateString() + " " + tnx.timestamp.toLocaleTimeString(),
                    timeInSeconds : tnx.timestamp.getTime(),
                }
            }
        })
    } catch (error) {
        return []
    }
}

export default async function DashBoard(){
    const initialUpi = await getUpi();
    const onRampTnx = await getOnRampTransactions();
    const p2pTnx = await getP2PTransactions();
    const transactions = [...onRampTnx,...p2pTnx].sort((a,b) => b.timeInSeconds - a.timeInSeconds  );
    const safeUpi = {
        upi : initialUpi
    }
    return(
        <div className="w-full h-[770px] flex flex-col py-4 px-4 gap-8 bg-[#ECF5FC] relative overflow-auto" style={{scrollbarWidth : "thin"}}>
            <UpiHeading initialUpi={safeUpi}></UpiHeading>
            <div className="flex flex-row gap-32 justify-center">
                <AddMoneyToWallet></AddMoneyToWallet>
                <TrackExpense></TrackExpense>
                <PayToUpiId></PayToUpiId>
                <WithdrawFromWallet></WithdrawFromWallet>
            </div>
            <img src="./paytmImg1.svg" alt="" className="w-4/5 self-center h-[613px]"/>
            <div className="flex flex-col gap-3 h-full">
                <div className="w-fit h-fit px-3 py-2 bg-[#0560FD] text-white rounded-lg">
                    Recent Transactions
                </div>
                <RecentTransactions transactions = {transactions}></RecentTransactions>
            </div>
        </div>
    )
}