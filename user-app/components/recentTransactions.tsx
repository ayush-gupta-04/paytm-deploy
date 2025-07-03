'use client'
type onRampTnx = {
    onRamp: boolean;
    send: boolean;
    p2p : boolean;
    time: string;
    amount: number;
    status: string;
    provider: string;
    timeInSeconds: number;
} 

type p2pTnx = {
    onRamp: boolean;
    send: boolean;
    p2p : boolean;
    transactionId: string;
    sender: {
        name: string;
        phone: string | null;
        upi: string | null;
    };
    receiver: {
        name: string;
        phone: string | null;
        upi: string | null;
    };
    amount: number;
    time: string;
    timeInSeconds: number;
    
}

type CombinedTransactions = p2pTnx | onRampTnx
function isTypeP2P(item : p2pTnx | onRampTnx) : item is p2pTnx{
    return (item as p2pTnx).p2p
}
function isTypeOnRamp(item : p2pTnx | onRampTnx) : item is onRampTnx{
    return (item as onRampTnx).onRamp
}


export default function RecentTransactions({transactions} : {transactions : CombinedTransactions[]}){
    return(
            <div className={`w-full duration-300 transition-all bg-white rounded-lg py-4 px-4 min-h-[625px] shadow-xl`}>
                <div className="text-xl font-medium py-2 border-b-2"> Transactions</div>
                <div className=" h-[540px] overflow-auto " style={{scrollbarWidth : "thin"}}>
                    {transactions.map((tnx,id) => {
                        if(isTypeOnRamp(tnx)){
                            return (
                                <div className="w-full min-h-fit flex flex-col  px-3 py-2 hover:bg-slate-100" key={id+""} >
                                    <div className="flex flex-row justify-between">
                                        <div className="font-medium">{tnx.provider}</div>
                                        <div className="text-lg font-medium"> + {tnx.amount/100}</div>
                                    </div>
                                    <div className="flex flex-row justify-between">
                                        <div className="text-slate-600">{tnx.time}</div>
                                        <div className={`${tnx.status == "success"?"text-green-600":`${tnx.status == "processing"?"text-yellow-700":"text-red-700"}`}`}>{tnx.status}</div>
                                    </div>
                                </div>
                            )
                        }else if (isTypeP2P(tnx)){
                            return(
                                <div className="w-full min-h-fit flex flex-col px-3 py-2 hover:bg-slate-100" key={id+""}>
                                    <div className="flex flex-row justify-between">
                                        <div className="font-medium">{tnx.send?`Send to : ${tnx.receiver.name}`:`Received from : ${tnx.sender.name}`}</div>
                                    <div className={`text-lg font-medium`}>{tnx.send?`- ${tnx.amount/100}`:`+ ${tnx.amount/100}`}</div>
                                    </div>
                                    <div className="flex flex-row justify-between">
                                        <div className="text-slate-600">{tnx.time}</div>
                                        <div className="text-green-700">{tnx.send?`sent successfully`:`received successfully`}</div>
                                    </div>
                                </div>
                            )
                        }
                    })}
                </div>
            </div>
    )
}