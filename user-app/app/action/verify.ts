'use server'
import  prisma  from "../../lib/db";

export async function verifyingEmailOtp(data : { otp : string, otpToken : string }){
    try {
        const tokenForEmailVerification = await prisma.emailOtpVerification.findFirst({
            where : {
                token : data.otpToken
            },
            include : {
                user : true
            }
        })
        const currTime = Date.now() + 0 + "";
        if(tokenForEmailVerification){
            if(tokenForEmailVerification.user.isEmailVerified){
                return{
                    success : false,
                    message : "Email already Verified"
                }
            }
            if(tokenForEmailVerification.otpExpiry > currTime){
                if(tokenForEmailVerification.otp == data.otp){
                    try {
                        const update = await prisma.user.update({
                            data : {
                                isEmailVerified : true
                            },
                            where : {
                                id : tokenForEmailVerification.userId
                            }
                        })
                        if(update){
                            return{
                                success : true,
                                message : "Email Verified Successfully"
                            }
                        }
                    } catch (error) {
                        return{
                            success : false,
                            message : "Resend otp and try again",
                        }
                    }
                    
                }else{
                    return{
                        success : false,
                        message : "Incorrect OTP",
                    } 
                }
            }else{
                return{
                    success : false,
                    message : "OTP expired. Resend and try again!",
                }
            }
        }else{
            return{
                success : false,
                message : "Invalid Token Error.",
            }
        }
    } catch (error) {
        return{
            success : false,
            message : "Invalid Token Error.",
        }
    }
}






export async function verifyingPassOtpForChangePass(data : { otp : string, otpToken : string }){
    try {
        const tokenForEmailVerification = await prisma.emailOtpVerification.findFirst({
            where : {
                token : data.otpToken
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
        const currTime = Date.now() + 0 + "";
        if(tokenForEmailVerification){
            if(!tokenForEmailVerification.user.isEmailVerified){
                return{
                    success : false,
                    message : "Email not Verified"
                }
            }
            if(tokenForEmailVerification.otpExpiry > currTime){
                if(tokenForEmailVerification.otp == data.otp){
                    await prisma.emailOtpVerification.update({
                        where : {
                            token : data.otpToken
                        },
                        data : {
                            isVerified : true
                        }
                    })
                    return{
                        success : true,
                        message : "Verified successfully ! Now process to change password",
                    }
                }else{
                    return{
                        success : false,
                        message : "Incorrect OTP",
                    } 
                }
            }else{
                return{
                    success : false,
                    message : "OTP expired. Resend and try again!",
                }
            }
        }else{
            return{
                success : false,
                message : "Invalid Token Error.",
            }
        }
    } catch (error) {
        return{
            success : false,
            message : "Invalid Token Error.",
        }
    }
}