'use client'
import { zodResolver } from "@hookform/resolvers/zod";
import { ReportProblemFormat, ReportProblemSchema } from "../lib/schema";
import Success from "../ui/success";
import Error from "../ui/errors";
import React , { Dispatch, SetStateAction, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import ReportProblemAction from "../app/action/report";
import Button1 from "./button";

export default function ContactUs(){
    const[hide,setHide] = useState(true);
    return(
        <div className=" px-4 py-5 flex flex-col border-b-2 hover:bg-gray-100  hover:cursor-pointer " onClick={() => {setHide(false)}}>
            <div className="text-xl">Contact us</div>
            <ContactUsCard hide = {hide} setHide = {setHide}></ContactUsCard>
        </div>
    )
}

type BackendResponse = {
    success : boolean | null,
    message : string,
}

function ContactUsCard({hide,setHide} : {hide : boolean,setHide: Dispatch<SetStateAction<boolean>>}){
    const[response,setResponse] = useState<BackendResponse>({
        success : null,
        message : ""
    })
    const[loading,setLoading] = useState(false);
    const {register,handleSubmit,formState : {errors},reset} = useForm<ReportProblemFormat>({resolver : zodResolver(ReportProblemSchema)});
    async function onSumbit(data : ReportProblemFormat){
        setLoading(true);
        const res = await ReportProblemAction(data) as BackendResponse;
        setLoading(false);
        setResponse(res);
        if(res.success){
            reset();
        }
    }
    const divRef1 = useRef<HTMLDivElement>(null);
    const divRef2 = useRef<HTMLDivElement>(null);
    function copyToClipboard1(){
        if(divRef1.current){
            const text = divRef1.current.innerText;
            navigator.clipboard.writeText(text).then(() => {
                alert("Text Copied")
            },(err) => {
                console.log("Cannot copy")
            });
        }
        
    }
    function copyToClipboard2(){
        if(divRef2.current){
            const text = divRef2.current.innerText;
            navigator.clipboard.writeText(text).then(() => {
                alert("text copied")
            },(err) => {
                console.log("Cannot copy")
            });
        }
        
    }

    //TODO : bg div m onClick hatao .. ek cancel button do menu me.
    return(
        <>
        <BackgroundSupporter hide = {hide}></BackgroundSupporter>
        <div className={`bg-white shadow-slate-800 shadow-2xl py-4 px-4 w-1/3 fixed z-20 top-1/2 left-1/2 transition-all -translate-x-1/2 -translate-y-1/2 rounded-lg duration-300 ${hide?"scale-90 opacity-0 pointer-events-none":"scale-100 opacity-100"}`} onClick={(e) => {e.stopPropagation()}}> {/* stopPropagation of the click to this div itself ... i don't want to spread it above this div */}
                    <div className="pb-2 border-b-2 text-lg">Contact Us</div>
                    <div className="py-4 flex flex-col gap-3 border-b-2">
                        <div className="flex flex-row justify-between">
                            <div className="text-[#757575] font-medium">Email</div>
                            <div className="flex flex-row gap-2">
                                <div className="font-medium" ref ={divRef1}>ag04062004@gmail.com</div>
                                <div onClick={() => {copyToClipboard1()}}><CopyIcon></CopyIcon></div>
                            </div>
                        </div>
                        <div className="flex flex-row justify-between">
                            <div className="text-[#757575] font-medium">Phone</div>
                            <div className="flex flex-row gap-2">
                                <div className="font-medium" ref ={divRef2}>+91 7970566566</div>
                                <div onClick={() => {copyToClipboard2()}}><CopyIcon></CopyIcon></div>
                            </div>
                        </div>
                    </div>
                    <div className="py-4 flex flex-row gap-8 justify-center items-center border-b-2">
                        <TwitterIcon></TwitterIcon>
                        <LinkedIn></LinkedIn>
                        <InstagramIcon></InstagramIcon>
                    </div>
                    <div className="py-4 text-red-600">Report a Problem</div>
                    <form onSubmit={handleSubmit(onSumbit)} className="flex flex-col gap-4">
                        <div className="relative ">
                            <input placeholder="Transaction ID"
                            disabled = {loading}
                            {...register("tnxId")}
                            className="peer focus:bg-white shadow-sm w-full hover:bg-slate-50 rounded-md  px-3 py-3   transition-all placeholder-shown:border  focus:border-2 focus:border-gray-900 focus:border-t-transparent focus:outline-0 disabled:border-0  placeholder:opacity-0 focus:placeholder:opacity-100" />
                            {errors.tnxId && (
                                <div className="text-red-600">
                                    {errors.tnxId.message}
                                </div>
                            )}
                            <label
                                className="before:content[' '] after:content[' '] pointer-events-none absolute left-0 -top-1.5 flex h-full w-full select-none !overflow-visible truncate text-[11px] font-normal leading-tight text-gray-500 transition-all before:pointer-events-none before:mt-[6.5px] before:mr-1 before:box-border before:block before:h-1.5 before:w-2.5 before:rounded-tl-md before:border-t before:border-l before:border-blue-gray-200 before:transition-all after:pointer-events-none after:mt-[6.5px] after:ml-1 after:box-border after:block after:h-1.5 after:w-2.5 after:flex-grow after:rounded-tr-md after:border-t after:border-r after:border-blue-gray-200 after:transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:leading-[3.75] peer-placeholder-shown:text-blue-gray-500 peer-placeholder-shown:before:border-transparent peer-placeholder-shown:after:border-transparent peer-focus:text-[11px] peer-focus:leading-tight peer-focus:text-gray-900 peer-focus:before:border-t-2 peer-focus:before:border-l-2 peer-focus:before:!border-gray-900 peer-focus:after:border-t-2 peer-focus:after:border-r-2 peer-focus:after:!border-gray-900 peer-disabled:text-transparent peer-disabled:before:border-transparent peer-disabled:after:border-transparent peer-disabled:peer-placeholder-shown:text-blue-gray-500">
                                Transaction ID
                            </label>
                        </div>
                        <div className="relative">
                            <input placeholder="Subject"
                            disabled = {loading}
                            {...register("subject")}
                            className="peer focus:bg-white shadow-sm w-full hover:bg-slate-50 rounded-md  px-3 py-3   transition-all placeholder-shown:border  focus:border-2 focus:border-gray-900 focus:border-t-transparent focus:outline-0 disabled:border-0  placeholder:opacity-0 focus:placeholder:opacity-100" />
                            {errors.subject && (
                                <div className="text-red-600">
                                    {errors.subject.message}
                                </div>
                            )}
                            <label
                                className="before:content[' '] after:content[' '] pointer-events-none absolute left-0 -top-1.5 flex h-full w-full select-none !overflow-visible truncate text-[11px] font-normal leading-tight text-gray-500 transition-all before:pointer-events-none before:mt-[6.5px] before:mr-1 before:box-border before:block before:h-1.5 before:w-2.5 before:rounded-tl-md before:border-t before:border-l before:border-blue-gray-200 before:transition-all after:pointer-events-none after:mt-[6.5px] after:ml-1 after:box-border after:block after:h-1.5 after:w-2.5 after:flex-grow after:rounded-tr-md after:border-t after:border-r after:border-blue-gray-200 after:transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:leading-[3.75] peer-placeholder-shown:text-blue-gray-500 peer-placeholder-shown:before:border-transparent peer-placeholder-shown:after:border-transparent peer-focus:text-[11px] peer-focus:leading-tight peer-focus:text-gray-900 peer-focus:before:border-t-2 peer-focus:before:border-l-2 peer-focus:before:!border-gray-900 peer-focus:after:border-t-2 peer-focus:after:border-r-2 peer-focus:after:!border-gray-900 peer-disabled:text-transparent peer-disabled:before:border-transparent peer-disabled:after:border-transparent peer-disabled:peer-placeholder-shown:text-blue-gray-500">
                                Subject
                            </label>
                        </div>
                        <div className="relative">
                            <input placeholder="Body"
                            disabled = {loading}
                            {...register("body")}
                            className="peer focus:bg-white shadow-sm w-full hover:bg-slate-50 rounded-md  px-3 py-3   transition-all placeholder-shown:border  focus:border-2 focus:border-gray-900 focus:border-t-transparent focus:outline-0 disabled:border-0  placeholder:opacity-0 focus:placeholder:opacity-100" />
                            {errors.body && (
                                <div className="text-red-600">
                                    {errors.body.message}
                                </div>
                            )}
                            <label
                                className="before:content[' '] after:content[' '] pointer-events-none absolute left-0 -top-1.5 flex h-full w-full select-none !overflow-visible truncate text-[11px] font-normal leading-tight text-gray-500 transition-all before:pointer-events-none before:mt-[6.5px] before:mr-1 before:box-border before:block before:h-1.5 before:w-2.5 before:rounded-tl-md before:border-t before:border-l before:border-blue-gray-200 before:transition-all after:pointer-events-none after:mt-[6.5px] after:ml-1 after:box-border after:block after:h-1.5 after:w-2.5 after:flex-grow after:rounded-tr-md after:border-t after:border-r after:border-blue-gray-200 after:transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:leading-[3.75] peer-placeholder-shown:text-blue-gray-500 peer-placeholder-shown:before:border-transparent peer-placeholder-shown:after:border-transparent peer-focus:text-[11px] peer-focus:leading-tight peer-focus:text-gray-900 peer-focus:before:border-t-2 peer-focus:before:border-l-2 peer-focus:before:!border-gray-900 peer-focus:after:border-t-2 peer-focus:after:border-r-2 peer-focus:after:!border-gray-900 peer-disabled:text-transparent peer-disabled:before:border-transparent peer-disabled:after:border-transparent peer-disabled:peer-placeholder-shown:text-blue-gray-500">
                                Body
                            </label>
                        </div>
                        <div>
                            <Success message={response.message} success = {response.success}></Success>
                            <Error message={response.message} success = {response.success}></Error>
                        </div>
                        <div className="flex flex-row gap-2">
                            <div className="bg-slate-300 hover:bg-slate-400 w-full py-3 rounded-lg active:scale-95 transition-all text-center" aria-disabled = {loading} onClick={(e) => {reset();setResponse({success : null,message : ""});setHide(true);e.stopPropagation()}}>Cancel</div> {/*If i close the form , Values must reset to default..or just reset(). */}
                            <Button1 loading = {loading} text="Report"></Button1>
                        </div>
                    </form>
                </div>
            
        </>
    )
}

function TwitterIcon(){
    return(
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"  className="bi bi-twitter-x fill-gray-600 hover:fill-gray-800 hover:cursor-pointer" viewBox="0 0 16 16">
  <path d="M12.6.75h2.454l-5.36 6.142L16 15.25h-4.937l-3.867-5.07-4.425 5.07H.316l5.733-6.57L0 .75h5.063l3.495 4.633L12.601.75Zm-.86 13.028h1.36L4.323 2.145H2.865z"/>
</svg>
    )
}

function LinkedIn(){
    return(
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" className="bi bi-linkedin fill-gray-600 hover:fill-gray hover:cursor-pointer" viewBox="0 0 16 16">
  <path d="M0 1.146C0 .513.526 0 1.175 0h13.65C15.474 0 16 .513 16 1.146v13.708c0 .633-.526 1.146-1.175 1.146H1.175C.526 16 0 15.487 0 14.854zm4.943 12.248V6.169H2.542v7.225zm-1.2-8.212c.837 0 1.358-.554 1.358-1.248-.015-.709-.52-1.248-1.342-1.248S2.4 3.226 2.4 3.934c0 .694.521 1.248 1.327 1.248zm4.908 8.212V9.359c0-.216.016-.432.08-.586.173-.431.568-.878 1.232-.878.869 0 1.216.662 1.216 1.634v3.865h2.401V9.25c0-2.22-1.184-3.252-2.764-3.252-1.274 0-1.845.7-2.165 1.193v.025h-.016l.016-.025V6.169h-2.4c.03.678 0 7.225 0 7.225z"/>
</svg>
    )
}
function InstagramIcon(){
    return(
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" className="bi bi-instagram fill-gray-600 hover:fill-gray-800 hover:cursor-pointer" viewBox="0 0 16 16">
  <path d="M8 0C5.829 0 5.556.01 4.703.048 3.85.088 3.269.222 2.76.42a3.9 3.9 0 0 0-1.417.923A3.9 3.9 0 0 0 .42 2.76C.222 3.268.087 3.85.048 4.7.01 5.555 0 5.827 0 8.001c0 2.172.01 2.444.048 3.297.04.852.174 1.433.372 1.942.205.526.478.972.923 1.417.444.445.89.719 1.416.923.51.198 1.09.333 1.942.372C5.555 15.99 5.827 16 8 16s2.444-.01 3.298-.048c.851-.04 1.434-.174 1.943-.372a3.9 3.9 0 0 0 1.416-.923c.445-.445.718-.891.923-1.417.197-.509.332-1.09.372-1.942C15.99 10.445 16 10.173 16 8s-.01-2.445-.048-3.299c-.04-.851-.175-1.433-.372-1.941a3.9 3.9 0 0 0-.923-1.417A3.9 3.9 0 0 0 13.24.42c-.51-.198-1.092-.333-1.943-.372C10.443.01 10.172 0 7.998 0zm-.717 1.442h.718c2.136 0 2.389.007 3.232.046.78.035 1.204.166 1.486.275.373.145.64.319.92.599s.453.546.598.92c.11.281.24.705.275 1.485.039.843.047 1.096.047 3.231s-.008 2.389-.047 3.232c-.035.78-.166 1.203-.275 1.485a2.5 2.5 0 0 1-.599.919c-.28.28-.546.453-.92.598-.28.11-.704.24-1.485.276-.843.038-1.096.047-3.232.047s-2.39-.009-3.233-.047c-.78-.036-1.203-.166-1.485-.276a2.5 2.5 0 0 1-.92-.598 2.5 2.5 0 0 1-.6-.92c-.109-.281-.24-.705-.275-1.485-.038-.843-.046-1.096-.046-3.233s.008-2.388.046-3.231c.036-.78.166-1.204.276-1.486.145-.373.319-.64.599-.92s.546-.453.92-.598c.282-.11.705-.24 1.485-.276.738-.034 1.024-.044 2.515-.045zm4.988 1.328a.96.96 0 1 0 0 1.92.96.96 0 0 0 0-1.92m-4.27 1.122a4.109 4.109 0 1 0 0 8.217 4.109 4.109 0 0 0 0-8.217m0 1.441a2.667 2.667 0 1 1 0 5.334 2.667 2.667 0 0 1 0-5.334"/>
</svg>
    )
}
function CopyIcon(){
    return(
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="size-6 hover:stroke-blue-600 hover:cursor-pointer">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15.666 3.888A2.25 2.25 0 0 0 13.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 0 1-.75.75H9a.75.75 0 0 1-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 0 1-2.25 2.25H6.75A2.25 2.25 0 0 1 4.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 0 1 1.927-.184" />
        </svg>
    )
}

function BackgroundSupporter({hide} : {hide : boolean}){
    return(
        <div className={`w-screen z-10 fixed top-1/2 left-1/2 transition-all -translate-x-1/2 -translate-y-1/2 h-full duration-300 ${hide?"opacity-0 pointer-events-none":"opacity-100 backdrop-brightness-50"}`}>  
        </div>
    )
}

