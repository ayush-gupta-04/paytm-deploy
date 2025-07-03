'use server'
import  prisma  from "@paytm-repo/db/client";
import { sendMail } from "../../lib/gmail";

export async function resendOTPForEmailVerification({otpToken} : {otpToken : string}){
    try {
        const userDataWithOtpField = await prisma.emailOtpVerification.findFirst({
            where : {
                token : otpToken
            },
            include : {
                user : {
                    select : {
                        email : true,
                        isEmailVerified : true
                    }
                }
            }
        })
        if(userDataWithOtpField && userDataWithOtpField.user.isEmailVerified){
            return{
                success : false,
                message : "Email already verified"
            }
        }
        if(userDataWithOtpField && !userDataWithOtpField.user.isEmailVerified){
            try {
                var randomOtp = '';
                for(var i = 0 ; i < 6 ; i++){
                    randomOtp += Math.floor(Math.random()*10);
                }
                const expTime = Date.now() + 5*60*1000 + '';
                await prisma.emailOtpVerification.update({
                    where : {
                        token : otpToken
                    },
                    data : {
                        otp : randomOtp,
                        otpExpiry : expTime,
                    }
                })
                try {
                    const result = await sendMail({email : userDataWithOtpField.user.email,otp : randomOtp})
                if(result.accepted){
                    return{
                        success : true,
                        message : "OTP send to email",
                    }
                }else{
                    return{
                        success : false,
                        message : "Something went wrong",
                    }
                }
                } catch (error) {
                    return {
                        success : false,
                        message : "Try sending again !"
                    }
                }
            } catch (error) {
                return {
                    success : false,
                    message : "Try sending again !"
                }
            }
        }
        else{
            return{
                success : false,
                message : "Invalid token error"
            } 
        }
    } catch (error) {
        return{
            success : false,
            message : "Invalid token error"
        }
    }

}



export async function resendOTPForPassChange({otpToken} : {otpToken : string}){
    try {
        const userDataWithOtpField = await prisma.emailOtpVerification.findFirst({
            where : {
                token : otpToken
            },
            include : {
                user : {
                    select : {
                        email : true,
                        isEmailVerified : true
                    }
                }
            }
        })
        if(userDataWithOtpField && !userDataWithOtpField.user.isEmailVerified){
            return{
                success : false,
                message : "Email not verified"
            }
        }
        if(userDataWithOtpField && userDataWithOtpField.user.isEmailVerified){
            try {
                var randomOtp = '';
                for(var i = 0 ; i < 6 ; i++){
                    randomOtp += Math.floor(Math.random()*10);
                }
                const expTime = Date.now() + 5*60*1000 + '';
                await prisma.emailOtpVerification.update({
                    where : {
                        token : otpToken
                    },
                    data : {
                        otp : randomOtp,
                        otpExpiry : expTime,
                    }
                })
                try {
                    const result = await sendMail({email : userDataWithOtpField.user.email,otp : randomOtp})
                    if(result.accepted){
                        return{
                            success : true,
                            message : "OTP send to email",
                        }
                    }else{
                        return{
                            success : false,
                            message : "Something went wrong",
                        }
                    }
                } catch (error) {
                    
                    return {
                        success : false,
                        message : "Try sending again !"
                    }
                }
            } catch (error) {
                console.log(error)
                return {
                    success : false,
                    message : "Try sending again !"
                }
            }
        }
        else{
            return{
                success : false,
                message : "Invalid token error"
            } 
        }
    } catch (error) {
        return{
            success : false,
            message : "Invalid token error"
        }
    }

}