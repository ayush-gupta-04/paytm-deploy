import zod from "zod";

export const signinSchema = zod.object({
    email : zod.string().email(),
    password : zod.string().min(8,{message : "Password should be min of 8 characters"})
})

export type SigninFormat = zod.infer<typeof signinSchema>;
