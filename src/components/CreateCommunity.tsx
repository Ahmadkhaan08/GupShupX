import { useMutation, useQueryClient } from "@tanstack/react-query"
import { supabase } from "../supbase-client"
import { useNavigate } from "react-router"
import { useState } from "react"


interface CommunityInput{
    name:string
    description:string
}

const createCommunity=async(community:CommunityInput)=>{
const {data,error}=await supabase.from("communities").insert(community)
if(error) throw new Error(error.message)
    return data
}


export const CreateCommunity=()=>{
    const [name,setName]=useState<string>("")
    const [description,setDescription]=useState<string>("")
    const navigate=useNavigate()
    const queryClient=useQueryClient()

    const {mutate,isPending,isError}=useMutation({
        mutationFn:createCommunity,
        onSuccess:()=>{
            queryClient.invalidateQueries({queryKey:["communities"]})
            navigate("/communities")
        }
    })

    const handleSubmit=(e:React.FormEvent)=>{
        e.preventDefault()
        mutate({name,description})

    }

    return (
        <form onSubmit={handleSubmit}>

        <div className="min-h-screen flex items-center justify-center ">
        <div className="bg-gray-800 bg-opacity-90 backdrop-blur-md rounded-2xl shadow-xl p-8 w-full max-w-md border border-purple-500">
            <h2 className="text-3xl font-bold text-center mb-6 bg-gradient-to-r from-purple-400 to-blue-500 text-transparent bg-clip-text">
                Create a New Community
            </h2>
            <div className="space-y-6">
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2" htmlFor="name">
                        Community Name
                    </label>
                    <input
                        type="text"
                        id="name"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full p-3 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300"
                        placeholder="Enter community name"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2" htmlFor="description">
                        Description
                    </label>
                    <textarea
                        id="description"
                        required
                        rows={3}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="w-full p-3 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300"
                        placeholder="Describe your community"
                    />
                </div>
                <button
                    disabled={isPending}
                    className={`w-full py-3 rounded-lg font-semibold text-white transition-all duration-300 ${
                        isPending
                            ? 'bg-gray-600 cursor-not-allowed'
                            : 'bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600'
                    }`}
                >
                    {isPending ? 'Creating...' : 'Create Community'}
                </button>
                {isError && (
                    <p className="text-red-400 text-center text-sm">
                        Error in Creating Community
                    </p>
                )}

            </div>
        </div>
    </div>
    </form>

    )
}