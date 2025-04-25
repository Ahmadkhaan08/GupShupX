import {  useQuery } from "@tanstack/react-query";
import { supabase } from "../supbase-client";
import { Post } from "./PostList";
import { LikeButton } from "./LikeButton";
import { CommentSection } from "./CommentSection";

interface Props {
  postId: number;
}

const fetchPostById = async (id: number): Promise<Post> => {
  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .eq("id", id)
    .single();
  if (error) throw new Error(error.message);
  return data as Post;
};
export const PostDetails = ({ postId }: Props) => {
  const { data, isLoading, error } = useQuery<Post, Error>({
    queryKey: ["post", postId],
    queryFn: () => fetchPostById(postId),
  });
  if (isLoading) {
    return <div>Loading posts....</div>;
  }
  if (error) {
    return <div>Error:{error.message}</div>;
  }
  return (
<div className="max-w-6xl mx-auto py-12 px-6">
  {/* Title */}
  <h2 className="mt-0 mb-6 text-5xl md:text-6xl font-extrabold text-center bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text  text-transparent transition-all duration-500 ease-in-out animate-fade-in">
    {data?.title}
  </h2>

  {/* Main Content */}
  <div className="flex flex-col md:flex-row gap-8">
    {/* Left Side: Image */}
    <div className="flex-1 flex flex-col items-center">
      {data?.image_url && (
        <div className="relative group overflow-hidden rounded-3xl shadow-xl transform transition-transform duration-500 hover:scale-[1.02]">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-indigo-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <img
            src={data.image_url}
            alt={data?.title}
            className="w h-[400px] md:h-[500px] object-cover rounded-3xl"
          />
        </div>
      )}
    </div>

    {/* Right Side: Content and Date */}
    <div className="flex-1 flex flex-col space-y-6">
      <p className="text-gray-300 text-lg leading-relaxed font-medium bg-[rgb(24,27,32)] p-6 rounded-2xl shadow-lg transition-all duration-300 hover:bg-[rgb(30,34,40)]">
        {data?.content}
      </p>
      <div className="flex items-center space-x-3 text-sm text-gray-500">
        <LikeButton postId={postId}/>
        <svg
          className="w-5 h-5 text-purple-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
        <span>
          Posted on: {new Date(data!.created_at).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </span>
      </div>
      <div className="flex justify-center items-center py-8 ">
      <h2 className="text-5xl font-semibold p-8 rounded-4xl bg-gradient-to-r from-blue-500 to-purple-500 text-white  hover:from-blue-600 hover:to-purple-600 transition-all duration-200 disabled:opacity-50 bouncing-text">
        Leave your comment below
      </h2>
      
    </div>
    </div>

  </div>
  <CommentSection postId={postId}/>

</div>

  );
};
