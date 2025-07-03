'use server'
import { p2pTransferToPhoneSchema, p2pTransferToUpiSchema } from "../../lib/schema";
import { getServerSession } from "next-auth";
import { NEXT_AUTH } from "../../lib/auth";
import  prisma  from "../../lib/db";
import bcrypt from "bcrypt"

export async function p2pTransferToPhone(data : {phone : string , amount : string, tpin : string}){
    const format = p2pTransferToPhoneSchema.safeParse(data);
    if(format.success){
        const amount = Number(data.amount)*100;
        const session = await getServerSession(NEXT_AUTH);
        if(session){
            try {
                const FromUser = await prisma.user.findFirst({
                    where : {
                        id : session.user.id
                    },
                    select : {
                        phone : true,
                        upi : true,
                        tpin : true,
                        id : true,
                        firstname : true,
                        lastname : true
                    }
                })
                if(FromUser && FromUser.tpin){
                    const passMatched = await bcrypt.compare(data.tpin,FromUser.tpin)
                    if(passMatched){
                        //toUser cannot be the same user who is sending money ---> done
                        try {
                            const toUser = await prisma.user.findFirst({
                                where : {
                                    AND : [
                                        {phone : data.phone},
                                        {phone :
                                            {
                                                not : FromUser.phone
                                            }
                                        }
                                    ]
                                },
                                select : {
                                    id : true,
                                    phone : true
                                }
                            })
                            if(toUser){
                                try {
                                    const result = await prisma.$transaction(async (tnx) => {
                                        //it locks the row until one query is done...so two request at the same time will automatically forms a queue
                                        //prisma doesn't provies locking out of the box so did raw query.
                                        await tnx.$queryRaw`SELECT * FROM "Balance" WHERE "userId" = ${FromUser.id} FOR UPDATE`;
                                        const balance = await tnx.balance.findFirst({
                                            where : {
                                                userId : FromUser.id
                                            }
                                        })
                                        if(!balance || balance.amount < Number(amount)){
                                            throw new Error("Insufficient Funds")
                                        }
                                        await tnx.balance.update({
                                            where : {
                                                userId : FromUser.id
                                            },
                                            data : {
                                                amount : {
                                                    decrement : Number(amount)
                                                }
                                            }
                                        })
                                        await tnx.balance.update({
                                            where : {
                                                userId : toUser.id
                                            },
                                            data : {
                                                amount : {
                                                    increment : Number(amount)
                                                }
                                            }
                                        })
                                        await tnx.p2pTransfer.create({
                                            data : {
                                                toUserId : toUser.id,
                                                fromUserId : FromUser.id,
                                                amount : Number(amount),
                                                timestamp : new Date(),
                                                fromUserPhone : FromUser.upi?null:FromUser.phone,
                                                fromUserUpi : FromUser.upi?FromUser.upi:null,
                                                toUserPhone : toUser.phone
                                            }
                                        })
                                        return{
                                            success : true
                                        }
                                    })
                                    if(result.success){
                                        return{
                                            success : true,
                                            message : "Successfully Transfered!",
                                            data : {
                                                receiverId : toUser.id,
                                                message : {
                                                    from : FromUser.firstname + " " + FromUser.lastname,
                                                    amount : data.amount,
                                                    phone : FromUser.upi?null:FromUser.phone,
                                                    upi : FromUser.upi?FromUser.upi:null,
                                                }
                                            }
                                        }
                                    }
                                } catch (error) {
                                    if(error == 'if'){
                                        return{
                                            success : false,
                                            message : "Insufficient funds"
                                        }
                                    }
                                    return{
                                        success : false,
                                        message : "Something went down!"
                                    }
                                }
                            }else{
                                return{
                                    success : false,
                                    message : "No user with given phone no.!"
                                }
                            }
                        } catch (error) {
                            return{
                                success : false,
                                message : "Something went down!"
                            }
                        }
                    }else{
                        return{
                            success : false,
                            message : "Wrong Password!"
                        }
                    }
                }else{
                    return{
                        success : false,
                        message : "Set TPIN first!"
                    }
                }
            } catch (error) {
                return{
                    success : false,
                    message : "Something went down!"
                }
            }
        }else{
            return{
                success : false,
                message : "Unauthorised Access!"
            }
        }
    }else {
        return {
            success : false,
            message : "Invalid Input!"
        }
    }
}







