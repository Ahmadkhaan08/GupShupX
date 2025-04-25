import { ChangeEvent, useState } from "react";
import { supabase } from "../supbase-client";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useAuth } from "../context/authContext";
import { useNavigate } from "react-router";
import { fetchCommunities } from "./CommunityList";

interface PostInput {
  title: string
  content: string
  avatar_url: string | null
  community_id?:number | null
}

const createPost = async (post: PostInput, imageFile: File) => {
  const filePath = `${post.title}-${Date.now()}-${imageFile.name}`;
  const { error: uploadError } = await supabase.storage
    .from("post-img")
    .upload(filePath, imageFile);
  if (uploadError) throw new Error(uploadError.message);

  const { data: publicURLData } = supabase.storage
    .from("post-img")
    .getPublicUrl(filePath);

  const { data, error } = await supabase
    .from("posts")
    .insert({ ...post, image_url: publicURLData.publicUrl });
  if (error) throw new Error(error.message);

  return data;
};

export const CreatePost = () => {
  const [title, setTitle] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [communityId, setCommunityId] = useState<number | null>(null);
  const navigate = useNavigate();

  const { user } = useAuth();


  const {data:communities}=useQuery({
    queryKey:["communities"],
    queryFn:fetchCommunities
  })

  const { mutate, isPending, isError } = useMutation({
    mutationFn: (data: { post: PostInput; imageFile: File }) => {
      return createPost(data.post, data.imageFile);
    },
    onSuccess: () => {
      navigate("/");
    },
  });

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!selectedFile) return;
    mutate({
      post: {
        title,
        content,
        avatar_url: user?.user_metadata.avatar_url || null,
        community_id:communityId
      }, 
      imageFile: selectedFile,
    });
  };


  const handleCommunityChange=(e:ChangeEvent<HTMLSelectElement>)=>{
    const value=e.target.value
    setCommunityId(value? Number(value):null)
  }
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="bg-gray-800 bg-opacity-90 backdrop-blur-md rounded-2xl shadow-xl p-8 w-full max-w-2xl border border-purple-500 space-y-6">
          <h2 className="text-3xl font-bold text-center mb-6 bg-gradient-to-r from-purple-400 to-blue-500 text-transparent bg-clip-text">
            Create a New Post
          </h2>
          <div>
            <label
              className="block text-sm font-medium text-gray-300 mb-2"
              htmlFor="title"
            >
              Title
            </label>
            <input
              type="text"
              id="title"
              value={title}
              required
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-3 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300"
              placeholder="Enter post title"
            />
          </div>
          <div>
            <label
              className="block text-sm font-medium text-gray-300 mb-2"
              htmlFor="content"
            >
              Content
            </label>
            <textarea
              id="content"
              value={content}
              required
              onChange={(e) => setContent(e.target.value)}
              rows={5}
              className="w-full p-3 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300"
              placeholder="Write your post content"
            />
          </div>
          <div>
      <label className="block text-sm p-2 font-medium text-gray-300 mb-2" htmlFor="community">
        Select Community
      </label>
      <select
        id="community"
        onChange={handleCommunityChange}
        className="w-full p-3 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300"
      >
        <option value=""> -- Choose a Community -- </option>
        {communities?.map((community, key) => (
          <option value={community.id} key={key}>
            {community.name}
          </option>
        ))}
      </select>
    </div>
          <div>
            <label
              className="block text-sm font-medium text-gray-300 mb-2"
              htmlFor="image"
            >
              Upload Image
            </label>
            <input
              type="file"
              id="image"
              accept="image/*"
              onChange={handleFileChange}
              required
              className="w-full text-gray-200 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-purple-600 file:text-white hover:file:bg-purple-700 transition-all duration-300"
            />
          </div>
          <button
            disabled={isPending}
            className={`w-full py-3 rounded-lg font-semibold text-white transition-all duration-300 ${
              isPending
                ? "bg-gray-600 cursor-not-allowed"
                : "bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
            }`}
          >
            {isPending ? "Creating..." : "Create Post"}
          </button>
          {isError && (
            <p className="text-red-400 text-center text-sm">
              Error creating post.
            </p>
          )}
        </div>
      </div>
    </form>
  );
};
