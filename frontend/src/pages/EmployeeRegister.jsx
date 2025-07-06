import { useState } from "react";
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
} from "@mui/material";
import api from "@/api/axios";
import { useNavigate } from "react-router-dom";

export default function EmployeeRegister() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const navigate = useNavigate();

  const handleRegister = async () => {
    try {
      await api.post("/auth/register-employee", form);
      alert("Registration successful");
      navigate("/employee-login");
    } catch (err) {
      alert("Registration failed");
    }
  };

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ mt: 10, p: 4 }}>
        <Typography variant="h5" gutterBottom>
          Employee Registration
        </Typography>
        <TextField
          label="Name"
          fullWidth
          sx={{ mb: 2 }}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <TextField
          label="Email"
          fullWidth
          sx={{ mb: 2 }}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        <TextField
          label="Password"
          type="password"
          fullWidth
          sx={{ mb: 2 }}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />
        <Button fullWidth variant="contained" onClick={handleRegister}>
          Register
        </Button>
      </Paper>
    </Container>
  );
}
