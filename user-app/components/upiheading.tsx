'use client'
import { upiAtom } from "../lib/store"
import { useEffect, useRef } from "react";
import { useRecoilState } from "recoil"

export default function UpiHeading({initialUpi} : {initialUpi : {upi : string | null}}){
    // alert("hello")
    const[upi,setUpi] = useRecoilState(upiAtom);
    useEffect(() => {
        //This effect was running in first render...and if the render is old one then setUpi was being called with the old values.
        //thats y i was getting a stale value until it loaded again on server.
        if(upi == null){
            setUpi(initialUpi.upi);
            
        }

    },[])
    const divRef = useRef<HTMLDivElement>(null);
    function copyToClipboard1(){
        if(divRef.current){
            const text = divRef.current.innerText;
            navigator.clipboard.writeText(text).then(() => {
                alert("Copied to Clipboard")
            },() => {
                console.log("Cannot copy")
            });
        }
        
    }
    return(
        <div className="w-full py-1 shadow-sm bg-white rounded-md flex flex-row justify-between">
            <div className="self-center px-3 font-semibold">{upi?"Your UPI ID":"Add a new UPI ID now"}</div>
            <div className="self-center px-3 flex flex-row gap-4">
            <div className="text-green-600 font-semibold" ref={divRef}>{upi}</div>
            <div onClick={() => {copyToClipboard1()}}><CopyIcon></CopyIcon></div>
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
