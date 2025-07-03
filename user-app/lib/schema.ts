import zod, { number } from "zod";
import {Gender} from "@prisma/client"


export const signupSchema = zod.object({
    firstname : zod.string({invalid_type_error : "Firstname should be of type String"}).min(1,{
        message : "firstname cannot be empty"
    }),
    lastname : zod.string({invalid_type_error : "Lastname should be of type String"}),
    phone : zod.string().length(10,{message : "length must be 10"}).refine((data) => {
        for(let i = 0; i < data.length ; i++){
            if((Number(data.charAt(i)) >= 0 && Number(data.charAt(i)) <= 9)){
                return true;
            }
            return false;
        }
        return true;
    },{message : "Phone number should only contain numbers."}),
    password : zod.string().min(8,{message : "Password should be min of 8 characters"}),
    email : zod.string().email()
})

export const signinSchema = zod.object({
    email : zod.string().email(),
    password : zod.string().min(8,{message : "Password should be min of 8 characters"})
})
export const otpSchema = zod.object({
    otp : zod.string().length(6,{message : "Otp must be of 6 digits"})
})
export const emailSchema = zod.object({
    email : zod.string().email(),
})
export const changePassSchema = zod.object({
    password : zod.string().min(8,{message : "Password should be min of 8 characters"}),
    confirmPass : zod.string().min(8,{message : "Password should be min of 8 characters"})
}).refine((data) => {
    if(data.password == data.confirmPass){
        return true;
    }
    return false;
},{message : "Password and confirm Pass should match"});
export const addMoneySchema = zod.object({
    amount : zod.string().min(1,{message : "This Field is required"}).refine((money) => {
        for(var i = 0 ; i < money.length ; i++){
            if(!(Number(money.charAt(i)) >= 0 && Number(money.charAt(i)) <= 9)){
                return false;
            }
            return true;
        }
    },{message : "Amount must be a number"}).refine((data) => {
        if(Number(data.charAt(0)) == 0){
            return false;
        }
        return true;
    }),
    bankName : zod.string({required_error : "This field is required"}).min(1,{message : "Bank cannot be Empty"}),
})
export const p2pTransferToPhoneSchema = zod.object({
    amount : zod.string().min(1,{message : "This Field is required"}).refine((money) => {
        for(var i = 0 ; i < money.length ; i++){
            if(!(Number(money.charAt(i)) >= 0 && Number(money.charAt(i)) <= 9)){
                return false;
            }
            return true;
        }
    },{message : "Amount must be a number"}).refine((data) => {
        if(Number(data.charAt(0)) == 0){
            return false;
        }
        return true;
    }),
    phone : zod.string().length(10,{message : "length must be 10"}).refine((data) => {
        for(let i = 0; i < data.length ; i++){
            if((Number(data.charAt(i)) >= 0 && Number(data.charAt(i)) <= 9)){
                return true;
            }
            return false;
        }
        return true;
    },{message : "Phone number should only contain numbers."}),
    tpin : zod.string().length(6,{message : "Tpin must be of length 6!"})
})


export const p2pTransferToUpiSchema = zod.object({
    amount : zod.string().min(1,{message : "This Field is required"}).refine((money) => {
        for(var i = 0 ; i < money.length ; i++){
            if(!(Number(money.charAt(i)) >= 0 && Number(money.charAt(i)) <= 9)){
                return false;
            }
            return true;
        }
    },{message : "Amount must be a number"}).refine((data) => {
        if(Number(data.charAt(0)) == 0){
            return false;
        }
        return true;
    }),
    upi : zod.string().max(20,{message : "UPI id cannot be more than 20"}).refine((data) => {
        let regex = /^[a-zA-Z0-9]+[@]paytm$/;
        if(data.match(regex)){
            return true;
        }
        return false
    },{message : "upi should end with @paytm",}),
    tpin : zod.string().length(6,{message : "Tpin must be of length 6!"})
})



export const AddUpiSchema = zod.object({
    upi : zod.string().max(20,{message : "UPI id cannot be more than 20"}).refine((data) => {
        let regex = /^[a-zA-Z0-9]+[@]paytm$/;
        if(data.match(regex)){
            return true;
        }
        return false
    },{message : "upi should end with @paytm",})
})

export const EditAddressSchema = zod.object({
    address : zod.string().max(20,{message : "Address cannot be more than 20 chars"}).min(1),
    city : zod.string().max(15,{message : "Too long name"}).min(1),
    country : zod.string().max(15,{message : "Too long name"}).min(1),
    pincode : zod.string().max(8,{message : "Pincode must be of 8 digits"}).refine((data) => {
        let regex = /^[0-9]+/;
        if(data.match(regex)){
            return true;
        }
        return false;
    })
})

export const EditDetailsSchema = zod.object({
    firstname : zod.string().max(20,{message : "Too long name"}).min(1),
    lastname : zod.string().max(15,{message : "Too long name"}).min(1),
    dob : zod.string().min(1).refine((data) => {
        const regex = /^\d{4}[-]\d{2}[-]\d{2}$/;
        if(data.match(regex)){
            return true
        }
        return false
    }),
    gender : zod.nativeEnum(Gender,{message : "Gender cannot be Empty"})
})

