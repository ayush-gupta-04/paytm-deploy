// 'use server'
// import { p2pFormat, p2pSchema } from "@repo/schema/zod";
// import { getServerSession } from "next-auth";
// import { NEXT_AUTH } from "../../lib/auth";
// import prisma from "@paytm-repo/db/client";
// import bcrypt from "bcrypt"

// export async  function p2pTransfer(data : p2pFormat){
//     //TODO : User should not be able to send money to himself.......DONE
//     const success = p2pSchema.safeParse(data);
//     //always store the amount in db multiplied by 100.
//     const amount = Number(data.amount)*100;
//     if(success){
//         const session = await getServerSession(NEXT_AUTH);
//         if(session){
//             const FromUser = await prisma.user.findFirst({
//                 where : {
//                     id : session.user.id
//                 }
//             })
//             if(FromUser && FromUser.password){
//                 const passMatched = await bcrypt.compare(data.password,FromUser.password)
//                 if(passMatched){
//                     //toUser cannot be the same user who is sending money ---> done
//                     const toUser = await prisma.user.findFirst({
//                         where : {
//                             AND : [
//                                 {phone : data.phone},
//                                 {phone :
//                                     {
//                                         not : FromUser.phone
//                                     }
//                                 }
//                             ]
//                         }
//                     })
//                     if(toUser){
//                         try {
//                             const result = await prisma.$transaction(async (tnx) => {
//                                 //it locks the row until one query is done...so two request at the same time will automatically forms a queue
//                                 //prisma doesn't provies locking out of the box so did raw query.
//                                 await tnx.$queryRaw`SELECT * FROM "Balance" WHERE "userId" = ${FromUser.id} FOR UPDATE`;
//                                 const balance = await tnx.balance.findFirst({
//                                     where : {
//                                         userId : FromUser.id
//                                     }
//                                 })
//                                 if(!balance || balance.amount < Number(amount)){
//                                     throw new Error("Insufficient Funds")
//                                 }
//                                 await tnx.balance.update({
//                                     where : {
//                                         userId : FromUser.id
//                                     },
//                                     data : {
//                                         amount : {
//                                             decrement : Number(amount)
//                                         }
//                                     }
//                                 })
//                                 await tnx.balance.update({
//                                     where : {
//                                         userId : toUser.id
//                                     },
//                                     data : {
//                                         amount : {
//                                             increment : Number(amount)
//                                         }
//                                     }
//                                 })
//                                 await tnx.p2pTransfer.create({
//                                     data : {
//                                         toUserId : toUser.id,
//                                         fromUserId : FromUser.id,
//                                         amount : Number(amount),
//                                         timestamp : new Date()
//                                     }
//                                 })
//                                 return{
//                                     success : true
//                                 }
//                             })
//                             if(result.success){
//                                 return{
//                                     success : true,
//                                     message : "Successfully Transfered!"
//                                 }
//                             }
//                         } catch (error) {
//                             return{
//                                 success : false,
//                                 message : "Payment Failed"
//                             }
//                         }
//                     }else{
//                         return{
//                             success : false,
//                             message : "No user with given phone no.!"
//                         }
//                     }
//                 }else{
//                     return{
//                         success : false,
//                         message : "Wrong Password!"
//                     }
//                 }
//             }else{
//                 return{
//                     success : false,
//                     message : "Unauthorised Access!"
//                 }
//             }
//         }else{
//             return{
//                 success : false,
//                 message : "Unauthorised Access!"
//             }
//         }
//     }else{
//         return{
//             success : true,
//             message : "Invalid inputs!"
//         }
//     }
// }