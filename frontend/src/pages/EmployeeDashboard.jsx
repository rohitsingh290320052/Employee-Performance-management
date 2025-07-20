import { useEffect, useState } from "react";
import api from "@/api/axios";
import { useTheme } from "@mui/material/styles";
import {
  Box,
  Typography,
  TextField,
  MenuItem,
  Grid,
  Card,
  CardContent,
  Chip,
  Button,
  Stack,
  Link,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

export default function EmployeeDashboard() {
  const theme = useTheme(); // 🟡 Use theme from context
  const [tasks, setTasks] = useState([]);
  const [proofs, setProofs] = useState({});
  const [search, setSearch] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [sortType, setSortType] = useState("dueDate");

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

  const filteredTasks = tasks
    .filter(
      (t) =>
        t.title.toLowerCase().includes(search.toLowerCase()) ||
        t.description.toLowerCase().includes(search.toLowerCase())
    )
    .filter((t) =>
      priorityFilter === "All" ? true : t.priority === priorityFilter
    )
    .filter((t) => (statusFilter === "All" ? true : t.status === statusFilter))
    .sort((a, b) => {
      if (sortType === "priority") {
        const order = { High: 3, Medium: 2, Low: 1 };
        return order[b.priority] - order[a.priority];
      } else {
        return new Date(a.dueDate) - new Date(b.dueDate);
      }
    });

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.status === "Completed").length;

  return (
    <Box sx={{ pt: "80px", px: 4, pb: 4 }}>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        📋 My Tasks
      </Typography>

      <Typography sx={{ mb: 2 }}>
        Total: <b>{totalTasks}</b> | Completed: <b>{completedTasks}</b> | Pending:{" "}
        <b>{totalTasks - completedTasks}</b>
      </Typography>

      {/* Filters */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={4}>
          <TextField
            label="Search tasks"
            fullWidth
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </Grid>
        <Grid item xs={12} sm={2}>
          <TextField
            select
            label="Priority"
            fullWidth
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
          >
            {["All", "High", "Medium", "Low"].map((p) => (
              <MenuItem key={p} value={p}>
                {p}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid item xs={12} sm={2}>
          <TextField
            select
            label="Status"
            fullWidth
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            {["All", "Assigned", "Completed"].map((s) => (
              <MenuItem key={s} value={s}>
                {s}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid item xs={12} sm={2}>
          <TextField
            select
            label="Sort by"
            fullWidth
            value={sortType}
            onChange={(e) => setSortType(e.target.value)}
          >
            <MenuItem value="dueDate">Due Date</MenuItem>
            <MenuItem value="priority">Priority</MenuItem>
          </TextField>
        </Grid>
      </Grid>

      {/* Tasks */}
      <Grid container spacing={3}>
        {filteredTasks.map((t) => (
          <Grid item xs={12} sm={6} md={4} key={t._id}>
            <Card
              sx={{
                width: 260,
                height: "100%",
                borderRadius: 3,
                backgroundColor: theme.palette.background.paper,
                boxShadow: 4,
                transition: "transform 0.2s, box-shadow 0.2s",
                "&:hover": {
                  transform: "translateY(-5px)",
                  boxShadow: 6,
                },
              }}
            >
              <CardContent
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  height: 280,
                }}
              >
                <Box>
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    <Typography variant="h6" fontWeight={600}>
                      {t.title}
                    </Typography>
                    <Chip
                      label={t.priority}
                      size="small"
                      sx={{
                        backgroundColor: getPriorityColor(t.priority),
                        color: "#fff",
                        fontWeight: "bold",
                        borderRadius: "6px",
                      }}
                    />
                  </Stack>

                  <Typography
                    variant="body2"
                    color="text.secondary"
                    mt={1}
                    mb={2}
                  >
                    {t.description}
                  </Typography>

                  <Stack direction="row" alignItems="center" spacing={1} mb={2}>
                    <Chip
                      label={t.status}
                      color={t.status === "Completed" ? "success" : "warning"}
                      size="small"
                      icon={
                        t.status === "Completed" ? (
                          <CheckCircleIcon fontSize="small" />
                        ) : null
                      }
                    />
                    <Chip
                      label={
                        "Due: " +
                        new Date(t.dueDate).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })
                      }
                      variant="outlined"
                      size="small"
                    />
                  </Stack>
                </Box>

                {t.status !== "Completed" ? (
                  <Box>
                    <TextField
                      placeholder="Enter proof link"
                      fullWidth
                      size="small"
                      value={proofs[t._id] || ""}
                      onChange={(e) =>
                        handleProofChange(t._id, e.target.value)
                      }
                      sx={{ mb: 1 }}
                    />
                    <Button
                      fullWidth
                      variant="contained"
                      onClick={() => markCompleted(t._id)}
                      sx={{
                        backgroundColor: "#10b981",
                        color: "#fff",
                        fontWeight: "bold",
                        borderRadius: "8px",
                        py: 1.5,
                        "&:hover": {
                          backgroundColor: "#059669",
                        },
                      }}
                    >
                      Mark as Completed
                    </Button>
                  </Box>
                ) : t.proof ? (
                  <Box
                    sx={{
                      mt: 1,
                      p: 1,
                      backgroundColor:
                        theme.palette.mode === "dark"
                          ? "rgba(22, 101, 52, 0.2)"
                          : "#f0fdf4",
                      border: "1px solid #d1fae5",
                      borderRadius: 1,
                    }}
                  >
                    <Typography fontSize={14}>
                      ✅ Proof:{" "}
                      <Link
                        href={t.proof}
                        target="_blank"
                        rel="noreferrer"
                        underline="hover"
                      >
                        View Submission
                      </Link>
                    </Typography>
                  </Box>
                ) : (
                  <Box />
                )}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
