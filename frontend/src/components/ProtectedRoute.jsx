import { Navigate } from "react-router-dom";
import { useAuth } from "@/auth/AuthContext";

export default function ProtectedRoute({ children, role }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/" />;
  if (role && user.role !== role) return <Navigate to="/" />;
  return children;
}
