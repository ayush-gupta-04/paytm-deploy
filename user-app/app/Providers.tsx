'use client'
import { SessionProvider } from "next-auth/react";
import React from 'react';
import { RecoilRoot } from "recoil";

type Children = {
    children : React.ReactNode
}
export default function Providers({children} : Children){
    return(
        <RecoilRoot>
            <SessionProvider>
                {children}
            </SessionProvider>
        </RecoilRoot>
    )
}

