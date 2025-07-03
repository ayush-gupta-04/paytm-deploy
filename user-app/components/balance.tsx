
export async function Balance({amount,locked} : {amount : number,locked : number}){
    
    return(
        <div>
            <span className="bg-[#005EFF] px-3 py-2 rounded-lg text-white">
                Wallet Balance
            </span>
            <div className="w-full h-56 bg-white shadow-md grid grid-cols-3 mt-4 rounded-lg py-6">
                <div className="border-0 border-r-2 px-4">
                    <div className="font-medium text-md">
                        Total Balance
                    </div>
                    <div className="flex flex-row justify-center items-center h-full">
                        <div className="flex felx-row gap-2">
                            <div className="text-6xl">{amount/100}</div>
                            <div className="self-end">INR</div>
                        </div>
                    </div>
                </div>
                <div className="border-0 border-r-2 px-4">
                    <div className="font-medium text-md">
                        Locked Balance
                    </div>
                    <div className="flex flex-row justify-center items-center h-full">
                        <div className="flex felx-row gap-2">
                            <div className="text-6xl">{locked/100}</div>
                            <div className="self-end">INR</div>
                        </div>
                    </div>
                </div>
                <div className="px-4">
                    <div className="font-medium text-md">
                        Unlocked Balance
                    </div>
                    <div className="flex flex-row justify-center items-center h-full">
                        <div className="flex felx-row gap-2">
                            <div className="text-6xl">{amount/100 - locked/100}</div>
                            <div className="self-end">INR</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

