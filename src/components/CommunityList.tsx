import { useQuery } from "@tanstack/react-query";
import { supabase } from "../supbase-client";
import { Link } from "react-router";

export interface Community {
  id: number;
  name: string;
  description: string;
  created_at: string;
}

export const fetchCommunities = async (): Promise<Community[]> => {
  const { data, error } = await supabase
    .from("communities")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);

  return data as Community[];
};

export const CommunityList = () => {
  const { data, error, isLoading } = useQuery<Community[], Error>({
    queryKey: ["communities"],
    queryFn: fetchCommunities,
  });
  if (isLoading) {
    return <div className="text-center py-4">Loading communities...</div>;
  }
  if (error) {
    return (
      <div className="text-center text-red-500 py-4">
        Error: {error.message}
      </div>
    );
  }
  
  return (
    <div className="min-h-screen  p-4">
      <h2 className="text-5xl sm:text-6xl font-bold mb-8 text-center bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">Communities
      </h2>
      <div className="max-w-5xl mx-auto">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          
          {data?.map((community) => {
            return (
              <div
                key={community.id}
                className="bg-gray-800 bg-opacity-90 backdrop-blur-md rounded-xl shadow-lg p-6 border border-purple-500/30 hover:border-purple-500 transition-all duration-300 hover:shadow-xl hover:scale-105"
              >
                <Link
                  to={`/community/${community.id}`}
                  className="text-xl font-semibold bg-gradient-to-r from-purple-400 to-blue-500 text-transparent bg-clip-text hover:from-purple-500 hover:to-blue-600 transition-all duration-300"
                >
                  {community.name}
                </Link>
                <div className="mt-3 text-gray-300 text-sm leading-relaxed">
                  {community.description}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
