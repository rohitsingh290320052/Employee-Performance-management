import { useState } from "react";
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
} from "@mui/material";
import api from "@/api/axios";
import { useAuth } from "@/auth/AuthContext";
import { useNavigate } from "react-router-dom";

export default function EmployeeLogin() {
  const [data, setData] = useState({ email: "", password: "" });
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await api.post("/auth/login", data);
      login(res.data.token, res.data.user);
      navigate("/employee-dashboard");
    } catch (err) {
      alert("Invalid credentials");
    }
  };

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ mt: 10, p: 4 }}>
        <Typography variant="h5" gutterBottom>
          Employee Login
        </Typography>
        <TextField
          label="Email"
          fullWidth
          sx={{ mb: 2 }}
          onChange={(e) => setData({ ...data, email: e.target.value })}
        />
        <TextField
          label="Password"
          type="password"
          fullWidth
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