export const phoneSchema = zod.object({
    phone : zod.string().length(10,{message :"Phone should be of length 10 only"}).refine((data)=>{
        const regex = /^\d{10}$/;
        if(data.match(regex)){
            return true
        }
        return false
    })
})

export const ReportProblemSchema = zod.object({
    tnxId : zod.string().min(1,{message : "Transaction ID cannot be empty"}),
    subject : zod.string().min(1,{message : "Subject cannot be empty"}),
    body : zod.string().min(1,{message : "body cannot be empty"})
})
export const tpinSchema = zod.object({
    tpin1 : zod.string().length(1).refine((data) => {
        return (Number(data) >= 0 && Number(data) <= 9)
    }),
    tpin2 : zod.string().length(1).refine((data) => {
        return (Number(data) >=0 && Number(data) <= 9)
    }),
    tpin3 : zod.string().length(1).refine((data) => {
        return (Number(data) >=0 && Number(data) <= 9)
    }),
    tpin4 : zod.string().length(1).refine((data) => {
        return (Number(data) >=0 && Number(data) <= 9)
    }),
    tpin5 : zod.string().length(1).refine((data) => {
        return (Number(data) >=0 && Number(data) <= 9)
    }),
    tpin6 : zod.string().length(1).refine((data) => {
        return (Number(data) >=0 && Number(data) <= 9)
    })
})

export const newOtpSchema = zod.object({
    otp1 : zod.string().length(1).refine((data) => {
        return (Number(data) >= 0 && Number(data) <= 9)
    }),
    otp2 : zod.string().length(1).refine((data) => {
        return (Number(data) >=0 && Number(data) <= 9)
    }),
    otp3 : zod.string().length(1).refine((data) => {
        return (Number(data) >=0 && Number(data) <= 9)
    }),
    otp4 : zod.string().length(1).refine((data) => {
        return (Number(data) >=0 && Number(data) <= 9)
    }),
    otp5 : zod.string().length(1).refine((data) => {
        return (Number(data) >=0 && Number(data) <= 9)
    }),
    otp6 : zod.string().length(1).refine((data) => {
        return (Number(data) >=0 && Number(data) <= 9)
    })
})



export const changeAddTpinSchema = zod.object({
    tpin : zod.string().length(6).refine((data) => {
        for(let i = 0 ; i < data.length ; i++){
            if(!(Number(data.charAt(i)) >= 0 && Number(data.charAt(i)) <= 9)){
                return false;
            }
        }
        return true;
    }),
    confirmTpin : zod.string().length(6).refine((data) => {
        for(let i = 0 ; i < data.length ; i++){
            if(!(Number(data.charAt(i)) >= 0 && Number(data.charAt(i)) <= 9)){
                return false;
            }
        }
        return true;
    })
}).refine((data) => {
    if(data.tpin == data.confirmTpin){
        return true;
    }
    return false
},{message : "Tpin and confirm Tpin should match."})


export const amountSchema = zod.object({
    amount : zod.string().min(1,{message : "This Field is required"}).refine((money) => {
        for(var i = 0 ; i < money.length ; i++){
            if(!(Number(money.charAt(i)) >= 0 && Number(money.charAt(i)) <= 9)){
                return false;
            }
            return true;
        }
    },{message : "Amount must be a number"}).refine((data) => {
        if(Number(data.charAt(0)) == 0){
            return false;
        }
        return true;
    }),
})



export const UpiSchema = zod.object({
    upi : zod.string().max(20,{message : "UPI id cannot be more than 20"}).refine((data) => {
        let regex = /^[a-zA-Z0-9]+[@]paytm$/;
        if(data.match(regex)){
            return true;
        }
        return false
    },{message : "upi should end with @paytm",})
})


export type SignupFormat = zod.infer<typeof signupSchema>;
export type SigninFormat = zod.infer<typeof signinSchema>;
export type otpFormat = zod.infer<typeof otpSchema>;
export type emailFormat = zod.infer<typeof emailSchema>;
export type changePassFormat = zod.infer<typeof changePassSchema>;
export type addMoneyFormat = zod.infer<typeof addMoneySchema>;
export type p2pTransferToPhoneFormat = zod.infer<typeof p2pTransferToPhoneSchema>;
export type AddUpiFormat = zod.infer<typeof AddUpiSchema>;
export type EditAddressFormat = zod.infer<typeof EditAddressSchema>;
export type EditDetailsFormat = zod.infer<typeof EditDetailsSchema>;
export type phoneFormat = zod.infer<typeof phoneSchema >
export type ReportProblemFormat = zod.infer<typeof ReportProblemSchema>;
export type newOtpFormat = zod.infer<typeof newOtpSchema>
export type changeAddTpinFormat = zod.infer<typeof changeAddTpinSchema>;
export type amountFormat = zod.infer<typeof amountSchema>;
export type tpinFormat = zod.infer<typeof tpinSchema>;
export type UpiFormat = zod.infer<typeof UpiSchema>;
export type p2pTransferToUpiFormat = zod.infer<typeof p2pTransferToUpiSchema>;