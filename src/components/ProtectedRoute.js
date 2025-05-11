import { useEffect, useState } from "react";
import { Route, Navigate, useNavigate } from "react-router-dom";
import { getCurrentUser } from "../services/authService";

const ProtectedRoute = ({ element }) => {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const checkUser = async () => {
      const userData = await getCurrentUser();
      setUser(userData);
      setLoading(false);

      if (userData) {
        // Redirect based on account type
        if (userData.accountType === "private") {
          navigate("/dashboard/personal");
        } else if (userData.accountType === "organization") {
          navigate("/dashboard");
        }
      }
    };

    checkUser();
  }, [navigate]);

  if (loading) return <div>Loading...</div>;

  return user ? element : <Navigate to="/login" />;
};

export default ProtectedRoute;
