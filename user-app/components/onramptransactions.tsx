'use client'

type onRampTransactionsType = {
    time : string,
    amount : number,
    status : string,
    provider : string
}

export default function OnRampTransactions({onRampTnx} : {onRampTnx : onRampTransactionsType[]}){
    if(onRampTnx.length ==  0){
        return( 
            <div className="text-xl font-semibold text-gray-600">
                No recent Transactions
            </div>
        )
    }
    const history = onRampTnx.map((tnx) => 
        <div key={tnx.time} className="h-fit  justify-between flex items-center p-0.5 hover:bg-slate-200 px-2 py-1">
            <div className="flex flex-col justify-center">
                <div className="font-semibold text-md">{`From ${tnx.provider}`}</div>
                <div className=" text-sm text-gray-500">{tnx.time}</div>
            </div>
            <div className="flex flex-col justify-center">
                <div className={`font-medium self-end ${tnx.status == 'success'?"text-lime-600":tnx.status == "faliure"?"text-red-400":"text-gray-600"}`}>{`+ ${tnx.amount/100}  INR`}</div>
                <div className={`text-sm self-end ${tnx.status == 'success'?"text-lime-600":tnx.status == "faliure"?"text-red-400":"text-yellow-600"}`}>{tnx.status}</div>
            </div>
        </div>
    )
    return(
        <div>
            {history}
        </div>
    )
}
