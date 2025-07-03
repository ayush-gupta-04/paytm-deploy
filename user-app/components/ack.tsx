'use client'
import BackIcon from "./backIcon";

export default function AcknowledgementPopup({onSuccess} : {onSuccess : () => void}){
    return(
        <div className="fixed z-20 flex flex-col gap-4 pb-8 pt-4 justify-center items-center top-1/2 left-1/2 transition-all -translate-x-1/2 -translate-y-1/2 w-1/3 bg-white shadow-black shadow-xl px-4 rounded-lg" onClick={(e) => {e.stopPropagation()}}>
            <div className="flex w-full justify-between">
                <div onClick={(e) => {onSuccess();e.stopPropagation()}} className="cursor-pointer"><BackIcon></BackIcon></div>
                <div className="text-blue-600 self-end cursor-pointer hover:text-black">View details</div>
            </div>
            <div className="size-28"><BigTick></BigTick></div>
            <div className="text-lg ">Successfull Payment!</div>
        </div>
    )
}


function BigTick(){
    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" fill="#007002"><path d="M480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q65 0 123 19t107 53l-58 59q-38-24-81-37.5T480-800q-133 0-226.5 93.5T160-480q0 133 93.5 226.5T480-160q133 0 226.5-93.5T800-480q0-18-2-36t-6-35l65-65q11 32 17 66t6 70q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm-56-216L254-466l56-56 114 114 400-401 56 56-456 457Z"/></svg>
    )
}