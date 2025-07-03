import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";


//agar mera app kisi bhi config wale path m h .... sbse pehle middleware run hoga.
//we will extract the path.
//checks if token exist.
//then redirect to specif route --> by NextResponse.redirect()



//steps --> 1. make a file middleware.ts in same level as app.
//      --> 2. export a function middleware....arg--> NextRequest.
//      --> 3. export config ... a json ... has matcher(an array of strings)
//      --> 4. extract the path ... by ... request.nextUrl.pathname.
//      --> 5. redirect according to the situation.
export async function middleware(req : NextRequest){
    const path = req.nextUrl.pathname;
    const isPublicPath = (path == '/auth/signin' || path == "/" || path == '/auth/signup' || path == '/forgotpass/change' || path == '/forgotpass/email' || path == '/forgotpass/verifyotp' || path == '/verifymail/email' || path == '/verifymail/verifyotp');
    const token = await getToken({ req: req, secret: process.env.NEXTAUTH_SECRET });
    console.log("token " + token)

    if(isPublicPath && token){
        return NextResponse.redirect(new URL('/dashboard',req.nextUrl));
    }
    if(!isPublicPath && !token){
        return NextResponse.redirect(new URL('/auth/signin',req.nextUrl));
    }
}

export const config = {
    matcher : [
        '/',
        '/auth/signin',
        '/auth/signup',
        '/forgotpass/change',
        '/forgotpass/email',
        '/forgotpass/verifyotp',
        '/verifymail/email',
        '/verifymail/verifyotp',
        '/dashboard',
        '/history',
        '/settings',
        '/transfer',
        '/wallet'
    ]
}