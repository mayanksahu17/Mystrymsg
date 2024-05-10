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
                email: { label: "Em9ail", type: "text", placeholder: "jsmith" },
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
                        return user;
                    }else{
                        throw new Error("Incorrect password")

                    }
                } catch (error : any) {
                    throw new Error(error)
                }
              }
        })
    ],
    callbacks : {
        async session({ session, token }) {
            if(token){
                session.user._id = token._id
                session.user.isVerified = token.isVerified
                session.user.isAcceptingMessages = token.isAcceptingMessages
                session.user.username = token.username
            }
            return session
          },
          async jwt({ token, user }) {
            if (user) {
                token._id = user._id?.toString()
                token.isVerified = user.isVerified
                token.isAcceptingMessages = user.isAcceptingMessages;
                token.username = user.username
            }
            return token
          }
    
    },
    pages : {
      signIn : "/sign-in"  
    },
    session : {
        strategy : "jwt"
    },
    secret : process.env.NEXTAUTH_SECRET,
}