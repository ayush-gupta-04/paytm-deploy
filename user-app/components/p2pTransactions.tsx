'use client'

type onRampTransactionsType = {
    send : boolean
    time : string,
    amount : number,
    name : string,
    phone : string | null
}

export default function P2PTransactions({p2pTnx} : {p2pTnx : onRampTransactionsType[]}){
    if(p2pTnx.length ==  0){
        return( 
            <div className="text-xl font-semibold text-gray-600">
                No recent Transfers
            </div>
        )
    }
    const history = p2pTnx.map((tnx) => 
        <div key={tnx.time} className="h-fit  justify-between flex items-center p-0.5 hover:bg-slate-200 px-2 py-1">
            <div className="flex flex-col justify-center">
                <div className="font-semibold text-md">{`${tnx.send?`To ${tnx.name}`:`From ${tnx.name}`}`}</div>
                <div className="font-semibold text-xs text-gray-600">{tnx.phone}</div>
                <div className=" text-sm text-gray-500">{tnx.time}</div>
            </div>
            <div className="flex flex-col justify-center">
                <div className={`font-medium ${tnx.send?"text-red-400":"text-lime-600"}`}>{`${tnx.send?`- ${tnx.amount/100} INR`:`+ ${tnx.amount/100} INR`}`}</div>
            </div>
        </div>
    )
    return(
        <div>
            {history}
        </div>
    )
}
