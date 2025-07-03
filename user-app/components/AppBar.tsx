'use client'
import { notificationAtom, socketAtom } from "../lib/store";
import AppBar from "../ui/AppBar"
import { signIn, signOut, useSession } from "next-auth/react"
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useRecoilState, useSetRecoilState } from "recoil";

export default function AppBarClient({userIdObj} : {userIdObj : {userId : any}}){
    const router = useRouter();
    const session = useSession();
    const[socket,setSocket] = useRecoilState(socketAtom);
    const setNotification = useSetRecoilState(notificationAtom);
    useEffect(() => {
        if(userIdObj.userId){
            const socket = new WebSocket(process.env.NEXT_PUBLIC_WEBHOOK_URL+`?id=${userIdObj.userId}`);
            socket.onopen = () => {
                setSocket(socket)
            }
            socket.onmessage = (msg) => {
                setNotification(JSON.parse(msg.data).message);
            }
            return () =>{
                console.log("closing webSocket")
                socket.close()
            }
        }
        
    },[])
    return(
        <div>
            <AppBar 
            onSignin={() => {
                signIn()
            }} 
            onSignout={async () => {
                //we will be redirected to this callback after signout.
                //default callback is from where we invked the signout function.
                await signOut({callbackUrl : "/"})
            }} 
            userData = {session.data?.user}
            settings = {() => {router.push('/settings')}}
            ></AppBar>
        </div>
    )
}