import { getServerSession } from "next-auth";
import { NEXT_AUTH } from "../../../lib/auth";
import  prisma  from "../../../lib/db";
import TransactionsWithFilter from "../../../components/transactions";
import UpiHeading from "../../../components/upiheading";


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
            }
        })
        return data.map((tnx) => {
            return {
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
export default async function HistoryOfTransaction(){
    const onRampTnx = await getOnRampTransactions();
    const p2pTnx = await getP2PTransactions();
    const transactions = [...onRampTnx,...p2pTnx].sort((a,b) => a.timeInSeconds - b.timeInSeconds);
    const initialUpi = await getUpi();
    const safeUpi = {
        upi : initialUpi
    }
    
    return (
        <div className="h-full w-full flex flex-col py-4 px-4 gap-8 bg-[#ECF5FC] relative">
            <UpiHeading initialUpi={safeUpi}></UpiHeading>
            <div className="flex flex-col gap-3 h-full">
                <div className="w-fit h-fit px-3 py-2 bg-[#0560FD] text-white rounded-lg">
                    Transaction history
                </div>
                <TransactionsWithFilter transactions ={transactions} ></TransactionsWithFilter>
            </div>
        </div>
    )
}

