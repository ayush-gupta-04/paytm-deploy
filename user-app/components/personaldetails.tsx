'use client'
import React from 'react';
import styled from 'styled-components';
import { zodResolver } from "@hookform/resolvers/zod";
import { personalDetailsAtom } from "../lib/store";
import { EditDetailsFormat, EditDetailsSchema } from "../lib/schema";
import Success from "../ui/success";
import Error from "../ui/errors";
import { Dispatch, SetStateAction, useEffect, useState } from "react"
import { useForm } from "react-hook-form";
import { SetterOrUpdater, useRecoilState } from "recoil";

//the prisma enum and this enum conflicted so i imported one from prisma itself.
import {Gender} from "@prisma/client"
import { changePersonalDetails } from "../app/action/changedetails";
import Button1 from './button';

type PersonalDetailsType = {
    firstname : string | null,
    lastname : string | null,
    dob : string | null,
    gender : Gender | null
}


export default function PersonalDetails({serverDetails} : {serverDetails : PersonalDetailsType}){
    const[hide,setHide] = useState(true);
    const[details,setDetails] = useRecoilState(personalDetailsAtom);
    useEffect(() => {
        if(details == null){
            setDetails(serverDetails);
        }
    },[])
    return(
        <div className="col-span-3 bg-white shadow-lg rounded-lg mx-3 px-3 py-2">
            <div className="flex justify-between border-b-2">
                <header className="py-2 text-lg  font-medium">Personal details</header>
                <div className="h-fit text-[#07CBFD] my-2 mr-4 hover:cursor-pointer hover:text-black" onClick={() => {setHide(false)}}>
                    {EditIcon()}
                </div>
                <EditPersonalDetails hide = {hide} setHide = {setHide} details = {details} setDetails = {setDetails}></EditPersonalDetails>
            </div>
            <div className="flex flex-col py-4">
                <div className="flex flex-rows justify-between py-2 px-2">
                    <div className="text-[#8A8A8A] font-medium">firstname</div>
                    <div className="font-medium text-[#404040]">{details?.firstname?`${details?.firstname}`:"--"}</div>
                </div>
                <div className="flex flex-rows justify-between py-2 px-2">
                    <div className="text-[#8A8A8A] font-medium">lastname</div>
                    <div className="font-medium text-[#404040]">{details?.lastname?`${details?.lastname}`:"--"}</div>
                </div>
                <div className="flex flex-rows justify-between py-2 px-2">
                    <div className="text-[#8A8A8A] font-medium">date of birth</div>
                    <div className="font-medium text-[#404040]">{details?.dob?`${details?.dob}`:"--"}</div>
                </div>
                <div className="flex flex-rows justify-between py-2 px-2">
                    <div className="text-[#8A8A8A] font-medium">gender</div>
                    <div className="font-medium text-[#404040]">{details?.gender?`${details?.gender}`:"--"}</div>
                </div>
            </div>
        </div>
    )
}

function EditIcon(){
    return(
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="size-6">
  <path stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" />
</svg>

    )
}

type BackendResponse = {
    success : boolean | null,
    message : string,
}

