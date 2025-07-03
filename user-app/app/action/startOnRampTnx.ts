'use server'
import { addMoneySchema } from "../../lib/schema";
import  prisma  from "../../lib/db";
import { getServerSession } from "next-auth";
import { NEXT_AUTH } from "../../lib/auth";
import axios from "axios";

type PaymentInfo = {
    amount : string,
    bankName : string,
    tokenUrl : string,
    bankUrl : string
}

export async function startOnRampTnx(data : PaymentInfo){
    console.log(data)
    const amount = Number(data.amount)*100;
    const session = await getServerSession(NEXT_AUTH);
    const success = addMoneySchema.safeParse({amount : data.amount,bankName  : data.bankName});
    console.log(session)
    if(session){
        if(success){
            try {
                const bankToken = await axios.post(process.env.BANK_BACKEND_URL+'/api/hdfc/gettoken',{
                    amount : amount,
                    webhookUrl : process.env.PAYTM_WEBHOOK_URL+"/api/paytm/webhook",
                    userId : session.user.id
                })
                if(bankToken.data.token){
                    try {
                        const onRamp = await prisma.onRampTransaction.create({
                            data : {
                                status : "processing",
                                token : bankToken.data.token,
                                provider : data.bankName,
                                amount : amount,
                                startTime : new Date(),
                                userId : session.user.id
                            }
                        })
                        return{
                            success : true,
                            message : "Redirecting to payment page",
                            tnxToken : onRamp.token,
                            bankUrl : data.bankUrl
                        }
                    } catch (error) {
                        console.log(error)
                        return{
                            success : false,
                            message : "Something went Down!"
                        }
                    }
                }else{
                    return{
                        success : false,
                        message : "Something wrong with the Bank server"
                    }
                }
            } catch (error) {
                return{
                    success : false,
                    message : "Something wrong with the Bank server"
                }
            }
        }else{
            return{
                success : false,
                message : "Invalid Inputs!"
            }
        }
    }else{
        return{
            success : false,
            message : "Unauthorised user"
        }
    }
}   

