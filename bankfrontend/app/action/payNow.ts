'use server'

import prisma from "../lib/db"
import { signinSchema } from "../lib/schema"
import axios from "axios"
import bcrypt from "bcrypt"

type PaymentType = {
    email : string,
    password : string,
    token : string | null
}

export async function payNowViaHdfc(data : PaymentType){
    if(!data.token){
        return{
            success : false,
            message : "Invalid Token Error!"
        }
    }
    const success = signinSchema.safeParse({email : data.email,password : data.password});
    if(success){
        try {
            const currTime = Date.now() + "" + 0;
            const hdfctnx = await prisma.hdfcBankTnx.findFirst({
                where : {
                    token : data.token
                }
            })
            if(hdfctnx){
                //amount is number &  *100
                const {amount,webhookUrl,userId,token,tokenExpiry} = hdfctnx
                if(tokenExpiry < currTime){
                    return{
                        success : false,
                        message  : "Session Expired"
                    }
                }else{
                    //Deduct the amount of user(email,pass in hdfc bank account).
                    //hit the hdfc paytm webhook

                    //It should look in the BankAccount with the credentials not in the user Table..
                    //but for the sake of convinience we took the user table.
                    const validUser = await prisma.user.findFirst({
                        where : {
                            email : data.email
                        }
                    })
                    if(validUser){
                        try {
                            //WebHook part
                            const res = await axios.post(webhookUrl,{
                                amount : amount,
                                userId : userId,
                                token : token
                            })
                            if(res.data){
                                return {
                                    success: res.data.success,
                                    message : res.data.message
                                }
                            }
                        } catch (error) {
                            console.log(error);
                            //bank will refund in this case
                            //because webhook throws a bad status code of 400.
                            return{
                                success : false,
                                message : "Payment Failed!"
                            }
                        }
                    }  
                }
            }else{
                return{
                    success : false,
                    message : "Invalid Token Error!"
                }
            }
        } catch (error) {
            console.log(error)
            return{
                success : false,
                message : "HDFC server is down!"
            }
        }
    }else{
        return{
            success : true,
            message : "Invalid Inputs"
        }
    }
}