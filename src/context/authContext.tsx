import { User } from "@supabase/supabase-js"
import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../supbase-client";



interface AuthContextType{
    user:User | null;
    signInWithGitHub:()=>void
    signInWithGoogle:()=>void
    signOut:()=>void
}

const AuthContext=createContext<AuthContextType|undefined>(undefined)
export const AuthProvider=({children}:{children:React.ReactNode})=> {
    const [loading,setLoading]=useState(true)
    const [user,setUser]=useState<User | null >(null)

    useEffect(()=>{
        //get current session
        supabase.auth.getSession().then(({data:{session}})=>{
            setUser(session?.user ?? null)
            setLoading(false)
        })
        //to handle the auth change
        const {data:listener}=supabase.auth.onAuthStateChange((_,session)=>{
            setUser(session?.user ?? null)
            setLoading(false)
        })
        return()=>{
            listener?.subscription.unsubscribe()
        }
    },[])

    const signInWithGitHub=()=>{
        supabase.auth.signInWithOAuth({provider:"github"})
    }
    const signInWithGoogle=()=>{
        supabase.auth.signInWithOAuth({provider:"google"})
    }

    
      

    const signOut=()=>{
        supabase.auth.signOut()
    }
    if(loading){
        return <div className="text-center">Loading...</div>;
      }
  return (
    <AuthContext.Provider value={{user,signInWithGitHub,signOut,signInWithGoogle}}>
    {" "}
    {children}{" "}
    </AuthContext.Provider>
  )
}

export const useAuth=():AuthContextType=>{
    const context=useContext(AuthContext)
    if(context===undefined){
        throw new Error("useAuth must be used within the AuthProvider")
    }
    return context
}
