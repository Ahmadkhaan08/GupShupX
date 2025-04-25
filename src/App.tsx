import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Navbar from "./components/Navbar";
import { CreatePostPage } from "./pages/CreatePostPage";
import { PostPage } from "./pages/PostPage";
import { CreateCommunityPage } from "./pages/CreateCommunityPage";
import { CommunitiesPage } from "./pages/CommunitiesPage";
import { CommunityPage } from "./pages/CommunityPage";
import  { Login } from "./pages/Login";
import { ProtectedRoute } from "./components/ProtectedRoute";
function App() {
  return (
    <div className="min-h-screen bg-black text-gray-100 transition-opacity duration-700 pt-10">
      <Navbar />
      <div className="container mx-auto px-4 py-6">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />
          <Route
            path="/create"
            element={
              <ProtectedRoute>
                <CreatePostPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/post/:id"
            element={
              <ProtectedRoute>
                <PostPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/communities/create"
            element={
              <ProtectedRoute>
                <CreateCommunityPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/community"
            element={
              <ProtectedRoute>
                <CommunitiesPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/community/:id"
            element={
              <ProtectedRoute>
                <CommunityPage />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
    </div>
  );
}

export default App;