function EditPersonalDetails({hide,setHide,details,setDetails} : {hide : boolean,setHide : Dispatch<SetStateAction<boolean>>,details : PersonalDetailsType | null,setDetails : SetterOrUpdater<PersonalDetailsType | null>}){
    const[response,setResponse] = useState<BackendResponse>({
        success : null,
        message : ""
    })
    const[loading,setLoading] = useState(false);
    const {register,handleSubmit,formState : {errors},reset} = useForm<EditDetailsFormat>({resolver : zodResolver(EditDetailsSchema),defaultValues : {firstname : details?.firstname || "",lastname : details?.lastname || "",dob : details?.dob || "",gender : details?.gender || undefined}});
    useEffect(() => {
        reset({
            firstname : details?.firstname || "",
            lastname : details?.lastname || "",
            dob : details?.dob || "",
            gender : details?.gender || undefined
        })
    },[details])
    async function onSumbit(data : EditDetailsFormat){
        setLoading(true);
        const res = await changePersonalDetails(data) as BackendResponse;
        setLoading(false);
        setResponse(res);
        if(res.success){
            setDetails(data);
        }
    }

    return(
        <>
        <BackgroundSupporter hide = {hide}></BackgroundSupporter>
                <div className={`bg-white shadow-slate-800 shadow-2xl z-20  w-1/3 fixed top-1/2 left-1/2 transition-all -translate-x-1/2 -translate-y-1/2 rounded-lg duration-300 ${hide?"scale-90 opacity-0 pointer-events-none":"scale-100 opacity-100"}`} onClick={(e) => {e.stopPropagation()}}>
                    <div className=" mx-4 py-4 border-b-2 text-lg">Change Personal details</div>
                    <form onSubmit={handleSubmit(onSumbit)} className="rounded-b-lg mx-4 pt-4 pb-4 flex flex-col gap-4">
                        <div className="relative mb-2">
                            <input placeholder="Firstname"
                            disabled = {loading}
                            {...register("firstname")}
                            className="peer focus:bg-white shadow-sm w-full hover:bg-slate-50 rounded-md  px-3 py-3   transition-all placeholder-shown:border  focus:border-2 focus:border-gray-900 focus:border-t-transparent focus:outline-0 disabled:border-0  placeholder:opacity-0 focus:placeholder:opacity-100" />
                            {errors.firstname && (
                                <div className="text-red-600">
                                    {errors.firstname.message}
                                </div>
                            )}
                            <label
                                className="before:content[' '] after:content[' '] pointer-events-none absolute left-0 -top-1.5 flex h-full w-full select-none !overflow-visible truncate text-[11px] font-normal leading-tight text-gray-500 transition-all before:pointer-events-none before:mt-[6.5px] before:mr-1 before:box-border before:block before:h-1.5 before:w-2.5 before:rounded-tl-md before:border-t before:border-l before:border-blue-gray-200 before:transition-all after:pointer-events-none after:mt-[6.5px] after:ml-1 after:box-border after:block after:h-1.5 after:w-2.5 after:flex-grow after:rounded-tr-md after:border-t after:border-r after:border-blue-gray-200 after:transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:leading-[3.75] peer-placeholder-shown:text-blue-gray-500 peer-placeholder-shown:before:border-transparent peer-placeholder-shown:after:border-transparent peer-focus:text-[11px] peer-focus:leading-tight peer-focus:text-gray-900 peer-focus:before:border-t-2 peer-focus:before:border-l-2 peer-focus:before:!border-gray-900 peer-focus:after:border-t-2 peer-focus:after:border-r-2 peer-focus:after:!border-gray-900 peer-disabled:text-transparent peer-disabled:before:border-transparent peer-disabled:after:border-transparent peer-disabled:peer-placeholder-shown:text-blue-gray-500">
                                Firstname
                            </label>
                        </div>
                        <div className="relative mb-2">
                            <input placeholder="Lastname"
                            disabled = {loading}
                            {...register("lastname")}
                            className="peer focus:bg-white shadow-sm w-full hover:bg-slate-50 rounded-md  px-3 py-3   transition-all placeholder-shown:border  focus:border-2 focus:border-gray-900 focus:border-t-transparent focus:outline-0 disabled:border-0  placeholder:opacity-0 focus:placeholder:opacity-100" />
                            {errors.lastname && (
                                <div className="text-red-600">
                                    {errors.lastname.message}
                                </div>
                            )}
                            <label
                                className="before:content[' '] after:content[' '] pointer-events-none absolute left-0 -top-1.5 flex h-full w-full select-none !overflow-visible truncate text-[11px] font-normal leading-tight text-gray-500 transition-all before:pointer-events-none before:mt-[6.5px] before:mr-1 before:box-border before:block before:h-1.5 before:w-2.5 before:rounded-tl-md before:border-t before:border-l before:border-blue-gray-200 before:transition-all after:pointer-events-none after:mt-[6.5px] after:ml-1 after:box-border after:block after:h-1.5 after:w-2.5 after:flex-grow after:rounded-tr-md after:border-t after:border-r after:border-blue-gray-200 after:transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:leading-[3.75] peer-placeholder-shown:text-blue-gray-500 peer-placeholder-shown:before:border-transparent peer-placeholder-shown:after:border-transparent peer-focus:text-[11px] peer-focus:leading-tight peer-focus:text-gray-900 peer-focus:before:border-t-2 peer-focus:before:border-l-2 peer-focus:before:!border-gray-900 peer-focus:after:border-t-2 peer-focus:after:border-r-2 peer-focus:after:!border-gray-900 peer-disabled:text-transparent peer-disabled:before:border-transparent peer-disabled:after:border-transparent peer-disabled:peer-placeholder-shown:text-blue-gray-500">
                                Lastname
                            </label>
                        </div>
                        <div className="relative mb-2">
                            <input placeholder="Dob"
                            disabled = {loading}
                            type="date"
                            {...register("dob")}
                            className="peer focus:bg-white shadow-sm w-full hover:bg-slate-50 rounded-md  px-3 py-3   transition-all placeholder-shown:border  focus:border-2 focus:border-gray-900 focus:border-t-transparent focus:outline-0 disabled:border-0  placeholder:opacity-0 focus:placeholder:opacity-100" />
                            {errors.dob && (
                                <div className="text-red-600">
                                    {errors.dob.message}
                                </div>
                            )}
                            <label
                                className="before:content[' '] after:content[' '] pointer-events-none absolute left-0 -top-1.5 flex h-full w-full select-none !overflow-visible truncate text-[11px] font-normal leading-tight text-gray-500 transition-all before:pointer-events-none before:mt-[6.5px] before:mr-1 before:box-border before:block before:h-1.5 before:w-2.5 before:rounded-tl-md before:border-t before:border-l before:border-blue-gray-200 before:transition-all after:pointer-events-none after:mt-[6.5px] after:ml-1 after:box-border after:block after:h-1.5 after:w-2.5 after:flex-grow after:rounded-tr-md after:border-t after:border-r after:border-blue-gray-200 after:transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:leading-[3.75] peer-placeholder-shown:text-blue-gray-500 peer-placeholder-shown:before:border-transparent peer-placeholder-shown:after:border-transparent peer-focus:text-[11px] peer-focus:leading-tight peer-focus:text-gray-900 peer-focus:before:border-t-2 peer-focus:before:border-l-2 peer-focus:before:!border-gray-900 peer-focus:after:border-t-2 peer-focus:after:border-r-2 peer-focus:after:!border-gray-900 peer-disabled:text-transparent peer-disabled:before:border-transparent peer-disabled:after:border-transparent peer-disabled:peer-placeholder-shown:text-blue-gray-500">
                                Dob
                            </label>
                        </div>
                        <StyledWrapper className='flex flex-col justify-center items-center h-10 '>
                                <div className="radio-input h-20 flex flex-row justify-center">
                                <input defaultValue="female"  id="value-1" type="radio" className="input i_female" {...register('gender')} />
                                <input defaultValue="other"  id="value-2" type="radio" className="input i_no-gender" {...register('gender')}/>
                                <input defaultValue="male"  id="value-3" type="radio" className="input i_male" {...register('gender')}/>
                                
                                <div className="card female">
                                    <svg className="logo" width={48} height={48} fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M12 15.75A7.125 7.125 0 1 0 12 1.5a7.125 7.125 0 0 0 0 14.25Z" />
                                    <path d="M12 15.75v6.75" />
                                    <path d="M14.719 19.5H9.28" />
                                    </svg>
                                    <div className="title">Female</div>
                                </div>
                                <div className="card no-gender">
                                    <svg className="logo" width={48} height={48} fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M10.125 15.75a6.375 6.375 0 1 0 0-12.75 6.375 6.375 0 0 0 0 12.75Z" />
                                    <path d="M10.125 16.5v6" />
                                    <path d="M12.75 19.5H7.5" />
                                    <path d="M20.25 5.25V1.5H16.5" />
                                    <path d="M15.717 6.034 20.25 1.5" />
                                    </svg>
                                    <div className="title">N/A</div>
                                </div>
                                <div className="card male">
                                    <svg className="logo" width={48} height={48} fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M10.125 21a7.125 7.125 0 1 0 0-14.25 7.125 7.125 0 0 0 0 14.25Z" />
                                    <path d="M21 7.5V3h-4.5" />
                                    <path d="M15.188 8.813 21 3" />
                                    </svg>
                                    <div className="title">Male</div>
                                </div>
                                </div>
                                
                        </StyledWrapper>
                        <div className='mt-2'>
                            <Success message={response.message} success = {response.success}></Success>
                            <Error message={response.message} success = {response.success}></Error>
                        </div>
                        {errors.gender && (
                                <div className="text-red-600 text-center">
                                    {errors.gender.message}
                                </div>
                                )}
                        <div className="flex flex-row gap-2">
                            <div className="bg-slate-300 hover:bg-slate-400 w-full py-3 rounded-lg active:scale-95 transition-all text-center" aria-disabled = {loading} onClick={(e) => {reset();setResponse({success : null,message : ""});setHide(true);e.stopPropagation()}}>Cancel</div>   {/*If i close the form , Values must reset to default..or just reset(). */}
                            <Button1 loading = {loading} text="Save Changes"></Button1>
                        </div>
                        
                    </form>
                </div>
        </>
    )
}

