import { getServerSession } from "next-auth";
import {AddMoney} from "../../../components/addmoney";
import {Balance} from "../../../components/balance";
import UpiHeading from "../../../components/upiheading";
import { NEXT_AUTH } from "../../../lib/auth";
import  prisma  from "../../../lib/db";

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
async function getBalance(){
    const session = await getServerSession(NEXT_AUTH);
    try {
        const balance = await prisma.balance.findFirst({
            where: {
                userId: (session?.user?.id)
            }
        });
        return {
            amount: balance?.amount || 0,
            locked: balance?.locked || 0
        }
    } catch (error) {
        return {
            amount: 0,
            locked: 0
        }
    }
}

export default async function TransactionPage(){
    const initialUpi = await getUpi();
    const balanceData = await getBalance();
    const safeUpi = {
        upi : initialUpi
    }
    return(
        <div className="h-[770px] overflow-auto w-full flex flex-col py-4 px-4 gap-8 bg-[#ECF5FC] " style={{scrollbarWidth : "thin"}}>
            <UpiHeading initialUpi={safeUpi}></UpiHeading>
            <Balance amount={balanceData.amount} locked={balanceData.locked}></Balance>
            <AddMoney></AddMoney>
        </div>
    )
}

