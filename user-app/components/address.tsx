'use client'
import { zodResolver } from "@hookform/resolvers/zod"
import { addressAtom } from "../lib/store"
import { EditAddressFormat, EditAddressSchema } from "../lib/schema"
import Success from "../ui/success";
import Error from "../ui/errors";
import { Dispatch, SetStateAction, useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { SetterOrUpdater, useRecoilValue, useSetRecoilState } from "recoil"
import changeAddress from "../app/action/changeaddress"
import Button1 from "./button"

type AddressType = {
    city : string | null,
    country : string | null,
    address : string | null,
    pincode : string | null
}


//the values coming are server rendered values.
//i will first set the state with it to have a consistency.
//Iss card m jo information show hoga vo atom wala address show hoga.
export default function Address({address} : {address : AddressType}){
    const setAddress = useSetRecoilState(addressAtom);
    const Address = useRecoilValue(addressAtom);
    const[hide,setHide] = useState(true);
    useEffect(() => {
        //details are null if i do a hard reload or first time visit .. then only i want it to be updated with the Server rendered value.
        //otherwise the server rendered value is stale for some time so i don't want to update the state with the stale value...will cause inconsistency.
        if(Address == null){
            setAddress(address);
        }
    },[])
    return(
        <div className="col-span-3 bg-white shadow-lg rounded-lg mx-3 px-3 py-2">
            <div className="flex justify-between border-b-2">
                <header className="py-2 text-lg  font-medium">Personal Address</header>
                <div className="h-fit text-[#07CBFD] my-2 mr-4 hover:cursor-pointer hover:text-black" onClick={() => {setHide(!hide)}}>
                    {EditIcon()}
                </div>
                {<EditAddress hide = {hide} address = {Address} setHide = {setHide} setAddress={setAddress}></EditAddress>}     {/*conditional rendering would optimise but would cause a lot of effort to add transition in it. */}
            </div>
            <div className="flex flex-col py-4">
                <div className="flex flex-rows justify-between py-2 px-2">
                    <div className="text-[#8A8A8A] font-medium">Address</div>
                    <div className="font-medium text-[#404040]">{Address?.address?`${Address.address}`:"--"}</div>
                </div>
                <div className="flex flex-rows justify-between py-2 px-2">
                    <div className="text-[#8A8A8A] font-medium">City</div>
                    <div className="font-medium text-[#404040]">{Address?.city?`${Address.city}`:"--"}</div>
                </div>
                <div className="flex flex-rows justify-between py-2 px-2">
                    <div className="text-[#8A8A8A] font-medium">Country</div>
                    <div className="font-medium text-[#404040]">{Address?.country?`${Address.country}`:"--"}</div>
                </div>
                <div className="flex flex-rows justify-between py-2 px-2">
                    <div className="text-[#8A8A8A] font-medium">Pincode</div>
                    <div className="font-medium text-[#404040]">{Address?.pincode?`${Address.pincode}`:"--"}</div>
                </div>
            </div>
        </div>
    )
}


type BackendResponse = {
    success : boolean | null,
    message : string,
}


//value of atom will come for default value of the form.
function EditAddress({hide,address,setHide,setAddress} : {hide : boolean , address : {address : string | null,city : string | null,country : string | null,pincode : string | null} | null,setHide : Dispatch<SetStateAction<boolean>>,setAddress : SetterOrUpdater<AddressType | null>}){
    const[response,setResponse] = useState<BackendResponse>({
        success : null,
        message : ""
    })
    const[loading,setLoading] = useState(false);
    const {register,handleSubmit,formState : {errors},reset} = useForm<EditAddressFormat>({resolver : zodResolver(EditAddressSchema),defaultValues : {address : address?.address || "",city : address?.city || "",country : address?.country || "",pincode : address?.pincode || ""}});  //default value will be given to the address at first...i have used atoms for default values here
    
    //The useForm hook sets the default value only on first render when the page loads or when we hard reload.
    //So at first the address was null...null was being set....it was a problem.
    //So whenever address changes we are reseting the value of the form with new value of address.
    useEffect(() => {
        reset({ 
            address: address?.address || "",
            city: address?.city || "", 
            country: address?.country || "", 
            pincode: address?.pincode || "" 
        }); 
    }, [address]);
    async function onSumbit(data : EditAddressFormat){
        setLoading(true);
        const res = await changeAddress(data) as BackendResponse;
        setLoading(false);
        setResponse(res);
        if(res.success){
            setAddress(data);
        }
    }
    return(
        <>
        <BackgroundSupporter hide = {hide}></BackgroundSupporter> 
                <div className={`bg-white shadow-slate-800 shadow-2xl   w-1/3 fixed z-20 top-1/2 left-1/2 transition-all -translate-x-1/2 -translate-y-1/2 rounded-lg duration-300 ${hide?"scale-90 opacity-0 pointer-events-none":"scale-100 opacity-100"} `} onClick={(e) => {e.stopPropagation()}}> {/* stopPropagation of the click to this div itself ... i don't want to spread it above this div */}
                    <div className=" mx-4 py-4 border-b-2 text-lg">Change Address</div>
                    <form onSubmit={handleSubmit(onSumbit)} className="rounded-b-lg mx-4 pt-4 pb-4 flex flex-col gap-4">
                        <div className="relative mb-2">
                            <input placeholder="Address"
                            disabled = {loading}
                            {...register("address")}
                            className="peer focus:bg-white shadow-sm w-full hover:bg-slate-50 rounded-md  px-3 py-3   transition-all placeholder-shown:border  focus:border-2 focus:border-gray-900 focus:border-t-transparent focus:outline-0 disabled:border-0  placeholder:opacity-0 focus:placeholder:opacity-100" />
                            {errors.address && (
                                <div className="text-red-600">
                                    {errors.address.message}
                                </div>
                            )}
                            <label
                                className="before:content[' '] after:content[' '] pointer-events-none absolute left-0 -top-1.5 flex h-full w-full select-none !overflow-visible truncate text-[11px] font-normal leading-tight text-gray-500 transition-all before:pointer-events-none before:mt-[6.5px] before:mr-1 before:box-border before:block before:h-1.5 before:w-2.5 before:rounded-tl-md before:border-t before:border-l before:border-blue-gray-200 before:transition-all after:pointer-events-none after:mt-[6.5px] after:ml-1 after:box-border after:block after:h-1.5 after:w-2.5 after:flex-grow after:rounded-tr-md after:border-t after:border-r after:border-blue-gray-200 after:transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:leading-[3.75] peer-placeholder-shown:text-blue-gray-500 peer-placeholder-shown:before:border-transparent peer-placeholder-shown:after:border-transparent peer-focus:text-[11px] peer-focus:leading-tight peer-focus:text-gray-900 peer-focus:before:border-t-2 peer-focus:before:border-l-2 peer-focus:before:!border-gray-900 peer-focus:after:border-t-2 peer-focus:after:border-r-2 peer-focus:after:!border-gray-900 peer-disabled:text-transparent peer-disabled:before:border-transparent peer-disabled:after:border-transparent peer-disabled:peer-placeholder-shown:text-blue-gray-500">
                                Address
                            </label>
                        </div>
                        <div className="relative mb-2">
                            <input placeholder="City"
                            disabled = {loading}
                            {...register("city")}
                            className="peer focus:bg-white shadow-sm w-full hover:bg-slate-50 rounded-md  px-3 py-3   transition-all placeholder-shown:border  focus:border-2 focus:border-gray-900 focus:border-t-transparent focus:outline-0 disabled:border-0  placeholder:opacity-0 focus:placeholder:opacity-100" />
                            {errors.city && (
                                <div className="text-red-600">
                                    {errors.city.message}
                                </div>
                            )}
                            <label
                                className="before:content[' '] after:content[' '] pointer-events-none absolute left-0 -top-1.5 flex h-full w-full select-none !overflow-visible truncate text-[11px] font-normal leading-tight text-gray-500 transition-all before:pointer-events-none before:mt-[6.5px] before:mr-1 before:box-border before:block before:h-1.5 before:w-2.5 before:rounded-tl-md before:border-t before:border-l before:border-blue-gray-200 before:transition-all after:pointer-events-none after:mt-[6.5px] after:ml-1 after:box-border after:block after:h-1.5 after:w-2.5 after:flex-grow after:rounded-tr-md after:border-t after:border-r after:border-blue-gray-200 after:transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:leading-[3.75] peer-placeholder-shown:text-blue-gray-500 peer-placeholder-shown:before:border-transparent peer-placeholder-shown:after:border-transparent peer-focus:text-[11px] peer-focus:leading-tight peer-focus:text-gray-900 peer-focus:before:border-t-2 peer-focus:before:border-l-2 peer-focus:before:!border-gray-900 peer-focus:after:border-t-2 peer-focus:after:border-r-2 peer-focus:after:!border-gray-900 peer-disabled:text-transparent peer-disabled:before:border-transparent peer-disabled:after:border-transparent peer-disabled:peer-placeholder-shown:text-blue-gray-500">
                                City
                            </label>
                        </div>
                        <div className="relative mb-2">
                            <input placeholder="Country"
                            disabled = {loading}
                            {...register("country")}
                            className="peer focus:bg-white shadow-sm w-full hover:bg-slate-50 rounded-md  px-3 py-3   transition-all placeholder-shown:border  focus:border-2 focus:border-gray-900 focus:border-t-transparent focus:outline-0 disabled:border-0  placeholder:opacity-0 focus:placeholder:opacity-100" />
                            {errors.country && (
                                <div className="text-red-600">
                                    {errors.country.message}
                                </div>
                            )}
                            <label
                                className="before:content[' '] after:content[' '] pointer-events-none absolute left-0 -top-1.5 flex h-full w-full select-none !overflow-visible truncate text-[11px] font-normal leading-tight text-gray-500 transition-all before:pointer-events-none before:mt-[6.5px] before:mr-1 before:box-border before:block before:h-1.5 before:w-2.5 before:rounded-tl-md before:border-t before:border-l before:border-blue-gray-200 before:transition-all after:pointer-events-none after:mt-[6.5px] after:ml-1 after:box-border after:block after:h-1.5 after:w-2.5 after:flex-grow after:rounded-tr-md after:border-t after:border-r after:border-blue-gray-200 after:transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:leading-[3.75] peer-placeholder-shown:text-blue-gray-500 peer-placeholder-shown:before:border-transparent peer-placeholder-shown:after:border-transparent peer-focus:text-[11px] peer-focus:leading-tight peer-focus:text-gray-900 peer-focus:before:border-t-2 peer-focus:before:border-l-2 peer-focus:before:!border-gray-900 peer-focus:after:border-t-2 peer-focus:after:border-r-2 peer-focus:after:!border-gray-900 peer-disabled:text-transparent peer-disabled:before:border-transparent peer-disabled:after:border-transparent peer-disabled:peer-placeholder-shown:text-blue-gray-500">
                                Country
                            </label>
                        </div>
                        <div className="relative">
                            <input placeholder="Pincode"
                            disabled = {loading}
                            type="number"
                            {...register("pincode")}
                            className="peer focus:bg-white shadow-sm w-full hover:bg-slate-50 rounded-md  px-3 py-3   transition-all placeholder-shown:border  focus:border-2 focus:border-gray-900 focus:border-t-transparent focus:outline-0 disabled:border-0  placeholder:opacity-0 focus:placeholder:opacity-100" />
                            {errors.pincode && (
                                <div className="text-red-600">
                                    {errors.pincode.message}
                                </div>
                            )}
                            <label
                                className="before:content[' '] after:content[' '] pointer-events-none absolute left-0 -top-1.5 flex h-full w-full select-none !overflow-visible truncate text-[11px] font-normal leading-tight text-gray-500 transition-all before:pointer-events-none before:mt-[6.5px] before:mr-1 before:box-border before:block before:h-1.5 before:w-2.5 before:rounded-tl-md before:border-t before:border-l before:border-blue-gray-200 before:transition-all after:pointer-events-none after:mt-[6.5px] after:ml-1 after:box-border after:block after:h-1.5 after:w-2.5 after:flex-grow after:rounded-tr-md after:border-t after:border-r after:border-blue-gray-200 after:transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:leading-[3.75] peer-placeholder-shown:text-blue-gray-500 peer-placeholder-shown:before:border-transparent peer-placeholder-shown:after:border-transparent peer-focus:text-[11px] peer-focus:leading-tight peer-focus:text-gray-900 peer-focus:before:border-t-2 peer-focus:before:border-l-2 peer-focus:before:!border-gray-900 peer-focus:after:border-t-2 peer-focus:after:border-r-2 peer-focus:after:!border-gray-900 peer-disabled:text-transparent peer-disabled:before:border-transparent peer-disabled:after:border-transparent peer-disabled:peer-placeholder-shown:text-blue-gray-500">
                                Pincode
                            </label>
                        </div>
                        <div>
                            <Success message={response.message} success = {response.success}></Success>
                            <Error message={response.message} success = {response.success}></Error>
                        </div>
                        <div className="flex flex-row gap-2">
                            <div className="bg-slate-300 hover:bg-slate-400 w-full py-3 rounded-lg active:scale-95 transition-all text-center" aria-disabled = {loading} onClick={(e) => {reset();setResponse({success : null,message : ""});setHide(true);e.stopPropagation()}}>Cancel</div>   {/*If i close the form , Values must reset to default..or just reset(). */}
                            <Button1 loading = {loading} text="Save Changes"></Button1>
                        </div>
                    </form>
                </div>
        </>
    )
}


function EditIcon(){
    return(
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="size-6">
  <path stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" />
</svg>
    )
}


function BackgroundSupporter({hide} : {hide : boolean}){
    return(
        <div className={`w-screen z-10 fixed top-1/2 left-1/2 transition-all -translate-x-1/2 -translate-y-1/2 h-full duration-300 ${hide?"opacity-0 pointer-events-none":"opacity-100 backdrop-brightness-50"}`} onClick={(e) => {e.stopPropagation()}}>  
        </div>
    )
}