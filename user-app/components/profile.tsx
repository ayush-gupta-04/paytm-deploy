'use client'
import { phoneAtom } from "../lib/store"
import { useEffect } from "react";
import { useRecoilState } from "recoil"

export default function ProfileCard({email,serverPhone} : {email : string | null,serverPhone : string | null}){
    const[phone,setPhone] = useRecoilState(phoneAtom);
    useEffect(() => {
        if(phone == null){
            setPhone(serverPhone);
        }
    },[])
    return(
        <div className="col-span-2  mr-3 grid grid-rows-3 bg-white shadow-lg rounded-lg">
            <div className="row-span-2 flex flex-row justify-between"> 
                <div></div>
                <ProfilePicture></ProfilePicture>
                <div className="h-fit text-[#07CBFD] my-2 mr-4 hover:cursor-pointer hover:text-black">
                    {EditIcon()}
                </div>
            </div>
            <div className="bg-[#a3a3a34f] w-full flex flex-col px-4 justify-evenly rounded-b-lg">
                <div className=" flex justify-between">
                    <div className="text-[#757575] font-medium">Email</div>
                    <div className="font-medium">{email?`${email}`:"--"}</div>
                </div>
                <div className=" flex justify-between">
                    <div className="text-[#757575] font-medium">Phone</div>
                    <div className="font-medium">{phone?`+91 ${phone}`:"--"}</div>
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


function ProfilePicture(){
    return(
        <div className="size-36 bg-gray-300 rounded-full self-center flex justify-center items-center">
            <div className="size-24">
            {ProfileIcon()}
            </div>
        </div>
    )
}

function ProfileIcon(){
    return(
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" >
  <path d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
</svg>

    )
}