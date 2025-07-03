export default function AuthLayout({children} : {children : React.ReactNode}){
    return(
        <div className="h-full w-full bg-[#ECF5FC] flex justify-center items-center">
            {children}
        </div>
    )
}