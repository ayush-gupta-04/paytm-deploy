'use server'
import {SignupFormat} from "../../lib/schema";
import  prisma  from "../../lib/db";
import { signupSchema } from "../../lib/schema";
import bcrypt from "bcrypt";
import { sendMail } from "../../lib/gmail";
import crypto from "crypto"

export async function CreateNewAccount(user : SignupFormat){
    const format = signupSchema.safeParse(user);
    if(format.success){
        try {
            const userExist = await prisma.user.findFirst({
                where : {
                    OR : [
                        {email : user.email},
                        {phone : user.phone}
                    ]
                }
            })
            if(userExist){
                return{
                    success : false,
                    message : "User already exist"
                }
            }
            const hashedPass = await bcrypt.hash(user.password,10);
            var randomOtp = '';
            for(var i = 0 ; i < 6 ; i++){
                randomOtp += Math.floor(Math.random()*10);
            }
            const otpExpiryTime = Date.now() + 5*60*1000 + '';
            const otpToken = crypto.randomUUID();
            try {
                const otpTable = await prisma.$transaction(async (tnx) => {
                    const newUser = await tnx.user.create({
                        data : {
                            firstname : user.firstname,
                            lastname : user.lastname,
                            email : user.email,
                            password : hashedPass,
                            phone : user.phone,
                        }
                    })
                    
                    await tnx.balance.create({
                        data : {
                            amount : 0,
                            locked : 0,
                            userId : newUser.id
                        }
                    })
                    const otpTable = await tnx.emailOtpVerification.create({
                        data : {
                            userId : newUser.id,
                            otp : randomOtp,
                            otpExpiry : otpExpiryTime,
                            token : otpToken
                        }
                    })
                    return otpTable 
                })
        
                //send email
                const result = await sendMail({email : user.email,otp : randomOtp})
                if(result.accepted){
                    return{
                        success : true,
                        message : "OTP send to email",
                        otpToken : otpTable.token
                    }
                }else{
                    return{
                        success : false,
                        message : "Trouble in sending OTP. Verify email via Login"
                    }
                }
            } catch (error) {
                return{
                    success : false,
                    message : "Something went wrong!"
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
            message : "Invalid Inputs"
        }
    }
}