
export const SUPPORTED_BANKS = [
    {
        name : "Axis Bank",
        tokenUrl : process.env.NEXT_PUBLIC_BANK_BACKEND_URL+"/api/axis/gettoken",
        bankUrl : process.env.NEXT_PUBLIC_BANK_FRONTEND_URL+"/axis/transfer"
    },
    {
        name : "HDFC Bank",
        tokenUrl : process.env.NEXT_PUBLIC_BANK_BACKEND_URL+"/api/hdfc/gettoken",
        bankUrl : process.env.NEXT_PUBLIC_BANK_FRONTEND_URL+"/hdfc/transfer"
    },
    {
        name : "State Bank of India",
        tokenUrl : process.env.NEXT_PUBLIC_BANK_BACKEND_URL+"/api/sbi/gettoken",
        bankUrl : process.env.NEXT_PUBLIC_BANK_FRONTEND_URL+"/sbi/transfer"
    },
    {
        name : "Bank of India",
        tokenUrl : process.env.NEXT_PUBLIC_BANK_BACKEND_URL+"/api/boi/gettoken",
        bankUrl : process.env.NEXT_PUBLIC_BANK_FRONTEND_URL+"/boi/transfer"
    }
];