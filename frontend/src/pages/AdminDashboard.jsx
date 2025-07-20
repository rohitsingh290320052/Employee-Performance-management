import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Stack from '@mui/material/Stack';
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
  IconButton,
  InputAdornment,
} from "@mui/material";

import {
  CheckCircle as CheckCircleIcon,
  Logout as LogoutIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  FileDownload as FileDownloadIcon,
} from "@mui/icons-material";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

import { Bar } from "react-chartjs-2";
import { saveAs } from "file-saver";
import Papa from "papaparse";
import api from "@/api/axios";
import { useAuth } from "@/auth/AuthContext";

export default function AdminDashboard() {
  const { user, logout } = useAuth();

  const [tasks, setTasks] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [analyticsData, setAnalyticsData] = useState([]);
  const [empEmail, setEmpEmail] = useState("");
  const navigate = useNavigate();

  const [task, setTask] = useState({
    title: "",
    description: "",
    priority: "Low",
    dueDate: "",
  });

  const [search, setSearch] = useState("");
  const [filterEmpEmail, setFilterEmpEmail] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

  useEffect(() => {
    fetchTasks();
    fetchEmployees();
    fetchAnalytics();
  }, []);

  const fetchTasks = async () => {
    const { data } = await api.get("/admin/tasks");
    setTasks(data);
  };

  const fetchEmployees = async () => {
    const res = await api.get("/admin/employees");
    setEmployees(res.data);
  };

  const fetchAnalytics = async () => {
    try {
      const res = await api.get("/admin/analytics");
      setAnalyticsData(res.data);
    } catch (err) {
      console.error("Error fetching analytics:", err);
    }
  };

  const addEmployee = async () => {
    if (!empEmail) return alert("Enter employee email");
    try {
      await api.post("/admin/add-employee", { email: empEmail });
      alert("Employee added");
      setEmpEmail("");
      fetchEmployees();
    } catch (e) {
      alert(e.response?.data?.error || "Failed to add employee");
    }
  };

  const assignTask = async () => {
    if (!task.title || !empEmail) {
      alert("Enter task title and employee email");
      return;
    }
    
    else if (!task.description) {
      alert("Enter task description");
      return;
    }
     if (!task.dueDate) {
      alert("Select a due date");
      return;
    }
    if (new Date(task.dueDate) < new Date()) {
      alert("Due date cannot be in the past");
      return;
    }
    if (!task.priority) {
      alert("Select a priority");
      return;
    }
    if (!/\S+@\S+\.\S+/.test(empEmail)) {
      alert("Invalid employee email");
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
      fetchTasks();
      fetchAnalytics(); // refresh analytics after task assign
    } catch (e) {
      alert(e.response?.data?.error || "Failed to assign task");
    }
  };

  const deleteTask = async (id) => {
    if (window.confirm("Are you sure to delete this task?")) {
      await api.delete(`/admin/task/${id}`);
      fetchTasks();
      fetchAnalytics(); // refresh analytics after delete
    }
  };

  const exportCSV = () => {
    const csv = Papa.unparse(tasks);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, "tasks_report.csv");
  };

  const filteredTasks = tasks.filter(
    (t) =>
      (!filterEmpEmail || t.assignedTo?.email?.includes(filterEmpEmail)) &&
      (!filterStatus || t.status === filterStatus) &&
      t.title.toLowerCase().includes(search.toLowerCase())
  );

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "High":
        return "#dc2626"; // red
      case "Medium":
        return "#facc15"; // yellow
      case "Low":
        return "#22c55e"; // green
      default:
        return "#6b7280"; // gray
    }
  };

  const TaskCard = ({ t }) => {
  const [open, setOpen] = useState(false);

  const handleClick = () => {
    if (t.proof) setOpen(true);
  };

  return (
    <>
      <Card
        elevation={6}
        sx={{
          mb: 3,
          height: "100%",
          cursor: t.proof ? "pointer" : "default",
          borderRadius: 3,
          background: "linear-gradient(to right, #f9fafb, #f3f4f6)",
          borderLeft: `6px solid ${getPriorityColor(t.priority)}`,
          transition: "transform 0.2s, box-shadow 0.2s",
          "&:hover": {
            transform: "translateY(-5px)",
            boxShadow: 6,
          },
        }}
        onClick={handleClick}
      >
        <CardContent>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h6" fontWeight={600}>
              {t.title}
            </Typography>
            <Chip
              label={t.status}
              color={t.status === "Completed" ? "success" : "warning"}
              size="small"
              icon={t.status === "Completed" ? <CheckCircleIcon fontSize="small" /> : undefined}
              sx={{ fontWeight: 500 }}
            />
          </Box>

          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            Assigned To: <strong>{t.assignedTo?.email || "N/A"}</strong>
          </Typography>

          <Box
            mt={1.5}
            p={1.5}
            sx={{
              backgroundColor: "#ffffff",
              borderRadius: 2,
              border: "1px solid #e5e7eb",
            }}
          >
            <Typography variant="subtitle2" color="text.secondary">
              Description
            </Typography>
            <Typography variant="body2" sx={{ mt: 0.5 }}>
              {t.description || "No description provided."}
            </Typography>
          </Box>

          <Box display="flex" justifyContent="space-between" alignItems="center" mt={2}>
            <Chip
              label={`Priority: ${t.priority}`}
              size="small"
              sx={{
                backgroundColor: getPriorityColor(t.priority),
                color: "#fff",
                fontWeight: 500,
              }}
            />
            <Typography variant="caption" color="text.secondary">
              Due: {new Date(t.dueDate).toLocaleDateString()}
            </Typography>
          </Box>

          <Box mt={2} display="flex" gap={1}>
            <IconButton
              onClick={(e) => {
                e.stopPropagation();
                if (window.confirm("Are you sure to delete this task?")) {
                  deleteTask(t._id);
                }
              }}
              color="error"
              size="small"
              sx={{
                backgroundColor: "#fee2e2",
                borderRadius: 1,
                "&:hover": { backgroundColor: "#fecaca" },
              }}
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Box>

          {t.proof && (
            <Typography variant="caption" color="primary" sx={{ mt: 2, display: "block" }}>
              * Click card to view proof
            </Typography>
          )}
        </CardContent>
      </Card>

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
                title="proof"
                style={{ width: "100%", height: "70vh", border: "none" }}
              />
            )}
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};


  const chartData = {
    labels: analyticsData.map((a) => a.email),
    datasets: [
      {
        label: "Total Tasks",
        data: analyticsData.map((a) => a.total),
        backgroundColor: "#3b82f6",
      },
      {
        label: "Completed",
        data: analyticsData.map((a) => a.completed),
        backgroundColor: "#10b981",
      },
      {
        label: "Pending",
        data: analyticsData.map((a) => a.pending),
        backgroundColor: "#f59e0b",
      },
    ],
  };

  return (
    <>
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
<Card
  sx={{
    p: 3,
    mb: 4,
    borderRadius: 3,
    boxShadow: 3,
    backgroundColor: (theme) =>
      theme.palette.mode === "dark" ? "#1e293b" : "#f9fafb",
  }}
>
  <Typography variant="h6" fontWeight="bold" gutterBottom>
    👤 Add Employee
  </Typography>
  <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
    <TextField
      label="Employee Email"
      fullWidth
      size="small"
      value={empEmail}
      onChange={(e) => setEmpEmail(e.target.value)}
    />
    <Button
      variant="contained"
      color="primary"
      sx={{ px: 5 }}
      onClick={addEmployee}
    >
    Add
    </Button>
  </Stack>
</Card>

{/* Assign Task */}
<Card
  sx={{
    p: 3,
    mb: 4,
    borderRadius: 3,
    boxShadow: 3,
    backgroundColor: (theme) =>
      theme.palette.mode === "dark" ? "#1e293b" : "#f9fafb",
  }}
>
  <Typography variant="h6" fontWeight="bold" gutterBottom>
    📌 Assign Task
  </Typography>
  <Grid container spacing={2}>
    <Grid item xs={12} sm={6}>
      <TextField
        label="Task Title"
        fullWidth
        size="small"
        value={task.title}
        onChange={(e) => setTask({ ...task, title: e.target.value })}
      />
    </Grid>
    <Grid item xs={12} sm={6}>
      <TextField
        label="Employee Email"
        fullWidth
        size="small"
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
        size="small"
        value={task.description}
        onChange={(e) =>
          setTask({ ...task, description: e.target.value })
        }
      />
    </Grid>
    <Grid item xs={6}>
      <TextField
        label="Priority"
        select
        fullWidth
        size="small"
        value={task.priority}
        onChange={(e) => setTask({ ...task, priority: e.target.value })}
      >
        <MenuItem value="Low">Low</MenuItem>
        <MenuItem value="Medium">Medium</MenuItem>
        <MenuItem value="High">High</MenuItem>
      </TextField>
    </Grid>
    <Grid item xs={6}>
      <TextField
        label="Due Date"
        type="date"
        fullWidth
        size="small"
        InputLabelProps={{ shrink: true }}
        value={task.dueDate}
        onChange={(e) => setTask({ ...task, dueDate: e.target.value })}
      />
    </Grid>
    <Grid item xs={12}>
      <Button
        fullWidth
        variant="contained"
        color="success"
        onClick={assignTask}
        sx={{
          py: 1.2,
          fontWeight: "bold",
          letterSpacing: 0.5,
        }}
      >
        ✅ Assign Task
      </Button>
    </Grid>
  </Grid>
</Card>


        {/* Filters */}
        <Box display="flex" gap={2} mb={2} flexWrap="wrap">
          <TextField
            label="Search by Title"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
          <TextField
            label="Filter by Employee Email"
            value={filterEmpEmail}
            onChange={(e) => setFilterEmpEmail(e.target.value)}
          />
          <TextField
            label="Filter by Status"
            select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <MenuItem value="">All</MenuItem>
            <MenuItem value="Assigned">Assigned</MenuItem>
            <MenuItem value="Completed">Completed</MenuItem>
          </TextField>
          <Button
            variant="outlined"
            startIcon={<FileDownloadIcon />}
            onClick={exportCSV}
          >
            Export CSV
          </Button>
           
        <Button variant="contained" color="primary" onClick={() => navigate("/analytics")}>
          Compare Employee Performance
        </Button>
        </Box>

        {/* Task List */}
        <Grid container spacing={2}>
          {filteredTasks.map((t) => (
            <Grid item xs={12} md={6} key={t._id}>
              <TaskCard t={t} />
            </Grid>
          ))}
        </Grid>

        <Divider sx={{ my: 4 }} />


      </Container>
    </>
  );
}
