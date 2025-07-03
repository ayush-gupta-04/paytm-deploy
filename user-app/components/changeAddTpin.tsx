'use client'
import { useEffect, useState } from "react"
import {useSetRecoilState } from "recoil";
import { changePasswordPopupAtom } from "../lib/store";
import SendEmailPopup from "./sendMailPopup";
import VerifyOtpPopup from "./verifyOtpPopup";

import ChangeAddTpinPopup from "./changeAddTpinPopup";


//TODO : email can only be send if email == session wala email.
export default function SetTpin(){
    const[step,setStep] = useState<string | null>(null);
    const setChangePasswordPopup = useSetRecoilState(changePasswordPopupAtom)
    function handleNextStep(){
        if(step == 'email'){
            setStep('otp')
        }else if(step == 'otp'){
            setStep('tpin')
        }else if(step == 'tpin'){
            setStep(null)
        }
    }
    function handlePreviousStep(){
        if(step == 'email'){
            setStep(null)
        }else if(step == 'otp'){
            setStep('email')
        }else if(step == 'tpin'){
            setStep('otp')
        }
    }
    useEffect(() => {
        if(step == null){
            setChangePasswordPopup(null)
        }
    },[step])
    return(
        <div>
            <div className="bg-white px-4 py-2 flex flex-col rounded-t-lg border-b-2 hover:bg-gray-100 hover:cursor-pointer" onClick={() => {setStep('email')}}>
                <div className="text-xl ">Change/Add TPIN</div>
                <div className="text-[#8A8A8A]">change old tpin with a new one</div>
            </div>
            <BackgroundSupporter hide = {step == null}></BackgroundSupporter>
            {step == "email" && <SendEmailPopup onSuccess = {handleNextStep} onBack = {handlePreviousStep} step = {step} setStep={setStep}></SendEmailPopup>}
            {step == 'otp' && <VerifyOtpPopup onSuccess = {handleNextStep} onBack = {handlePreviousStep} step = {step} setStep={setStep}></VerifyOtpPopup>}
            {step == 'tpin' && <ChangeAddTpinPopup onSuccess = {handleNextStep} onBack = {handlePreviousStep} step = {step} setStep={setStep}></ChangeAddTpinPopup>}
        </div>
        
    )
}






function BackgroundSupporter({hide} : {hide : boolean}){
    return(
        <div className={`w-screen z-10 fixed top-1/2 left-1/2 transition-all -translate-x-1/2 -translate-y-1/2 h-full duration-300 ${hide?"opacity-0 pointer-events-none":"opacity-100 backdrop-brightness-50"}`} onClick={(e) => {e.stopPropagation()}}>  
        </div>
    )
} 