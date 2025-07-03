'use client'

import { zodResolver } from "@hookform/resolvers/zod";
import { addMoneyFormat, addMoneySchema } from "../lib/schema";
import { useForm } from "react-hook-form";
import { startOnRampTnx } from "../app/action/startOnRampTnx";
import { useState } from "react";
import Success from "../ui/success";
import Error from "../ui/errors";
import { SUPPORTED_BANKS } from "@/lib/banks";



type BackendResponse = {
    success : boolean | null,
    message : string,
    tnxToken : string | null,
    bankUrl : string,
}

export function AddMoney(){
    const options = SUPPORTED_BANKS.map(x => ({
        key: x.name,
        value: x.name
    }))
    const[response,setResponse] = useState<BackendResponse>({
        success : null,
        message : "",
        tnxToken : null,
        bankUrl : ""
    });
    const[loading,setLoading] = useState(false)
    const {register,handleSubmit,formState : { errors }} = useForm<addMoneyFormat>({resolver : zodResolver(addMoneySchema)});
    async function addMoney(data : addMoneyFormat){
        const bankData = SUPPORTED_BANKS.find((bank) => {
            if(bank.name == data.bankName){
                return{
                    bankUrl : bank.bankUrl,
                    tokenUrl : bank.tokenUrl
                }
            }
        })
        if(bankData){
            setLoading(true)
            const res = await startOnRampTnx({amount : data.amount,tokenUrl : bankData.tokenUrl,bankName : bankData.name,bankUrl : bankData.bankUrl}) as BackendResponse;
            setLoading(false);
            setResponse(res)
        }
    }
    if(response.success){
        window.open(`${response.bankUrl}/${response.tnxToken}`,"_blank")
        //set response we needed here...because
        //in first request success become true. and it was redircted correctly.
        //in next request when the control was struck on getting response...
        //    it re-renders and saw success true form initial request ... hence redirected to a wrong page.
        setResponse({
            success : null,
            message : "",
            tnxToken : null,
            bankUrl : ""
        })
    }
    return(
        <div className="flex flex-col gap-3">
        <span className="bg-[#005EFF] px-3 py-2 w-fit rounded-lg text-white">Add Money to wallet</span>
        <div className="grid grid-cols-2 gap-2">
            <div className="py-4 px-4 bg-white shadow-md rounded-lg h-fit">
                <header className="text-2xl font-semibold text-gray-800 self-center pb-3 border-b-2 mb-3">
                    Add Money
                </header>
                <div className="w-full h-full">
                        <form className="flex flex-col gap-6" onSubmit={handleSubmit(addMoney)}>
                        <div className="flex flex-col gap-1">
                            <div className="font-semibold">
                                Amount
                            </div>
                            <input {...register("amount")} type="number" className="px-3 py-3 border border-slate-400 rounded-md" placeholder="Amount"/>
                            {errors.amount && (
                                    <div className="text-red-600">
                                        {errors.amount.message}
                                    </div>
                            )} 
                        </div>
                        <div className="flex flex-col gap-1">
                            <div className="font-semibold">
                                Bank
                            </div>
                            <select {...register("bankName")}  className="hover:bg-slate-50 border border-slate-400 text-gray-900 text-sm rounded-lg block w-full p-4 font-semibold">
                                {options.map((option) => <option key={option.key} value={option.key} className="font-semibold">{option.value}</option>)}
                            </select>
                            {errors.bankName && (
                                    <div className="text-red-600">
                                        {errors.bankName.message}
                                    </div>
                            )} 
                        </div>
                        <Success success = {response.success} message={response.message}></Success>
                        <Error success = {response.success} message={response.message}></Error>
                        <button className={`rounded-md text-white w-full bg-gray-800 hover:bg-gray-600 active:bg-gray-900 py-3 self-end`}>
                            {loading?"Loading...":"Add Money"}
                        </button>
                    </form>
                </div>
            </div>
            <div className="rounded-md mx-12">
                <img src="paytm1.svg" alt="" className="rounded-r-md size-full" /> 
            </div>
        </div>
        </div>
    )
}

function hello(){
    return(
        <></>
        
    )
}