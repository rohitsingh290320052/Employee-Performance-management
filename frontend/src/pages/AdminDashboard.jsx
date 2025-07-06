import { useEffect, useState } from "react";
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  MenuItem,
  Grid,
  Paper,
  Divider,
  AppBar,
  Toolbar,
  Chip,
  Card,
  CardContent,
  Dialog,
  DialogContent,
} from "@mui/material";

import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import LogoutIcon from "@mui/icons-material/Logout";
import api from "@/api/axios";
import { useAuth } from "@/auth/AuthContext";

export default function AdminDashboard() {
  const { user, logout } = useAuth();

  /* ------------------- state ------------------- */
  const [tasks, setTasks] = useState([]);
  const [empEmail, setEmpEmail] = useState(""); // single employee input
  const [task, setTask] = useState({
    title: "",
    description: "",
    priority: "Low",
    dueDate: "",
  });

  /* ------------------- effects ------------------- */
  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    const { data } = await api.get("/admin/tasks");
    setTasks(data);
  };

  /* ------------------- handlers ------------------- */
  const addEmployee = async () => {
    if (!empEmail) return alert("Enter employee email");
    try {
      await api.post("/admin/add-employee", { email: empEmail });
      alert("Employee added");
      setEmpEmail("");
    } catch (e) {
      alert(e.response?.data?.error || "Failed to add employee");
    }
  };

  const assignTask = async () => {
    if (!task.title || !empEmail) {
      alert("Enter task title and employee email");
      return;
    }
    try {
      const emp = await api.get(`/admin/lookup/${empEmail}`);
      await api.post("/admin/assign-task", {
        ...task,
        assignedTo: emp.data._id,
      });
      alert("Task assigned");
      setTask({ title: "", description: "", priority: "Low", dueDate: "" });
      fetchTasks(); // refresh list
    } catch (e) {
      alert(e.response?.data?.error || "Failed to assign task");
    }
  };

  /* ------------------- card renderer ------------------- */
  const TaskCard = ({ t }) => {
  const [open, setOpen] = useState(false);

  const statusColor = t.status === "Completed" ? "success" : "warning";

  /* click opens proof if present */
  const handleClick = () => {
    if (t.proof) setOpen(true);
  };

  return (
    <>
      <Card
        elevation={3}
        sx={{
          mb: 2,
          cursor: t.proof ? "pointer" : "default",
          borderLeft: t.status === "Completed" ? "5px solid #16a34a" : undefined,
        }}
        onClick={handleClick}
      >
        <CardContent>
          <Typography variant="h6">{t.title}</Typography>
          <Typography sx={{ mb: 1 }}>{t.description}</Typography>

          <Chip
            label={t.status}
            color={statusColor}
            size="small"
            icon={t.status === "Completed" ? <CheckCircleIcon /> : undefined}
            sx={{ mr: 1 }}
          />
          <Chip label={t.priority} size="small" />

          <Typography sx={{ mt: 1, fontSize: 14 }}>
            Due&nbsp;{new Date(t.dueDate).toLocaleDateString()}
          </Typography>

          {t.proof && (
            <Typography sx={{ mt: 1, fontSize: 13, color: "primary.main" }}>
              Click card to view proof
            </Typography>
          )}
        </CardContent>
      </Card>

      {/* Dialog preview */}
      {t.proof && (
        <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
          <DialogContent>
            {/\.(jpe?g|png|gif|webp)$/i.test(t.proof) ? (
              <img
                src={t.proof}
                alt="proof"
                style={{ width: "100%", borderRadius: 8 }}
              />
            ) : (
              <iframe
                src={t.proof}
                title="proof-link"
                style={{ width: "100%", height: "70vh", border: "none" }}
              />
            )}
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};

  /* ------------------- render ------------------- */
  return (
    <>
      {/* Top bar */}
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Admin Dashboard – {user.company} / {user.branch}
          </Typography>
          <Button color="inherit" onClick={logout} startIcon={<LogoutIcon />}>
            Logout
          </Button>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ mt: 4 }}>
        {/* Add Employee */}
        <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
          <Typography variant="h5" gutterBottom>
            Add Employee
          </Typography>
          <Box display="flex" gap={2} flexWrap="wrap">
            <TextField
              label="Employee Email"
              fullWidth
              value={empEmail}
              onChange={(e) => setEmpEmail(e.target.value)}
            />
            <Button variant="contained" onClick={addEmployee}>
              Add
            </Button>
          </Box>
        </Paper>

        {/* Assign Task */}
        <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
          <Typography variant="h5" gutterBottom>
            Assign Task
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Task Title"
                fullWidth
                value={task.title}
                onChange={(e) => setTask({ ...task, title: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Employee Email"
                fullWidth
                value={empEmail}
                onChange={(e) => setEmpEmail(e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Description"
                fullWidth
                multiline
                rows={3}
                value={task.description}
                onChange={(e) =>
                  setTask({ ...task, description: e.target.value })
                }
              />
            </Grid>
            <Grid item xs={6} sm={4}>
              <TextField
                label="Priority"
                select
                fullWidth
                value={task.priority}
                onChange={(e) => setTask({ ...task, priority: e.target.value })}
              >
                <MenuItem value="Low">Low</MenuItem>
                <MenuItem value="Medium">Medium</MenuItem>
                <MenuItem value="High">High</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={6} sm={4}>
              <TextField
                label="Due Date"
                type="date"
                fullWidth
                InputLabelProps={{ shrink: true }}
                value={task.dueDate}
                onChange={(e) => setTask({ ...task, dueDate: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <Button
                fullWidth
                variant="contained"
                color="primary"
                onClick={assignTask}
              >
                Assign Task
              </Button>
            </Grid>
          </Grid>
        </Paper>

        <Divider sx={{ mb: 4 }} />

        {/* Task List */}
        <Typography variant="h5" gutterBottom>
          All Tasks
        </Typography>
        <Grid container spacing={2}>
          {tasks.length ? (
            tasks.map((t) => (
              <Grid item xs={12} md={6} key={t._id}>
                <TaskCard t={t} />
              </Grid>
            ))
          ) : (
            <Typography sx={{ ml: 2, color: "text.secondary" }}>
              No tasks assigned yet.
            </Typography>
          )}
        </Grid>
      </Container>
    </>
  );
}
