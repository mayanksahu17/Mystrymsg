import { NextAuthOptions } from "next-auth";
import CredencialProvider from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";



export const authOptions : NextAuthOptions = {
    providers : [
        CredencialProvider({
            id : "credencials",
            name : "Credencials",
            credentials: {
                email: { label: "Email", type: "text", placeholder: "jsmith" },
                password: { label: "Password", type: "password" }
              },
              async authorize(credencials : any):Promise<any>{
                await dbConnect()
                try {
                    const user = await UserModel.findOne({
                        $or : [
                            {email : credencials.identifier},
                            {username : credencials.identifier}
                        ]
                    })
                    if(!user){
                        throw new Error("No user found with this email")
                    }
                    if (!user.isVerified) {
                        throw new Error("Please verify your account first")
                    }
                    const isPasswordCorrect = await bcrypt.compare(credencials.password, user.password)
                    if (isPasswordCorrect) {
                        return user
                    }else{
                        throw new Error("Incorrect password")

                    }
                } catch (error : any) {
                    throw new Error(error)
                }
              }
        })
    ]
}