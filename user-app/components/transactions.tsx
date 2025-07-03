'use client'
import { transactionAtom } from "../lib/store";
import Tick from "../ui/tick";
import { Dispatch, SetStateAction, useEffect, useState } from "react"
import { useRecoilState, useSetRecoilState } from "recoil";
import BackIcon from "./backIcon";

type onRampTnx = {
    onRamp: boolean;
    send: boolean;
    p2p : boolean;
    time: string;
    amount: number;
    status: string;
    provider: string;
    timeInSeconds: number;
    transactionId: string;
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


export default function TransactionsWithFilter({transactions} : {transactions : CombinedTransactions[]}){
    const[hide,setHide] = useState(true);
    const[showTnxID,setShowTnxId] = useState<string | null>(null);
    const[transactionsState,setTransactionState] = useRecoilState(transactionAtom)
    useEffect(() => {
        //if no filter is open || initial render --> then set transactionsState to the server fetched values
        if(transactionsState == null || hide){
            setTransactionState(transactions);
        }
    },[hide])
    return(
        <div className={`w-full duration-300 flex flex-row justify-between relative h-[625px]`}>
            <div className={`${hide?"w-full":"w-3/4 mr-4"} duration-300 transition-all rounded-lg py-4 px-4 h-full bg-white shadow-xl`}>
                <div className="py-2 flex justify-between items-center border-b-2 z-10 sticky">
                    <div className="text-xl font-medium"> Transactions</div>
                    <div className="bg-[#07CBFD] mx-4 px-6 py-1 rounded-lg" onClick={() => {setHide(!hide)}}> filter</div>
                </div>
                <div className="my-2 h-[530px] overflow-auto " style={{scrollbarWidth : "thin",}}>
                <BackgroundSupporter hide = {!showTnxID}></BackgroundSupporter>
                    {transactionsState && transactionsState.map((tnx,id) => {
                        if(isTypeOnRamp(tnx)){
                            return (
                                <div className="w-full min-h-fit flex flex-col  px-3 py-2 hover:bg-slate-100" key={id+""}  onClick={() => {setShowTnxId(id.toString())}}>
                                    <div className="flex flex-row justify-between">
                                        <div className="font-medium">{tnx.provider}</div>
                                        <div className="text-lg font-medium"> + {tnx.amount/100}</div>
                                    </div>
                                    <div className="flex flex-row justify-between">
                                        <div className="text-slate-600">{tnx.time}</div>
                                        <div className={`${tnx.status == "success"?"text-green-600":`${tnx.status == "processing"?"text-yellow-700":"text-red-700"}`}`}>{tnx.status}</div>
                                    </div>
                                    {showTnxID == id.toString() && <OnRampTnxDetails amount = {tnx.amount} provider = {tnx.provider} time = {tnx.time} tnxId = {tnx.transactionId} status = {tnx.status} setShow = {setShowTnxId}></OnRampTnxDetails>}
                                </div>
                            )
                        }else if (isTypeP2P(tnx)){
                            return(
                                <div className="w-full min-h-fit flex flex-col px-3 py-2 hover:bg-slate-100" key={id+""} onClick={() => {setShowTnxId(id.toString())}}>
                                    <div className="flex flex-row justify-between">
                                        <div className="font-medium">{tnx.send?`Send to : ${tnx.receiver.name}`:`Received from : ${tnx.sender.name}`}</div>
                                    <div className={`text-lg font-medium`}>{tnx.send?`- ${tnx.amount/100}`:`+ ${tnx.amount/100}`}</div>
                                    </div>
                                    <div className="flex flex-row justify-between">
                                        <div className="text-slate-600">{tnx.time}</div>
                                        <div className="text-green-700">{tnx.send?`sent successfully`:`received successfully`}</div>
                                    </div>
                                    {showTnxID == id.toString() && <P2PTnxDetails amount = {tnx.amount/100} sender = {tnx.sender} receiver = {tnx.receiver} send = {tnx.send} tnxId = {tnx.transactionId} time = {tnx.time} setShow={setShowTnxId}></P2PTnxDetails>}
                                </div>
                            )
                        }
                    })}
                </div>
            </div>
            <Filter hide = {hide} transactions = {transactions}></Filter>
        </div>
    )
}

function BackgroundSupporter({hide} : {hide : boolean}){
    return(
        <div className={`w-screen fixed z-10 top-1/2 left-1/2 transition-all -translate-x-1/2 -translate-y-1/2 h-full duration-300 ${hide?"opacity-0 pointer-events-none":"opacity-100 backdrop-brightness-50"}`} onClick={(e) => {e.stopPropagation()}}>  
        </div>
    )
}


function FilterIcon(){
    return(
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="size-6">
  <path stroke-linecap="round" stroke-linejoin="round" d="M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 0 1-.659 1.591l-5.432 5.432a2.25 2.25 0 0 0-.659 1.591v2.927a2.25 2.25 0 0 1-1.244 2.013L9.75 21v-6.568a2.25 2.25 0 0 0-.659-1.591L3.659 7.409A2.25 2.25 0 0 1 3 5.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0 1 12 3Z" />
</svg>

    )
}



function OnRampTnxDetails({amount,provider,status,tnxId,time,setShow} : {amount : number,provider : string,status : string,tnxId : string,time : string,setShow : Dispatch<SetStateAction<string | null>>}){
    return(
        <div className={`fixed z-20 shadow-black shadow-lg transition-all top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1/3 h-fit bg-white px-4 py-4 flex flex-col rounded-lg`} onClick={(e) => {e.stopPropagation()}}>
            <div className="flex flex-row justify-between border-b-2 py-2 text-3xl font-medium">
                <div onClick={() => {setShow(null)}} className="cursor-pointer"><BackIcon></BackIcon></div>
                <div>Payment Details</div>
                <div></div>
            </div>
            <div className=" flex flex-col gap-1 py-2 border-b-2 px-3">
                <div className="text-blue-600">Amount</div>
                <div className="  flex gap-2">
                    <div className="text-5xl font-medium">{amount/100}</div>
                    <div className="self-end">INR</div>
                    {status == 'success' && <div className="self-center"><Tick></Tick></div>}
                </div>
                <div className={`${status == "success"?"text-green-600":`${status == "processing"?"text-yellow-700":"text-red-700"}`}`}>{status}</div>
            </div>

            <div className="flex flex-col gap-1 py-2 border-b-2 px-3">
                <div className="text-blue-700">From</div>
                <div className="flex gap-2">
                    <div className="text-4xl">{provider}</div>
                    {/* <div className="self-center"><BlueTick></BlueTick></div> */}
                </div>
            </div>

            <div className="flex flex-col gap-2 pt-3 px-3">
                <div>Time : {time}</div>
                <div className="flex gap-4">
                    <div>Transaction ID : {tnxId}</div>
                    <div><CopyIcon></CopyIcon></div>
                </div>
            </div>
        </div>
    )
}




function P2PTnxDetails({amount,sender,receiver,send,tnxId,time,setShow} : {amount : number,sender : {name : string,phone : string|null,upi : string | null},receiver : {name : string,phone : string|null,upi : string | null},send : boolean,tnxId : string,time : string,setShow : Dispatch<SetStateAction<string | null>>}){
    return(
        <div className={`fixed z-20 shadow-black shadow-lg transition-all top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1/3 h-fit bg-white px-4 py-4 flex flex-col rounded-lg`} onClick={(e) => {e.stopPropagation()}}>
            <div className="flex flex-row justify-between border-b-2 py-2 text-3xl font-medium">
                <div onClick={() => {setShow(null)}} className="cursor-pointer"><BackIcon></BackIcon></div>
                <div>Payment Details</div>
                <div></div>
            </div>
            <div className=" flex flex-col gap-1 py-2 border-b-2 px-3">
                <div className="text-blue-600">Amount</div>
                <div className="  flex gap-2">
                    <div className="text-5xl font-medium">{amount}</div>
                    <div className="self-end">INR</div>
                    <div className="self-center"><Tick></Tick></div>
                </div>
                <div className="text-md text-green-500">Successfull payment</div>
            </div>

            <div className="flex flex-col gap-1 py-2 border-b-2 px-3">
                <div className="text-blue-700">From</div>
                <div className="flex gap-2">
                    <div className="text-4xl">{sender.name}</div>
                    <div className="self-center"><BlueTick></BlueTick></div>
                </div>
                <div className="text-gray-700">{sender.phone?`Phone : ${sender.phone}`:`UPI ID : ${sender.upi}`}</div>
            </div>

            <div className="flex flex-col gap-1 py-2 border-b-2 px-3">
                <div className="text-blue-700">To</div>
                <div className="flex gap-2">
                    <div className="text-4xl">{receiver.name}</div>
                    <div className="self-center"><BlueTick></BlueTick></div>
                </div>
                <div className="text-gray-700">{receiver.phone?`Phone : ${receiver.phone}`:`UPI ID : ${receiver.upi}`}</div>
            </div>

            <div className="flex flex-col gap-2 pt-3 px-3">
                <div>Time : {time}</div>
                <div className="flex gap-4">
                    <div>Transaction ID : {tnxId}</div>
                    <div><CopyIcon></CopyIcon></div>
                </div>
            </div>

            

        </div>
    )
}

function CopyIcon(){
    return(
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="size-6 hover:stroke-blue-600 hover:cursor-pointer">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15.666 3.888A2.25 2.25 0 0 0 13.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 0 1-.75.75H9a.75.75 0 0 1-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 0 1-2.25 2.25H6.75A2.25 2.25 0 0 1 4.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 0 1 1.927-.184" />
        </svg>
    )
}


function BlueTick(){
    return(
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 16 16" fill="none">
<path d="M5.52727 16L4.14545 13.5619L1.52727 12.9524L1.78182 10.1333L0 8L1.78182 5.86667L1.52727 3.04762L4.14545 2.4381L5.52727 0L8 1.10476L10.4727 0L11.8545 2.4381L14.4727 3.04762L14.2182 5.86667L16 8L14.2182 10.1333L14.4727 12.9524L11.8545 13.5619L10.4727 16L8 14.8952L5.52727 16ZM6.14545 14.0571L8 13.219L9.89091 14.0571L10.9091 12.2286L12.9091 11.7333L12.7273 9.6L14.0727 8L12.7273 6.36191L12.9091 4.22857L10.9091 3.77143L9.85455 1.94286L8 2.78095L6.10909 1.94286L5.09091 3.77143L3.09091 4.22857L3.27273 6.36191L1.92727 8L3.27273 9.6L3.09091 11.7714L5.09091 12.2286L6.14545 14.0571ZM7.23636 10.7048L11.3455 6.4L10.3273 5.29524L7.23636 8.53333L5.67273 6.93333L4.65455 8L7.23636 10.7048Z" fill="#07CBFD"/>
</svg>
    )
}

const  Filter = ({hide,transactions} : {hide : boolean,transactions : CombinedTransactions[]}) => {
    //we always filter the whole transaction...we don't filter the changed filtered transactions.
    const[filter,setFilter] = useState("");
    const setTransactionState = useSetRecoilState(transactionAtom)
    useEffect(() => {
        if(filter == "sent"){
            const filterArray = transactions.filter((tnx) => {
                if(isTypeOnRamp(tnx)){
                    return false;
                }else if(isTypeP2P(tnx)){
                    return tnx.send;
                }
            })
            setTransactionState(filterArray);
        }else if(filter == "received"){
            const filterArray = transactions.filter((tnx) => {
                if(isTypeOnRamp(tnx)){
                    return false;
                }else if(isTypeP2P(tnx)){
                    return !tnx.send;
                }
            })
            setTransactionState(filterArray);
        }else if (filter == "added" || filter == "sweeper"){
            const filterArray = transactions.filter((tnx) => {
                if(isTypeOnRamp(tnx)){
                    return true;
                }else if(isTypeP2P(tnx)){
                    return false
                }
            })
            setTransactionState(filterArray);
        }else if (filter == "successful"){
            const filterArray = transactions.filter((tnx) => {
                if(isTypeOnRamp(tnx)){
                    return tnx.status == "success"
                }else if(isTypeP2P(tnx)){
                    return true
                }
            })
            setTransactionState(filterArray);
        }else if (filter == "failed"){
            const filterArray = transactions.filter((tnx) => {
                if(isTypeOnRamp(tnx)){
                    return tnx.status == "faliure"
                }else if(isTypeP2P(tnx)){
                    return false
                }
            })
            setTransactionState(filterArray);
        }else if (filter == "processing"){
            const filterArray = transactions.filter((tnx) => {
                if(isTypeOnRamp(tnx)){
                    return tnx.status == "processing"
                }else if(isTypeP2P(tnx)){
                    return false
                }
            })
            setTransactionState(filterArray);
        }
        //TODO : time filter

    },[filter])
    return(
        <span className={` bg-white transition-all rounded-lg py-4 px-4 duration-300 ${hide?"w-0 scale-x-0 pointer-events-none":"scale-x-100 w-1/4"}`}>
            <div className="py-2 flex justify-between items-center border-b-2">
                <div className="text-xl font-medium"> Filter</div>
                <div className=" px-4 py-1 rounded-lg text-[#07CBFD]"> {FilterIcon()}</div>
            </div>
            <div className="flex flex-col py-2">
                <div >
                    <div className="text-lg hover:bg-slate-200 px-3 py-2">Time</div>
                    <div className="flex flex-row justify-start gap-3 px-4 py-1 hover:bg-slate-100">
                        <input type="radio" defaultValue="1" id="sent" name="radio" onChange={(e) => {setFilter(e.target.value)}}/>
                        <label>1 months</label>
                    </div>
                    <div className="flex flex-row justify-start gap-3 px-4 py-1 hover:bg-slate-100">
                        <input type="radio" defaultValue="3" id="sent" name="radio" onChange={(e) => {setFilter(e.target.value)}}/>
                        <label>3 months</label>
                    </div>
                    <div className="flex flex-row justify-start gap-3 px-4 py-1 hover:bg-slate-100">
                        <input type="radio" defaultValue="6" id="sent" name="radio" onChange={(e) => {setFilter(e.target.value)}}/>
                        <label>6 months</label>
                    </div>
                </div>
                <div>
                    <div className="text-lg hover:bg-slate-200 px-3 py-2">Categories</div>
                    {/*Make sure the linked radio buttons have the same value for their name HTML attribute. */}
                    <div>
                        
                        <div className="flex flex-row justify-start gap-3 px-4 py-1 hover:bg-slate-100">
                            <input type="radio" defaultValue="sent" id="sent" name="radio" onChange={(e) => {setFilter(e.target.value)}}/>
                            <label>Sent</label>
                        </div>
                        <div className="flex flex-row justify-start gap-3 px-4 py-1 hover:bg-slate-100">
                            <input type="radio" defaultValue="received" id="sent" name="radio" onChange={(e) => {setFilter(e.target.value)}}/>
                            <label>Received</label>
                        </div>
                        <div className="flex flex-row justify-start gap-3 px-4 py-1 hover:bg-slate-100">
                            <input type="radio" defaultValue="added" id="sent" name="radio" onChange={(e) => {setFilter(e.target.value)}}/>
                            <label>Added to wallet</label>
                        </div>
                        <div className="flex flex-row justify-start gap-3 px-4 py-1 hover:bg-slate-100">
                            <input type="radio" defaultValue="sweeper" id="sent" name="radio" onChange={(e) => {setFilter(e.target.value)}}/>
                            <label>Sweeped from wallet</label>
                        </div>
                    </div>
                </div>
                <div>
                    <div className="text-lg hover:bg-slate-200 px-3 py-2">Status</div>
                    <div className="flex flex-row justify-start gap-3 px-4 py-1 hover:bg-slate-100">
                        <input type="radio" defaultValue="successful" id="sent" name="radio" onChange={(e) => {setFilter(e.target.value)}}/>
                        <label>Successful</label>
                    </div>
                    <div className="flex flex-row justify-start gap-3 px-4 py-1 hover:bg-slate-100">
                        <input type="radio" defaultValue="failed" id="sent" name="radio" onChange={(e) => {setFilter(e.target.value)}}/>
                        <label>Failed</label>
                    </div>
                    <div className="flex flex-row justify-start gap-3 px-4 py-1 hover:bg-slate-100">
                        <input type="radio" defaultValue="processing" id="sent" name="radio" onChange={(e) => {setFilter(e.target.value)}}/>
                        <label>Processing</label>
                    </div>
                </div>
            </div>
        </span>
    )
}