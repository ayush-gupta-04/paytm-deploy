'use client'

import { zodResolver } from "@hookform/resolvers/zod";
import { changePasswordPopupAtom } from "../lib/store";
import {newOtpFormat, newOtpSchema } from "../lib/schema";
import { Dispatch, SetStateAction, useState } from "react";
import { useForm } from "react-hook-form";
import { useRecoilState } from "recoil";
import BackIcon from "./backIcon";
import Success from "../ui/success";
import Error from "../ui/errors";
import Button1 from "./button";
import { verifyingPassOtpForChangePass } from "../app/action/verify";
import Loader from "./loader";

type BackendResponse = {
    success : boolean| null,
    message : string
}

export default function VerifyOtpPopup({onSuccess,onBack,setStep} : {onSuccess : () => void,onBack : () => void,step : string | null,setStep : Dispatch<SetStateAction<string | null>>}){
    const[response,setResponse] = useState<BackendResponse>({
        success : null,
        message : "",
    })
    const[loading,setLoading] = useState(false)
    const [changePasswordPopup,setChangePasswordPopup] = useRecoilState(changePasswordPopupAtom);
    const {register,handleSubmit} = useForm<newOtpFormat>({resolver : zodResolver(newOtpSchema)});
    async function onFormSubmit(data : newOtpFormat){
        setLoading(true);
        const res = await verifyingPassOtpForChangePass({otp : data.otp1 + data.otp2 + data.otp3 + data.otp4 + data.otp5 + data.otp6,otpToken : changePasswordPopup?.token || ""}) as BackendResponse;
        setResponse(res);
        setLoading(false);
        if(res.success){
            setTimeout(() => {
                onSuccess()
            }, 1500);
        }
    }
    
    return(
        <div className="fixed z-20 top-1/2 left-1/2 transition-all -translate-x-1/2 -translate-y-1/2 w-1/3 bg-white shadow-black shadow-xl py-3 px-4 rounded-lg" onClick={(e) => {e.stopPropagation()}}>
            <div className="border-b-2 py-2 px-2 text-xl font-medium flex justify-between">
                <div>Enter OTP</div>
                <div onClick={(e) => {onBack();e.stopPropagation()}} className="hover:text-blue-700 cursor-pointer">
                    <BackIcon></BackIcon>
                </div>
            </div>
            <form  onSubmit={handleSubmit(onFormSubmit)}  className="rounded-b-lg pt-4 flex flex-col gap-4">
                <div className="flex flex-row justify-center gap-4">
                    <input type="text" className="h-12 w-12 border border-black rounded-lg text-xl text-center focus:outline-blue-600 transition-all focus:scale-105" {...register("otp1")}  maxLength={1} minLength={0}/>
                    <input type="text" className="h-12 w-12 border border-black rounded-lg text-xl text-center focus:outline-blue-600 transition-all focus:scale-105" {...register("otp2")} maxLength={1}/>
                    <input type="text" className="h-12 w-12 border border-black rounded-lg text-xl text-center focus:outline-blue-600 transition-all focus:scale-105" {...register("otp3")} maxLength={1}/>
                    <input type="text" className="h-12 w-12 border border-black rounded-lg text-xl text-center focus:outline-blue-600 transition-all focus:scale-105" {...register("otp4")} maxLength={1}/>
                    <input type="text" className="h-12 w-12 border border-black rounded-lg text-xl text-center focus:outline-blue-600 transition-all focus:scale-105" {...register("otp5")} maxLength={1}/>
                    <input type="text" className="h-12 w-12 border border-black rounded-lg text-xl text-center focus:outline-blue-600 transition-all focus:scale-105" {...register("otp6")} maxLength={1} />
                </div>
                <div>
                {loading && <div className="py-2 transition-all scale-75"><Loader></Loader></div>}
                    <Success message={response.message} success = {response.success}></Success>
                    <Error message={response.message} success = {response.success}></Error>
                </div>
                <div className="flex flex-row gap-2">
                    <div className="bg-slate-300 hover:bg-slate-400 w-full py-3 rounded-lg active:scale-95 transition-all text-center" aria-disabled = {loading} onClick={(e) => {setResponse({success : null,message : ""});setStep(null);setChangePasswordPopup(null);e.stopPropagation()}}>Cancel</div>
                    <Button1 loading = {loading} text = {"Verify OTP"}></Button1>
                </div>
            </form>
        </div>
    )
}