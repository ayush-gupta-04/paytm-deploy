'use server'
import  prisma  from "../../lib/db";
import { emailSchema } from "../../lib/schema";
import { sendMail } from "../../lib/gmail";
import { getServerSession } from "next-auth";
import { NEXT_AUTH } from "../../lib/auth";


export async function ShootMailForPassChange(data : {email : string}){
    const success = emailSchema.safeParse(data);
    if(success){
        try {
            const user = await prisma.user.findFirst({
                where : {
                    email : data.email
                }
            })
            if(user){
                if(user.isEmailVerified){
                    var randomOtp = '';
                    for(var i = 0 ; i < 6 ; i++){
                        randomOtp += Math.floor(Math.random()*10);
                    }
                    const expTime = Date.now() + 5*60*1000 + '';
                    const otpToken = crypto.randomUUID();
                    await prisma.emailOtpVerification.create({
                        data : {
                            userId : user.id,
                            otp : randomOtp,
                            token : otpToken,
                            otpExpiry : expTime
                        }
                    })
                    //send email
                    const result = await sendMail({email : user.email,otp : randomOtp})
                    if(result.accepted){
                        return{
                            success : true,
                            message : "OTP send to email",
                            otpToken : otpToken
                        }
                    }else{
                        return{
                            success : false,
                            message : "Something went wrong!",
                        }
                    }
                }else{
                    return{
                        success : false,
                        message : "Email not verified!",
                    }
                }
            }else{
                return{
                    success : false,
                    message : "Email doesn't exist!"
                }
            }
        } catch (error) {
            return{
                success : false,
                message : "Something went wrong!"
            }
        }
    }
    else{
        return{
            success : false,
            message : "Invalid email!"
        }
    }
}








export async function ShootMailForPassChangeWhenLoggedIn(data : {email : string}){
    const success = emailSchema.safeParse(data);
    const session = await getServerSession(NEXT_AUTH);
    if(!session){
        return{
            success : false,
            message : "Invalid token error!"
        }
    }
    if(session.user.email != data.email){
        return{
            success : false,
            message : "Wrong email!"
        }
    }
    if(success.success){
        try {
            const user = await prisma.user.findFirst({
                where : {
                    email : data.email
                }
            })
            if(user){
                if(user.isEmailVerified){
                    var randomOtp = '';
                    for(var i = 0 ; i < 6 ; i++){
                        randomOtp += Math.floor(Math.random()*10);
                    }
                    const expTime = Date.now() + 5*60*1000 + '';
                    const otpToken = crypto.randomUUID();
                    await prisma.emailOtpVerification.create({
                        data : {
                            userId : user.id,
                            otp : randomOtp,
                            token : otpToken,
                            otpExpiry : expTime
                        }
                    })
                    //send email
                    const result = await sendMail({email : user.email,otp : randomOtp})
                    console.log(result)
                    if(result.accepted){
                        return{
                            success : true,
                            message : "OTP send to email",
                            otpToken : otpToken
                        }
                    }else{
                        return{
                            success : false,
                            message : "Something went wrong!",
                        }
                    }
                }else{
                    return{
                        success : false,
                        message : "Email not verified!",
                    }
                }
            }else{
                return{
                    success : false,
                    message : "Email doesn't exist!"
                }
            }
        } catch (error) {
            console.log(error)
            return{
                success : false,
                message : "Something went wrong!"
            }
        }
    }
    else{
        return{
            success : false,
            message : "Invalid email!"
        }
    }
}