'use client'

import { notificationAtom } from "../lib/store"
import { useRecoilState } from "recoil"

export default function NotificationPopup(){
    const [notification,setNotification] = useRecoilState(notificationAtom)
    if(notification){
        setTimeout(() => {
            setNotification(null)
        },7000)
    }
    return(
        <>
        {<div className={`fixed bottom-5 right-5 w-1/5 fit bg-white shadow-slate-900 shadow-2xl rounded-lg transition-all duration-300 z-20 ${!notification?'translate-y-96':''}`}>
            <div className="flex flex-col px-4 py-2 gap-2 bg-lime-100 rounded-t-lg">
                <div className="self-center text-2xl font-semibold">{`Received ${notification?.amount} INR`}</div>
                <div>
                    <div>From : {notification?.from}</div>
                    <div>{notification?.upi?`UPI ID : ${notification?.upi}`:`Phone : ${notification?.phone}`}</div>
                </div>
            </div>
            <div className="bg-blue-700 h-10 rounded-b-lg">

            </div>
        </div>}
        </>
    )
}