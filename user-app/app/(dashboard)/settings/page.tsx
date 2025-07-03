
import { getServerSession } from "next-auth"
import AddPhone from "../../../components/addphone"
import Address from "../../../components/address"
import AddUpiID from "../../../components/addupi"
import ContactUs from "../../../components/contactus"
import Logout from "../../../components/logout"
import PersonalDetails from "../../../components/personaldetails"
import ProfileCard from "../../../components/profile"
import SetTpin from "../../../components/changeAddTpin"
import { NEXT_AUTH } from "../../../lib/auth"
import  prisma  from "../../../lib/db";
import UpiHeading from "../../../components/upiheading"
import ChangePasswordElement from "../../../components/changepassword"

async function getDetails() {
    const session = await getServerSession(NEXT_AUTH);
    if(!session){
        return {
            personal : {
                firstname :  null,
                lastname :  null,
                dob : null,
                gender : null,
            },
            email : null,
            phone : null,
            upi : null,
            
            address : {
                city : null,
                country : null,
                pincode : null,
                address : null
            }
        }
    }
    try {
        const data = await prisma.user.findFirst({
            where : {
                id : session.user.id
            },
            select : {
                id : false,
                isEmailVerified : false,
                password : false,
                firstname : true,
                lastname : true,
                email : true,
                phone : true,
                upi : true,
                dob : true,
                gender : true,
                address : {
                    select : {
                        city : true,
                        country : true,
                        pincode : true,
                        address : true
                    }
                }
            }
        })
        return {
            personal : {
                firstname : data?.firstname  || null,
                lastname : data?.lastname || null,
                dob : data?.dob || null,
                gender : data?.gender || null,
            }
            ,
            email : data?.email || null,
            phone : data?.phone || null,
            upi : data?.upi || null,
            
            address : {
                address : data?.address[0]?.address || null,
                city : data?.address[0]?.city || null,
                pincode : data?.address[0]?.pincode || null,
                country : data?.address[0]?.country || null
            }
        }
    } catch (error) {
        return {
            personal : {
                firstname :  null,
                lastname :  null,
                dob : null,
                gender : null,
            },
            email : null,
            phone : null,
            upi : null,
            
            address : {
                city : null,
                country : null,
                pincode : null,
                address : null
            }
        }
    }
}

export default async function SettingsPage(){
    const details = await getDetails();
    const safeUpi = {
        upi : details.upi
    }
    return (
        <div className="h-[770px] overflow-auto w-full flex flex-col py-4 px-4 gap-8 bg-[#ECF5FC] relative" style={{scrollbarWidth : "thin"}}>
            <UpiHeading initialUpi = {safeUpi}></UpiHeading>
            <div className="flex flex-col gap-3">
                <div className="w-fit h-fit px-3 py-2 bg-[#0560FD] text-white rounded-lg">
                    Personal settings
                </div>
                <div className="w-full h-fit rounded-lg grid grid-cols-8">
                    <ProfileCard email = {details.email} serverPhone = {details.phone}></ProfileCard>
                    <PersonalDetails serverDetails = {details.personal}></PersonalDetails>
                    <Address address = {details.address}></Address>
                </div>
            </div>
            <div className="flex flex-col gap-3">
                <div className="w-fit h-fit px-3 py-2 bg-[#0560FD] text-white rounded-lg">
                    Other settings
                </div>
                <div className="w-full h-fit rounded-lg bg-white shadow-lg">
                    <ChangePasswordElement></ChangePasswordElement>
                    <AddUpiID upi = {details?.upi}></AddUpiID>
                    <AddPhone serverPhone = {details.phone}></AddPhone>
                    <SetTpin></SetTpin>
                    <ContactUs></ContactUs>
                    <Logout></Logout>
                </div>
            </div>
        </div>
    )
}
