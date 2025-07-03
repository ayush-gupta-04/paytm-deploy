'use server'
import { EditDetailsFormat, EditDetailsSchema } from "../../lib/schema";
import { getServerSession } from "next-auth";
import { NEXT_AUTH } from "../../lib/auth";
import  prisma  from "../../lib/db";

export async function changePersonalDetails(data : EditDetailsFormat){
    console.log(data);
    const format = EditDetailsSchema.safeParse(data);
    const session = await getServerSession(NEXT_AUTH);
    if(!session){
        return{
            success : false,
            message : "Invalid token!"
        }
    }
    if(format.success){
        try {
            const user = await prisma.user.update({
                where : {
                    id : session.user.id
                },
                data : {
                    firstname : data.firstname,
                    lastname : data.lastname,
                    dob : data.dob,
                    gender : data.gender
                }
            })
            if(user){
                return{
                    success : true,
                    message : "Changes saved successfully"
                }
            }else{
                return{
                    success : false,
                    message : "Something went down !"
                }
            }
        } catch (error) {
            console.log(error)
            return{
                success : false,
                message : "Something went down !"
            }
        }
    }
    else{
        return{
            success : false,
            message : "Invalid Input"
        }
    }
}