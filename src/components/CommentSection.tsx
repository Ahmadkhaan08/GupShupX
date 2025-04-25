import { useState } from "react";
import { supabase } from "../supbase-client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../context/authContext";
import { CommentItem } from "./CommentItem";

interface Props {
  postId: number;
}

interface NewComment {
  content: string;
  parent_comment_id?: string | null;
}

export interface Comment {
  id: number;
  post_id: number;
  parent_comment_id: number | null;
  content: string;
  user_id: string;
  created_at: string;
  author: string;
  avatar_url: string;
}

const createComment = async (
  newComment: NewComment,
  postId: number,
  userId?: string,
  author?: string,
  avatarUrl?:string
) => {
  if (!userId || !author) {
    throw new Error("You must logged in to comment.");
  }

  // //fetch the profile pic
  // const{data:postData ,error:postError}=await supabase.from("posts").select("avatar_url").eq("post_id",postId).single()
  // if(postData|| !postError) throw new Error("Could not fetch post's profile picture.")

  const { error } = await supabase.from("comments").insert({
    post_id: postId,
    user_id: userId,
    content: newComment.content,
    author: author,
    parent_comment_id: newComment.parent_comment_id || null,
    avatar_url:avatarUrl || "",
  }).select().single();
  if (error) throw new Error(error.message);
};

const fetchComments = async (postId: number): Promise<Comment[]> => {
  const { data, error } = await supabase
    .from("comments")
    .select("*")
    .eq("post_id", postId)
    .order("created_at", { ascending: true });
  if (error) throw new Error(error.message);
  return data as Comment[];
};
export const CommentSection = ({ postId }: Props) => {
  const [newCommentText, setNewCommentText] = useState<string>("");
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const {
    data: comments,
    isLoading,
    error,
  } = useQuery<Comment[], Error>({
    queryKey: ["comments", postId],
    queryFn: () => fetchComments(postId),
    refetchInterval: 5000,
  });

  const { mutate, isPending, isError } = useMutation({
    mutationFn: (newComment: NewComment) =>
      createComment(
        newComment,
        postId,
        user?.id,
        user?.user_metadata?.user_name,
        user?.user_metadata?.avatar_url
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", postId] });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentText) return;
    mutate({ content: newCommentText, parent_comment_id: null });
    setNewCommentText("");
  };
  /* Map of Comments - Organize Replies - Return Tree  */
  const buildCommentTree = (
    flatComments: Comment[]
  ): (Comment & { children: Comment[] })[] => {
    const map = new Map<number, Comment & { children: Comment[] }>();
    const roots: (Comment & { children: Comment[] })[] = [];

    // Step 1: Add all comments to the map with empty children
    flatComments.forEach((comment) => {
      map.set(comment.id, { ...comment, children: [] });
    });

    // Step 2: Build the tree
    flatComments.forEach((comment) => {
      const mappedComment = map.get(comment.id)!;

      if (comment.parent_comment_id) {
        const parent = map.get(comment.parent_comment_id);
        if (parent) {
          parent.children.push(mappedComment);
        } else {
          // If parent not found, treat as root
          roots.push(mappedComment);
        }
      } else {
        // Top-level comment
        roots.push(mappedComment);
      }
    });

    return roots;
  };

  if (isLoading) {
    return <div> Loading comments...</div>;
  }

  if (error) {
    return <div> Error: {error.message}</div>;
  }

  const commentTree = comments ? buildCommentTree(comments) : [];
  return (
    <div className="mt-6">
      <h2 className="text-2xl font-semibold mb-4">Comments</h2>
      {user ? (
        <form onSubmit={handleSubmit} className="mb-4">
          <textarea
            value={newCommentText}
            onChange={(e) => setNewCommentText(e.target.value)}
            placeholder="Write your comment....."
            className="w-full border border-white/10 bg-transparent p-2 rounded"
            rows={3}
          ></textarea>
          <button
            type="submit"
            className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-2 rounded-md text-sm font-medium hover:from-blue-600 hover:to-purple-600 transition-all duration-200 disabled:opacity-50"
          >
            {isPending ? "Posting" : "Post Comment"}
          </button>
          {isError && (
            <p className="text-red-500 mt-2">Error in posting comment</p>
          )}
        </form>
      ) : (
        <p className="mb-4 text-gray-600">
          You must be logged in to post a comment
        </p>
      )}

      {/* Comment display section */}
      <div className="space-y-4">
        {commentTree.map((comment, key) => (
          <CommentItem key={key} comment={comment} postId={postId} />
        ))}
      </div>
    </div>
  );
};
