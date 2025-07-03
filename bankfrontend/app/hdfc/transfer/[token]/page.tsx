'use client'
import { payNowViaHdfc } from "@/app/action/payNow";
import { zodResolver } from "@hookform/resolvers/zod";
import { SigninFormat, signinSchema } from "../../../lib/schema";
import Error from "../../../ui/errors";
import Success from "../../../ui/success";
import { useState } from "react";
import { useForm } from "react-hook-form";

type BackendResponse ={
    message : string,
    success : boolean | null
}
export default function HdfcTransactionPage({params} : {params : {token : string | null}}){ 
    const[loading,setLoading] = useState(false);
    const[response,setResponse] = useState<BackendResponse>({
        success : null,
        message : ""
    })
    const token = params.token || "";
    console.log(token)
    const {register,handleSubmit,formState : {errors}} = useForm<SigninFormat>({resolver : zodResolver(signinSchema)});
    async function payNow(data : SigninFormat){
        setLoading(true);
        const res = await payNowViaHdfc({...data,token : token}) as BackendResponse;
        setResponse(res);
        setLoading(false);
    }
    return (
        <div className="w-full h-screen flex flex-col bg-gray-200">
            <div className="h-48 w-full bg-white flex justify-center shadow-md">
                <header className="self-center text-4xl font-semibold">
                    Pay Through Hdfc NetBanking
                </header>
            </div>
            <div className="w-1/3 h-fit my-10 bg-white rounded-md shadow-md self-center flex flex-col items-center px-6 gap-6 py-6">
                <div className="h-12 text-2xl text-center w-full border-b border-slate-300">
                    Enter Hdfc credentials to Pay
                </div>
                <form onSubmit={handleSubmit(payNow)} className="flex flex-col gap-4 w-full">
                    <div className="w-full">
                        <input type="text" placeholder="Email" className="w-full p-3 rounded-md border-slate-400 border"
                        {...register("email")}/>
                        {errors.email && (
                            <div className="text-red-600">
                                {errors.email.message}
                            </div>
                        )}
                    </div>
                    <div className="w-full">
                        <input type="password" placeholder="Password" className="w-full p-3 rounded-md border-slate-400 border"
                        {...register("password")}/>
                        {errors.password && (
                            <div className="text-red-600">
                                {errors.password.message}
                            </div>
                        )}
                    </div>
                    <div className="mb-4">
                        <Success message={response.message} success = {response.success}></Success>
                        <Error message={response.message} success = {response.success}></Error>
                    </div>
                    <button className="w-full bg-gray-800 text-white rounded-md p-2.5 hover:bg-gray-700 text-lg">{loading?"Loading...":"Pay Now"}</button>
                </form>
            </div>
        </div>
    )
}