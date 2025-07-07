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
  Stack,
  Link,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

export default function EmployeeDashboard() {
  const [tasks, setTasks] = useState([]);
  const [proofs, setProofs] = useState({});

  // Fetch tasks on mount
  useEffect(() => {
    api.get("/employee/tasks").then((res) => setTasks(res.data));
  }, []);

  const handleProofChange = (taskId, value) =>
    setProofs((prev) => ({ ...prev, [taskId]: value }));

  const getPriorityColor = (priority) =>
    priority === "High"
      ? "#ef4444"
      : priority === "Medium"
      ? "#facc15"
      : "#22c55e";

  const markCompleted = async (taskId) => {
    const proof = proofs[taskId] || "";
    try {
      await api.put("/employee/update-task", {
        taskId,
        status: "Completed",
        proof,
      });

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
    <Box sx={{ pt: "80px", px: 4 }}>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        📋 My Tasks
      </Typography>

      {tasks.map((t) => (
        <Card
          key={t._id}
          sx={{
            mb: 4,
            borderRadius: 3,
            backgroundColor: "#fff", // ✅ white background
            color: "#1e293b", // dark text for contrast
            borderLeft: `6px solid ${getPriorityColor(t.priority)}`,
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
            transition: "transform 0.25s ease",
            "&:hover": { transform: "translateY(-4px)" },
          }}
        >
          <CardContent>
            {/* Title + Priority */}
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              mb={1}
            >
              <Typography variant="h6" fontWeight="600">
                {t.title}
              </Typography>
              <Chip
                label={t.priority}
                sx={{
                  bgcolor: getPriorityColor(t.priority),
                  color: "#fff",
                  fontWeight: 600,
                }}
              />
            </Stack>

            {/* Description */}
            <Typography sx={{ mb: 1 }}>{t.description}</Typography>

            {/* Status */}
            <Chip
              label={t.status}
              color={t.status === "Completed" ? "success" : "warning"}
              icon={t.status === "Completed" ? <CheckCircleIcon /> : undefined}
              sx={{ mb: 1 }}
            />

            {/* Due date */}
            <Typography variant="body2" sx={{ mb: 2 }}>
              Due: {new Date(t.dueDate).toLocaleDateString()}
            </Typography>

            {/* If not completed: show input + button */}
            {t.status !== "Completed" && (
              <>
                <TextField
                  placeholder="Proof link (image or URL)"
                  fullWidth
                  size="small"
                  value={proofs[t._id] || ""}
                  onChange={(e) => handleProofChange(t._id, e.target.value)}
                  sx={{ mb: 1 }}
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
                <Link
                  href={t.proof}
                  target="_blank"
                  rel="noreferrer"
                  underline="hover"
                >
                  View
                </Link>
              </Typography>
            )}
          </CardContent>
        </Card>
      ))}
    </Box>
  );
}
