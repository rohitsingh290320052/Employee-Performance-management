// import { useState } from "react";
// import {
//   Container,
//   Box,
//   Typography,
//   TextField,
//   Button,
//   Paper
// } from "@mui/material";
// import api from "@/api/axios";
// import { useAuth } from "@/auth/AuthContext";
// import { useNavigate } from "react-router-dom";

// export default function AdminLogin() {
//   const { login } = useAuth();
//   const navigate = useNavigate();
//   const [data, setData] = useState({ email: "", password: "" });

//   const handleLogin = async () => {
//     try {
//       const res = await api.post("/auth/login", data);
//       login(res.data.token, res.data.user);
//       navigate("/admin-dashboard");
//     } catch (err) {
//       alert("Login failed");
//     }
//   };

//   return (
//     <Container maxWidth="sm">
//       <Paper elevation={3} sx={{ mt: 10, p: 4 }}>
//         <Typography variant="h5" fontWeight="bold" gutterBottom>
//           Admin Login
//         </Typography>
//         <TextField
//           label="Email"
//           fullWidth
//           sx={{ mb: 2 }}
//           onChange={(e) => setData({ ...data, email: e.target.value })}
//         />
//         <TextField
//           label="Password"
//           type="password"
//           fullWidth
//           sx={{ mb: 2 }}
//           onChange={(e) => setData({ ...data, password: e.target.value })}
//         />
//         <Button fullWidth variant="contained" onClick={handleLogin}>
//           Login
//         </Button>
//       </Paper>
//     </Container>
//   );
// }

import { useState } from "react";
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button
} from "@mui/material";
import api from "@/api/axios";
import { useAuth } from "@/auth/AuthContext";
import { useNavigate } from "react-router-dom";

export default function AdminLogin() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [data, setData] = useState({ email: "", password: "" });

  const handleLogin = async () => {
    if (!data.email || !data.password) {
      alert("Please enter both email and password");
      return;
    }

    try {
      console.log("Sending:", data); // for debugging
      const res = await api.post("/auth/login", data);
      login(res.data.token, res.data.user);
      navigate("/admin-dashboard");
    } catch (err) {
      console.error("Login Error:", err.response?.data || err.message);
      alert(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ mt: 10, p: 4 }}>
        <Typography variant="h5" fontWeight="bold" gutterBottom>
          Admin Login
        </Typography>

        <TextField
          label="Email"
          fullWidth
          value={data.email}
          sx={{ mb: 2 }}
          onChange={(e) => setData({ ...data, email: e.target.value })}
        />

        <TextField
          label="Password"
          type="password"
          fullWidth
          value={data.password}
          sx={{ mb: 2 }}
          onChange={(e) => setData({ ...data, password: e.target.value })}
        />

        <Button fullWidth variant="contained" onClick={handleLogin}>
          Login
        </Button>
      </Paper>
    </Container>
  );
}
