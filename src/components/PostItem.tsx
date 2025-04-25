import { Link } from "react-router";
import { Post } from "./PostList";

interface Props {
  post: Post;
}

export const PostItem = ({ post }: Props) => {
  return (

<div className="relative group transform transition-transform duration-500 hover:-translate-y-2">
  {/* Gradient Background Glow */}
  <div className="absolute -inset-3 rounded-3xl bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 blur-xl opacity-0 group-hover:opacity-50 transition-opacity duration-700 pointer-events-none" />

  <Link to={`/post/${post.id}`} className="block relative z-10">
    <div className="w-80 bg-[rgb(20,22,28)] border border-[rgb(50,55,70)] rounded-3xl text-white flex flex-col p-6 shadow-2xl transition-all duration-500 group-hover:bg-[rgb(28,32,38)] group-hover:shadow-[0_10px_30px_rgba(0,0,0,0.4)]">
      {/* Header: Avatar and Title */}
      <div className="flex items-center space-x-4">
        <div className="w-12 h-12 rounded-full ring-2 ring-white/30 transition-all duration-300 group-hover:ring-purple-400/50">
          {post.avatar_url ? (
            <img
              src={post.avatar_url}
              alt="User Avatar"
              className="w-12 h-12 rounded-full object-cover"
            />
          ) : (
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#A855F7] to-[#3B82F6] animate-pulse-subtle" />
          )}
        </div>
        <div className="flex-1">
          <div className="text-2xl font-extrabold tracking-tight leading-tight text-gray-100 transition-colors duration-300 group-hover:text-purple-300">
            {post.title}
          </div>
        </div>
      </div>

      {/* Image Banner */}
      <div className="mt-6 flex-1 relative overflow-hidden rounded-2xl">
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <img
          className="w-full h-[300px] object-cover rounded-2xl transition-transform duration-500 group-hover:scale-[1.05]"
          src={post.image_url}
          alt={post.title}
        />
      </div>

      {/* Footer: Metadata */}
      <div className="mt-4 mb-4 flex items-center justify-between text-sm text-gray-400">
       
        <div className="flex items-center space-x-2">
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
          <span>{new Date(post.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
        </div>
      </div>
      <div className="flex justify-around items-center space-x-2 sm:space-x-4 px-2 sm:px-4">
    {/* Like Button */}
    <button
        className="flex items-center justify-center h-10 w-16 sm:w-20 px-2 sm:px-3 bg-gray-800/50 border border-gray-700/50 rounded-lg shadow-sm hover:bg-gray-700/50 hover:shadow-md active:scale-95 transition-all duration-200 cursor-pointer"
        onClick={() => console.log("Like clicked")} // Replace with actual like handler
    >
        <span className="text-lg sm:text-xl text-blue-400">❤️</span>
        <span className="ml-1 sm:ml-2 text-sm sm:text-base font-semibold text-gray-200">
            {post.like_count ?? 0}
        </span>
    </button>

    {/* Comment Button */}
    <button
        className="flex items-center justify-center h-10 w-16 sm:w-20 px-2 sm:px-3 bg-gray-800/50 border border-gray-700/50 rounded-lg shadow-sm hover:bg-gray-700/50 hover:shadow-md active:scale-95 transition-all duration-200 cursor-pointer"
        onClick={() => console.log("Comment clicked")} // Replace with actual comment handler
    >
        <span className="text-lg sm:text-xl text-purple-400">💬</span>
        <span className="ml-1 sm:ml-2 text-sm sm:text-base font-semibold text-gray-200">
            {post.comment_count ?? 0}
        </span>
    </button>
</div>
    </div>
  </Link>
</div>



  );
};