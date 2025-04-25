import { useState } from "react";
import { supabase } from "../supbase-client";
import { Comment } from "./CommentSection"
import { useAuth } from "../context/authContext";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface Props{
    comment:Comment & {
        children?:Comment[];
    };
    postId:number
}

const createReply=async(replyContent:string,postId:number,parentCommentId:number,userId:string,author:string,avatarUrl?:string)=>{
    if(!userId || !author){
        throw new Error("You must logged in to reply")
    }
    const {error}=await supabase.from("comments").insert({
        post_id:postId,
        content:replyContent,
        parent_comment_id:parentCommentId,
        user_id:userId,
        author:author,
        avatar_url:avatarUrl || ""
    })
if(error) throw new Error(error.message)
    }


export const CommentItem=({comment,postId}:Props)=>{
    const [showReply,setShowReply]=useState<boolean>(false)
    const [replyText,setReplyText]=useState<string>("")
    const [isCollapsed,setIsCollapsed]=useState<boolean>(false)
    const{user}=useAuth()
    const queryClient=useQueryClient()

    const {mutate,isPending,isError}=useMutation({
        mutationFn:(replyContent:string)=>{
            if(!user) throw new Error("User not authenticated")
            return createReply(replyContent,postId,comment.id,user?.id,user?.user_metadata?.user_name,user?.user_metadata?.avatar_url)},
        onSuccess:()=>{
            queryClient.invalidateQueries({queryKey:["comments",postId]})
            setReplyText("")
            setShowReply(false)
        }
    })

    const handleReplySubmit=(e:React.FormEvent)=>{
        e.preventDefault()
        if(!replyText) return 
        mutate(replyText)
    }

    return(
        <div className="flex items-start space-x-1
         p-3 md:p-6 bg-gray-800/70 rounded-lg border border-gray-700/50 shadow-sm hover:shadow-md transition-shadow duration-300">
        {/* User profile picture */}
        <div className="flex-shrink-0">
          {comment.avatar_url ? (
            <img
              src={comment.avatar_url}
              alt={`${comment.author}'s profile`}
              className="w-8 h-8 md:w-10 md:h-10 mr-1 rounded-full object-cover border border-gray-600/50 hover:scale-105 transition-transform duration-200"
            />
          ) : (
            <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white text-xs md:text-sm font-semibold">
              {comment.author[0].toUpperCase()}
            </div>
          )}
          {/* Fallback div for image error */}
          <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white text-xs md:text-sm font-semibold hidden">
            {comment.author[0].toUpperCase()}
          </div>
        </div>
        <div className="flex-1">
          {/* Comment header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between">
            <div className="flex flex-col md:flex-row md:items-center md:space-x-2">
              <span className="text-sm md:text-base font-semibold text-purple-400 tracking-wide">{comment.author}</span>
              <span className="text-xs md:text-sm text-gray-400 font-medium">
                {new Date(comment.created_at).toLocaleString()}
              </span>
            </div>
          </div>
  
          {/* Comment content */}
          <p className="mt-2 text-gray-200 text-sm md:text-base leading-relaxed">{comment.content}</p>
  
          {/* Reply button */}
          <button
            className="mt-2 text-blue-400 text-sm md:text-base font-medium hover:text-blue-300 transition-colors duration-200 flex items-center space-x-1"
            onClick={() => setShowReply((prev) => !prev)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 md:h-5 md:w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"
              />
            </svg>
            <span>{showReply ? "Cancel" : "Reply"}</span>
          </button>
  
          {/* Reply form */}
          {showReply && user && (
            <div className="mt-3 bg-gray-900/70 p-3 md:p-4 rounded-lg border border-gray-700/50">
              <textarea
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="Write your reply..."
                className="w-full bg-gray-800/70 text-gray-200 border border-gray-600/50 rounded-md p-2 md:p-3 text-sm md:text-base focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none transition-all duration-200"
                rows={3}
              />
              <div className="flex items-center justify-between mt-2 md:mt-3">
                <button
                  onClick={handleReplySubmit}
                  className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-3 py-1.5 md:px-4 md:py-2 rounded-md text-xs md:text-sm font-medium hover:from-purple-600 hover:to-blue-600 transition-all duration-200 disabled:opacity-50"
                  disabled={isPending}
                >
                  {isPending ? "Posting..." : "Post Reply"}
                </button>
                {isError && (
                  <p className="text-red-400 text-xs md:text-sm font-medium">
                    Error posting reply
                  </p>
                )}
              </div>
            </div>
          )}
  
          {/* Child comments */}
          {comment.children && comment.children.length > 0 && (
            <div className="mt-3">
              <button
                onClick={() => setIsCollapsed((prev) => !prev)}
                className="text-gray-400 hover:text-gray-200 transition-colors duration-200 flex items-center space-x-1"
                title={isCollapsed ? "Show Replies" : "Hide Replies"}
              >
                {isCollapsed ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    className="w-4 h-4 md:w-5 md:h-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    className="w-4 h-4 md:w-5 md:h-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 15l7-7 7 7"
                    />
                  </svg>
                )}
                <span className="text-sm md:text-base font-medium">
                  {isCollapsed
                    ? `Show ${comment.children.length} Replies`
                    : "Hide Replies"}
                </span>
              </button>
              {!isCollapsed && (
                <div className="mt-2 space-y-2 md:ml-4 md:space-y-3 md:border-l md:border-gray-700/50 md:pl-4">
                  {comment.children.map((child, key) => (
                    <CommentItem key={key} comment={child} postId={postId} />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    )

}