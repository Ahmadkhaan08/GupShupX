import { Github} from "lucide-react";
import { Link, Navigate } from "react-router";
import { useAuth } from "../context/authContext";

export const Login = () => {
const {user,signInWithGitHub,signInWithGoogle}=useAuth()
if(user){
    return <Navigate to="/"/>
}
  return (
    <section className="py-20">
    <div className="container mx-auto px-4">
      <div className="flex flex-col md:flex-row items-center">
        {/* Left side - App info */}
        <div className="w-full md:w-1/2 mb-10 md:mb-0 md:pr-10">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Connect. Share. <span className="text-[#7c5dfa]">Thrive.</span>
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            GupShupX is the next generation social platform where communities flourish and ideas spread. Share your
            thoughts, connect with like-minded people, and build your digital presence.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              to="#features"
              className="px-6 py-3 bg-[#7c5dfa] text-white rounded-md font-medium text-center hover:bg-[#6a4fe6] transition-colors"
            >
              Explore Features
            </Link>
            <Link
              to="#about"
              className="px-6 py-3 border border-[#7c5dfa] text-[#7c5dfa] rounded-md font-medium text-center hover:bg-[#7c5dfa]/10 transition-colors"
            >
              Learn More
            </Link>
          </div>
        </div>



        {/* Right side - Login options */}
        <div className="w-full md:w-1/2">
          <div className="bg-gray-900 p-8 rounded-xl shadow-lg max-w-md mx-auto">
            <h3 className="text-2xl font-bold mb-6 text-center">Join GupShupX Today</h3>
            <div className="space-y-4">
              <button onClick={signInWithGitHub} className="w-full flex items-center justify-center gap-2 bg-white text-gray-900 py-3 px-4 rounded-md font-medium hover:bg-gray-100 transition-colors">
                <Github size={20} />
                <span>Continue with GitHub</span>
              </button>
              <button onClick={signInWithGoogle} className="w-full flex items-center justify-center gap-2 bg-white text-gray-900 py-3 px-4 rounded-md font-medium hover:bg-gray-100 transition-colors">
                <div className="w-5 h-5 relative">
                  <svg viewBox="0 0 24 24" width="20" height="20">
                    <path
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      fill="#4285F4"
                    />
                    <path
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      fill="#34A853"
                    />
                    <path
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      fill="#FBBC05"
                    />
                    <path
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      fill="#EA4335"
                    />
                  </svg>
                </div>
                <span>Continue with Google</span>
              </button>
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-700"></div>
                </div>
               
              </div>
              
            </div>
            <p className="text-sm text-gray-400 mt-6 text-center">
              By signing up, you agree to our Terms of Service and Privacy Policy
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>
  );
};
