import { useEffect, useState } from "react";
import api from "@/api/axios";
import {
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  Box,
  Chip,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

export default function EmployeeDashboard() {
  const [tasks, setTasks] = useState([]);
  const [proofs, setProofs] = useState({}); // Track proof inputs per task

  // Load tasks on mount
  useEffect(() => {
    api.get("/employee/tasks").then((res) => setTasks(res.data));
  }, []);

  // Handle proof text input
  const handleProofChange = (taskId, value) => {
    setProofs((prev) => ({ ...prev, [taskId]: value }));
  };

  // Handle status update
  const markCompleted = async (taskId) => {
    const proof = proofs[taskId] || "";

    try {
      await api.put("/employee/update-task", {
        taskId,
        status: "Completed",
        proof,
      });
      
     

      // Update frontend state
      setTasks((prev) =>
        prev.map((t) =>
          t._id === taskId ? { ...t, status: "Completed", proof } : t
        )
      );
    } catch (err) {
      console.error("Update failed:", err);
      alert("❌ Failed to update task");
    }
  };

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom>
        Employee Dashboard
      </Typography>

      {tasks.map((t) => (
        <Card key={t._id} sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6">{t.title}</Typography>
            <Typography sx={{ mb: 1 }}>{t.description}</Typography>

            <Chip
              label={t.status}
              color={t.status === "Completed" ? "success" : "warning"}
              icon={t.status === "Completed" ? <CheckCircleIcon /> : undefined}
              sx={{ mb: 1 }}
            />

            <Typography variant="body2" sx={{ mb: 2 }}>
              Due: {new Date(t.dueDate).toLocaleDateString()}
            </Typography>

            {/* Show proof input and button if not completed */}
            {t.status !== "Completed" && (
              <>
                <TextField
                  placeholder="Proof link (image or URL)"
                  fullWidth
                  size="small"
                  sx={{ mb: 1 }}
                  value={proofs[t._id] || ""}
                  onChange={(e) => handleProofChange(t._id, e.target.value)}
                />
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => markCompleted(t._id)}
                >
                  Mark Completed
                </Button>
              </>
            )}

            {/* Show proof if available */}
            {t.status === "Completed" && t.proof && (
              <Typography sx={{ mt: 2 }}>
                ✅ Proof:{" "}
                <a href={t.proof} target="_blank" rel="noreferrer">
                  View
                </a>
              </Typography>
            )}
          </CardContent>
        </Card>
      ))}
    </Box>
  );
}