export async function p2pTransferToUpi(data : {upi : string , amount : string, tpin : string}){
    const format = p2pTransferToUpiSchema.safeParse(data);
    if(format.success){
        const amount = Number(data.amount)*100;
        const session = await getServerSession(NEXT_AUTH);
        if(session){
            try {
                const FromUser = await prisma.user.findFirst({
                    where : {
                        id : session.user.id
                    },
                    select : {
                        phone : true,
                        upi : true,
                        tpin : true,
                        id : true,
                        firstname : true,
                        lastname : true
                    }
                })
                if(FromUser && FromUser.tpin){
                    const passMatched = await bcrypt.compare(data.tpin,FromUser.tpin)
                    if(passMatched){
                        //toUser cannot be the same user who is sending money ---> done
                        try {
                            const toUser = await prisma.user.findFirst({
                                where : {
                                    AND : [
                                        {upi : data.upi},
                                        {upi :
                                            {
                                                not : FromUser.upi
                                            }
                                        }
                                    ]
                                },
                                select : {
                                    id : true,
                                    upi : true
                                }
                            })
                            if(toUser){
                                try {
                                    const result = await prisma.$transaction(async (tnx) => {
                                        //it locks the row until one query is done...so two request at the same time will automatically forms a queue
                                        //prisma doesn't provies locking out of the box so did raw query.
                                        await tnx.$queryRaw`SELECT * FROM "Balance" WHERE "userId" = ${FromUser.id} FOR UPDATE`;
                                        const balance = await tnx.balance.findFirst({
                                            where : {
                                                userId : FromUser.id
                                            }
                                        })
                                        if(!balance || balance.amount < Number(amount)){
                                            throw new Error("if")
                                        }
                                        await tnx.balance.update({
                                            where : {
                                                userId : FromUser.id
                                            },
                                            data : {
                                                amount : {
                                                    decrement : Number(amount)
                                                }
                                            }
                                        })
                                        await tnx.balance.update({
                                            where : {
                                                userId : toUser.id
                                            },
                                            data : {
                                                amount : {
                                                    increment : Number(amount)
                                                }
                                            }
                                        })
                                        await tnx.p2pTransfer.create({
                                            data : {
                                                toUserId : toUser.id,
                                                fromUserId : FromUser.id,
                                                amount : Number(amount),
                                                timestamp : new Date(),
                                                fromUserPhone : FromUser.upi?null:FromUser.phone,
                                                fromUserUpi : FromUser.upi?FromUser.upi:null,
                                                toUserUpi : toUser.upi
                                            }
                                        })
                                        return{
                                            success : true
                                        }
                                    })
                                    if(result.success){
                                        return{
                                            success : true,
                                            message : "Successfully Transfered!",
                                            data : {
                                                receiverId : toUser.id,
                                                message : {
                                                    from : FromUser.firstname + " " + FromUser.lastname,
                                                    amount : data.amount,
                                                    phone : FromUser.upi?null:FromUser.phone,
                                                    upi : FromUser.upi?FromUser.upi:null,
                                                }
                                            }
                                        }
                                    }
                                } catch (error) {
                                    if(error == 'if'){
                                        return{
                                            success : false,
                                            message : "Insufficient funds"
                                        }
                                    }
                                    return{
                                        success : false,
                                        message : "Something went down!"
                                    }
                                }
                            }else{
                                return{
                                    success : false,
                                    message : "No user with given UPI ID!"
                                }
                            }
                        } catch (error) {
                            return{
                                success : false,
                                message : "Something went down!"
                            }
                        }
                    }else{
                        return{
                            success : false,
                            message : "Wrong Password!"
                        }
                    }
                }else{
                    return{
                        success : false,
                        message : "Set TPIN first!"
                    }
                }
            } catch (error) {
                return{
                    success : false,
                    message : "Something went down!"
                }
            }
        }else{
            return{
                success : false,
                message : "Unauthorised Access!"
            }
        }
    }else {
        return {
            success : false,
            message : "Invalid Input!"
        }
    }
}