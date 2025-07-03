export default function Button1({loading,text} : {loading : boolean,text : string}){
    return(
        <button className = {`rounded-md text-white w-full py-3 ${loading?"bg-[#4E8FFF]":"bg-[#0560FD] hover:bg-[#0045BD]"} active:scale-95 transition-all`}
            disabled = {loading}>
            {loading?"Loading...":text}
        </button>
    )
}