'use client'

import { zodResolver } from "@hookform/resolvers/zod";
import { Dispatch, SetStateAction, useState } from "react"
import { useForm } from "react-hook-form";
import { useRecoilState } from "recoil";
import BackIcon from "./backIcon";
import Error from "../ui/errors";
import Button1 from "./button";
import AcknowledgementPopup from "./ack";
import {  useRecoilValue, } from "recoil";
import { socketAtom, transferToPhoneAtom } from "../lib/store";
import { p2pTransferToPhone} from "../app/action/p2pTransferToPhoneUpi";
import Loader from "./loader";
import { amountFormat, amountSchema, tpinFormat, tpinSchema } from "../lib/schema";
import VerifyPhonePopup from "./verifyPhonePopup";

//verify --> amount --> tpin --> acknowledgement
export default function PayToPhone(){
    const[step,setStep] = useState<string | null>(null);
    function handleNextStep(){
        if(step == 'verify'){
            setStep('amount')
        }else if(step == 'amount'){
            setStep("tpin")
        }else if(step == 'tpin'){
            setStep('acknowledgement')
        }else if(step == 'acknowledgement'){
            setStep(null)
        }
    }
    function handlePreviousStep(){
        if(step == 'verify'){
            setStep(null)
        }else if(step == 'amount'){
            setStep("verify")
        }else if(step == 'tpin'){
            setStep("amount")
        }else if(step == 'acknowledgement'){
            setStep("tpin")
        }
    }
    return(
        <>
        <div className="size-60 hover:scale-105 cursor-pointer transition-all" onClick={() => {setStep('verify')}}>
            <img src="./payToPhone.png" alt="" />
        </div>
        <BackgroundSupporter hide = {step == null}></BackgroundSupporter>
        {step == "verify" && <VerifyPhonePopup onBack={handlePreviousStep} onSuccess={handleNextStep} step = {step} setStep = {setStep}></VerifyPhonePopup>}
        {step == "amount" && <EnterAmountPopup onBack={handlePreviousStep} onSuccess={handleNextStep} step = {step} setStep = {setStep}></EnterAmountPopup>}
            {step == "tpin" && <EnterTPINpopup onBack={handlePreviousStep} onSuccess={handleNextStep} step = {step} setStep = {setStep}></EnterTPINpopup>}
            {step == 'acknowledgement' && <AcknowledgementPopup onSuccess ={handleNextStep}></AcknowledgementPopup>}
        </>
    )
}

type BackendResponse = {
    success : boolean| null,
    message : string,
}


function EnterAmountPopup({onSuccess,onBack,setStep} : {onSuccess : () => void,onBack : () => void,setStep : Dispatch<SetStateAction<string | null>>,step : string | null}){
    const[response,setResponse] = useState<BackendResponse>({
        success : null,
        message : "",
    })
    const [loading,setLoading] = useState(false);
    const[transferToPhone,setTransferToPhone] = useRecoilState(transferToPhoneAtom);
    const {register,handleSubmit,formState : {errors}} = useForm<amountFormat>({resolver : zodResolver(amountSchema)});
    async function onFormSubmit(data : amountFormat){
        setLoading(true);
        setTransferToPhone({phone : transferToPhone?.phone || "", amount : data.amount});
        setTimeout(() =>{
            onSuccess();
            setLoading(false);
        },1000)
        
    }
    return(
        <div className="fixed z-20 top-1/2 left-1/2 transition-all -translate-x-1/2 -translate-y-1/2 w-1/3 bg-white shadow-black shadow-xl py-3 px-4 rounded-lg" onClick={(e) => {e.stopPropagation()}}>
            <div className="border-b-2 py-2 px-2 text-lg font-medium flex justify-between">
                <div>Enter Amount</div>
                <div onClick={(e) => {onBack();e.stopPropagation()}} className="hover:text-blue-700 cursor-pointer">
                    <BackIcon></BackIcon>
                </div>
            </div>
            <form  onSubmit = {handleSubmit(onFormSubmit)} className="rounded-b-lg pt-4 flex flex-col gap-4">
                <div className="relative">
                    <input placeholder="Amount"
                    {...register("amount")}
                    disabled = {loading}
                    type="number"
                    className="peer focus:bg-white shadow-sm w-full hover:bg-slate-50 rounded-md  px-3 py-3   transition-all placeholder-shown:border  focus:border-2 focus:border-gray-900 focus:border-t-transparent focus:outline-0 disabled:border-0  placeholder:opacity-0 focus:placeholder:opacity-100" />
                    {errors.amount && (
                        <div className="text-red-600">
                            {errors.amount.message}
                        </div>
                    )}
                    <label
                        className="before:content[' '] after:content[' '] pointer-events-none absolute left-0 -top-1.5 flex h-full w-full select-none !overflow-visible truncate text-[11px] font-normal leading-tight text-gray-500 transition-all before:pointer-events-none before:mt-[6.5px] before:mr-1 before:box-border before:block before:h-1.5 before:w-2.5 before:rounded-tl-md before:border-t before:border-l before:border-blue-gray-200 before:transition-all after:pointer-events-none after:mt-[6.5px] after:ml-1 after:box-border after:block after:h-1.5 after:w-2.5 after:flex-grow after:rounded-tr-md after:border-t after:border-r after:border-blue-gray-200 after:transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:leading-[3.75] peer-placeholder-shown:text-blue-gray-500 peer-placeholder-shown:before:border-transparent peer-placeholder-shown:after:border-transparent peer-focus:text-[11px] peer-focus:leading-tight peer-focus:text-gray-900 peer-focus:before:border-t-2 peer-focus:before:border-l-2 peer-focus:before:!border-gray-900 peer-focus:after:border-t-2 peer-focus:after:border-r-2 peer-focus:after:!border-gray-900 peer-disabled:text-transparent peer-disabled:before:border-transparent peer-disabled:after:border-transparent peer-disabled:peer-placeholder-shown:text-blue-gray-500">
                        Enter Amount
                    </label>
                </div>
                <div className="flex flex-row gap-2">
                    <div className="bg-slate-300 hover:bg-slate-400 w-full py-3 rounded-lg active:scale-95 transition-all text-center" aria-disabled = {loading} onClick={(e) => {setResponse({success : null,message : ""});setStep(null);setTransferToPhone(null);e.stopPropagation()}}>Cancel</div>
                    <Button1 loading = {loading} text = {"Proceed to Payment"}></Button1>
                </div>
            </form>
        </div>
    )
}