function BackgroundSupporter({hide} : {hide : boolean}){
    return(
        <div className={`w-screen z-10 fixed top-1/2 left-1/2 transition-all -translate-x-1/2 -translate-y-1/2 h-full duration-300 ${hide?"opacity-0 pointer-events-none":"opacity-100 backdrop-brightness-50"}`} onClick={(e) => {e.stopPropagation()}}>  
        </div>
    )
}  

  const StyledWrapper = styled.div`
    .radio-input {
      display: flex;
      flex-wrap: wrap;
      width: 380px;
      height: fit-content;
      gap: 16px;
      scale: 0.6;
    }
  
    .radio-input input {
      height: 100px;
      width: 100px;
      translate: 0px 55px;
      opacity: 0;
      z-index: 10;
    }
  
    .card {
      height: 100px;
      width: 100px;
      border: solid darkgray;
      background-color: lightgray;
      border-radius: 10px;
      translate: 0px -55px;
      position: relative;
      z-index: 9;
      transition: 0.2s;
      color: darkgray;
    }
  
    .logo {
      position: absolute;
      top: 10px;
      left: 50%;
      translate: -50% 0px;
    }
  
    .card .title {
      width: 100%;
      position: absolute;
      text-align: center;
      font-size: 23px;
      bottom: 0px;
      font-weight: bold;
    }
  
    .i_female:hover ~ .female {
      filter: brightness(1.1);
    }
  
    .i_male:hover ~ .male {
      filter: brightness(1.1);
    }
  
    .i_no-gender:hover ~ .no-gender {
      filter: brightness(1.1);
    }
  
    .i_female:checked ~ .female {
      border: solid #ff87bf;
      color: #ff87bf;
      background-color: #ffb8d9;
    }
  
    .i_male:checked ~ .male {
      border: solid #3d44ff;
      color: #3d44ff;
      background-color: #85a5ff;
    }
  
    .i_no-gender:checked ~ .no-gender {
      border: solid #c9c600;
      color: #c9c600;
      background-color: #fffd82;
    }`;
  