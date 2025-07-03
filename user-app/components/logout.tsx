'use client'
import { signOut } from "next-auth/react";
import { Dispatch, SetStateAction, useState } from "react"

export default function Logout(){
    const [hide,setHide] = useState(true);
    return(
        <div className="bg-white px-4 py-5 flex flex-col rounded-b-lg hover:bg-gray-100 hover:cursor-pointer" onClick={() => {setHide(false)}}>
            <div className="text-xl flex flex-row justify-between">
                <div  className="text-red-600 ">Logout</div>
                <div className="text-red-600">{LogoutIcon()}</div>
            </div>
            <BackgroundSupporter hide = {hide}></BackgroundSupporter>
            {!hide && <LogoutPopup setHide={setHide}></LogoutPopup>}
        </div>
    )
}


function LogoutIcon(){
    return (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="size-6">
  <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 9V5.25A2.25 2.25 0 0 1 10.5 3h6a2.25 2.25 0 0 1 2.25 2.25v13.5A2.25 2.25 0 0 1 16.5 21h-6a2.25 2.25 0 0 1-2.25-2.25V15m-3 0-3-3m0 0 3-3m-3 3H15" />
</svg>

    )
}


function LogoutPopup({setHide} : {setHide : Dispatch<SetStateAction<boolean>>}){
    return (
        <div className="fixed rounded-lg w-1/3 flex flex-col z-20 top-1/2 left-1/2 transition-all -translate-x-1/2 -translate-y-1/2 bg-white px-4 py-4 shadow-xl" onClick={(e) => {e.stopPropagation()}}>
            <div className="w-full text-2xl py-8 text-center">Logout?</div>
            <div className="flex flex-row gap-2">
                <button className="bg-slate-300 hover:bg-slate-400 w-full py-3 rounded-lg active:scale-95 transition-all text-center" onClick={() => {setHide(true)}}>Cancel</button>
                <button className="bg-red-500 hover:bg-red-600 w-full py-3 rounded-lg active:scale-95 transition-all text-center" onClick={async () => { await signOut({callbackUrl : "/"})}}>Confirm Logout</button>
            </div>
        </div>
    )
}

function BackgroundSupporter({hide} : {hide : boolean}){
    return(
        <div className={`w-screen z-10 fixed top-1/2 left-1/2 transition-all -translate-x-1/2 -translate-y-1/2 h-full duration-300 ${hide?"opacity-0 pointer-events-none":"opacity-100 backdrop-brightness-50"}`} onClick={(e) => {e.stopPropagation()}}>  
        </div>
    )
} 