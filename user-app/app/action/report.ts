'use server'
import { ReportProblemFormat, ReportProblemSchema } from "../../lib/schema";
import { sendReport } from "../../lib/gmail";
import { getServerSession } from "next-auth";
import { NEXT_AUTH } from "../../lib/auth";

export default async function ReportProblemAction(data : ReportProblemFormat){
    const session = await getServerSession(NEXT_AUTH);
    const format = ReportProblemSchema.safeParse(data);
    
    if(!session || !session.user.email){
        return {
            success : false,
            message : "Invalid Token!"
        }
    }
    if(format.success){
        const result = await sendReport({sender : session.user.email,subject : data.subject,body : data.body , transactionId : data.tnxId});
        if(result.accepted){
            return{
                success : true,
                message : "Problem reported successfully",
            }
        }else{
            return{
                success : false,
                message : "Something went wrong!",
            }
        }
    }
}