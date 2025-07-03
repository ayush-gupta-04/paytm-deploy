'use server'
import { changeAddTpinSchema } from "../../lib/schema";
import  prisma  from "../../lib/db";
import bcrypt from "bcrypt"

//TODO : hashed tpin must be stored.
export async function changeAddTpin(data : {tpin : string,confirmTpin : string,otpToken : string}){
    console.log(data)
    const format = changeAddTpinSchema.safeParse({tpin : data.tpin,confirmTpin : data.confirmTpin});
    if(format.success){
        
        try {
            const userWithOtpDetails = await prisma.emailOtpVerification.findFirst({
                where : {
                    token : data.otpToken
                },
                include : {
                    user : true
                }
            })
            if(userWithOtpDetails && userWithOtpDetails.user.isEmailVerified && userWithOtpDetails.isVerified){
                try {
                    const hashedTpin = await bcrypt.hash(data.tpin,10);
                    const updated = await prisma.user.update({
                        where : {
                            id : userWithOtpDetails.userId
                        },
                        data : {
                            tpin : hashedTpin
                        }
                    })
                    if(updated){
                        return{
                            success : true,
                            message : "Changes saved successfully!"
                        }
                    }
                } catch (error) {
                    return{
                        success : false,
                        message : "Something went down!"
                    }
                }
            }else{
                return {
                    success : false,
                    message : "Invalid token error"
                }
            }
        } catch (error) {
            console.log(error)
            return {
                success : false,
                message : "Invalid token error"
            }
        }
    }else{
        return {
            success : false,
            message : "Invalid Input!"
        }
    }
}