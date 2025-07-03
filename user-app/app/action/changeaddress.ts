'use server'
import { EditAddressFormat, EditAddressSchema } from "../../lib/schema";
import { getServerSession } from "next-auth";
import { NEXT_AUTH } from "../../lib/auth";
import prisma from "../../lib/db";

export default async function changeAddress(data : EditAddressFormat){
    const format = EditAddressSchema.safeParse(data);
    const session = await getServerSession(NEXT_AUTH);
    if(!session){
        return{
            success : false,
            message : "Invalid Token!"
        }
    }
    
    if(format.success){
        try {
            const user = await prisma.address.upsert({
                where : {
                    userId : session.user.id
                },
                update : {
                    address : data.address,
                    city : data.city,
                    country : data.country,
                    pincode : data.pincode
                },
                create : {
                    userId : session.user.id,
                    address : data.city,
                    city : data.city,
                    country : data.country,
                    pincode : data.pincode
                }
            })
            if(user){
                return {
                    success : true,
                    message : "Data saved Successfully!"
                }
            }
        } catch (error) {
            console.log(error)
            return{
                success : false,
                message : "Something went down!"
            }
        }
    }else{
        return{
            success : false,
            message : "Invalid input!"
        }
    }
    
}