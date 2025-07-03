import { PrismaClient } from "@prisma/client";
import express from "express"
import crypto, { randomUUID } from "crypto"
const app = express();
app.use(express.json())

const prisma = new PrismaClient();
app.post('/api/hdfc/gettoken',async (req,res) => {
    const token = crypto.randomUUID();
    //this amount is already *100
    const {amount,webhookUrl,userId } = req.body;
    try {
        await prisma.hdfcBankTnx.create({
            data : {
                id : randomUUID(),
                token : token,
                tokenExpiry : Date.now() + 5*60000 + "",
                amount : amount,
                webhookUrl : webhookUrl,
                userId : userId
            }
        })
        res.json({
            token : token
        })
    } catch (error) {
        res.status(400).send("Error in DB!")
        console.log(error);
    }
})

app.get('/' , (req,res) => {
    res.send({
        message : "Bank Backend Api working !"
    })
})
app.listen(3002,() => {console.log("Bank Backend Started")})