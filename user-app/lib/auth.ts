import CredentialsProvider from 'next-auth/providers/credentials';
import  prisma  from "./db";
import GoogleProvider from 'next-auth/providers/google'
import bcrypt from "bcrypt"
import { signinSchema } from './schema';

export const NEXT_AUTH = {
    providers : [
        CredentialsProvider({
            name: 'Email',
            credentials: {
              username: { label: 'Email', type: 'text', placeholder: '' },
              password: { label: 'Password', type: 'password', placeholder: '' },
            },
            async authorize(credentials : any) {
                const format = signinSchema.safeParse({email : credentials.username,password : credentials.password});
                if(format.success){
                    const email = credentials.username as string;
                    const password = credentials.password as string;
                    try {
                        const data = await prisma.user.findFirst({
                            where : {
                                email : email
                            }
                        })
                        if(data && data.isEmailVerified && data.password){
                            const passMatched = await bcrypt.compare(password,data.password)
                            if(passMatched){
                                return{
                                    id : data.id,
                                    name : data.firstname + " " + data.lastname,
                                    email : data.email,
                                    phone : data.phone
                                }
                            }else{
                                return null
                            }
                        }else{
                            return null;
                        }
                    } catch (error) {
                        return null
                    }
                } 
                return null;
                
            },
        }),
        GoogleProvider({
            clientId : process.env.GOOGLE_CLIENT_ID || "",
            clientSecret : process.env.GOOGLE_CLIENT_SECRET || ""
        })
    ],
    pages : {
        signIn : '/auth/signin',
        signOut : '/auth/signin'
    },
    secret : process.env.NEXTAUTH_SECRET,
    callbacks : {
        session : ({session,token} : any) => {
            session.user.id = token.sub;
            return session;
        },
        signIn : async ({user,account} : any) => {
            if(account.provider == "google"){
                const existingUser = await prisma.user.findFirst({
                    where : {
                        email : user.email
                    }
                })
                const name = user.name.split(" ");
                let firstname = user.name;
                let lastname = null;
                if(name.length == 2){
                    firstname = name[0];
                    lastname = name[1];
                }
                if(!existingUser){
                    try {
                        const newUser = await prisma.$transaction(async (tnx) => {
                            const newUser = await tnx.user.create({
                                data : {
                                    email : user.email,
                                    firstname : firstname,
                                    lastname : lastname,
                                    isEmailVerified : true
                                }
                            })
                            await tnx.balance.create({
                                data : {
                                    amount : 0,
                                    locked : 0,
                                    userId : newUser.id
                                }
                            })
                            return newUser;
                        })
                        //this user will default have a google id.
                        //we change this google id with our databse id...to inject in session object.
                        user.id = newUser.id;
                        return true;
                    } catch (error) {
                        return false;
                    }
                }else{
                    //this user will default have a google id.
                    //we change this google id with our databse id...to inject in session object.
                    user.id = existingUser.id;
                }
                
            }
            return true;
        }
    }
}