function BackgroundSupporter({hide} : {hide : boolean}){
    return(
        <div className={`w-screen fixed z-10 top-1/2 left-1/2 transition-all -translate-x-1/2 -translate-y-1/2 h-full duration-300 ${hide?"opacity-0 pointer-events-none":"opacity-100 backdrop-brightness-50"}`} onClick={(e) => {e.stopPropagation()}}>  
        </div>
    )
} 
type BackendResponseWithData = {
    success : boolean| null,
    message : string,
    data : {
        receiverId : string,
        message : {
            from : string,
            amount : string,
            phone : string | null,
            upi : string | null,
        }
    } | null
}


function EnterTPINpopup({onSuccess,onBack,setStep} : {onSuccess : () => void,onBack : () => void,setStep : Dispatch<SetStateAction<string | null>>,step : string | null}){
    const[response,setResponse] = useState<BackendResponseWithData>({
        success : null,
        message : "",
        data : null
    })
    const[loading,setLoading] = useState(false)
    const socket = useRecoilValue(socketAtom);
    const[transferToPhone,setTransferToPhone] = useRecoilState(transferToPhoneAtom);
    const {register,handleSubmit} = useForm<tpinFormat>({resolver : zodResolver(tpinSchema)});
    async function onFormSubmit(data : tpinFormat){
        setResponse({success : null,message : "",data : null})
        setLoading(true);
        const res = await p2pTransferToPhone({phone : transferToPhone?.phone || "" , amount : transferToPhone?.amount || "" , tpin : data.tpin1 + data.tpin2 + data.tpin3 + data.tpin4 + data.tpin5 + data.tpin6}) as BackendResponseWithData;
        setResponse(res);
        setLoading(false);
        if(res.success){
            socket?.send(JSON.stringify(res.data));
            onSuccess()
        }
    }
    return(
        <div className="fixed z-20 top-1/2 left-1/2 transition-all -translate-x-1/2 -translate-y-1/2 w-1/3 bg-white shadow-black shadow-xl py-3 px-4 rounded-lg" onClick={(e) => {e.stopPropagation()}}>
            <div className="border-b-2 py-2 px-2 text-xl font-medium flex justify-between">
                <div>Enter TPIN</div>
                <div onClick={(e) => {onBack();e.stopPropagation()}} className="hover:text-blue-700 cursor-pointer">
                    <BackIcon></BackIcon>
                </div>
            </div>
            <form  onSubmit={handleSubmit(onFormSubmit)}  className="rounded-b-lg pt-4 flex flex-col gap-4">
                <div className="flex flex-row justify-center gap-4">
                    <input type="text" className="h-12 w-12 border border-black rounded-lg text-xl text-center focus:outline-blue-600 transition-all focus:scale-105" {...register("tpin1")}  maxLength={1}/>
                    <input type="text" className="h-12 w-12 border border-black rounded-lg text-xl text-center focus:outline-blue-600 transition-all focus:scale-105" {...register("tpin2")} maxLength={1}/>
                    <input type="text" className="h-12 w-12 border border-black rounded-lg text-xl text-center focus:outline-blue-600 transition-all focus:scale-105" {...register("tpin3")} maxLength={1}/>
                    <input type="text" className="h-12 w-12 border border-black rounded-lg text-xl text-center focus:outline-blue-600 transition-all focus:scale-105" {...register("tpin4")} maxLength={1}/>
                    <input type="text" className="h-12 w-12 border border-black rounded-lg text-xl text-center focus:outline-blue-600 transition-all focus:scale-105" {...register("tpin5")} maxLength={1}/>
                    <input type="text" className="h-12 w-12 border border-black rounded-lg text-xl text-center focus:outline-blue-600 transition-all focus:scale-105" {...register("tpin6")} maxLength={1} />
                </div>
                <div>
                    {loading && <div className="py-2 transition-all scale-75"><Loader></Loader></div>}
                    <Error message={response.message} success = {response.success}></Error>
                </div>
                <div className="flex flex-row gap-2">
                    <div className="bg-slate-300 hover:bg-slate-400 w-full py-3 rounded-lg active:scale-95 transition-all text-center" aria-disabled = {loading} onClick={(e) => {setResponse({success : null,message : "",data : null});setStep(null);setTransferToPhone(null);e.stopPropagation()}}>Cancel</div>
                    <Button1 loading = {loading} text = {"Pay now"}></Button1>
                </div>
            </form>
        </div>
    )
}