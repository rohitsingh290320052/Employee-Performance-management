
// import { useEffect, useState } from "react";
// import {Container,Typography,TextField,Button,Box,MenuItem,Grid,Paper,Divider,AppBar,Toolbar,Chip,Card,CardContent,
//   Dialog,DialogContent,IconButton,InputAdornment,Select,
// } from "@mui/material";

// import {
//   CheckCircle as CheckCircleIcon,
//   Logout as LogoutIcon,
//   Delete as DeleteIcon,
//   Edit as EditIcon,
//   Search as SearchIcon,
//   FileDownload as FileDownloadIcon,
// } from "@mui/icons-material";

// import {
//   Chart as ChartJS,
//   CategoryScale,
//   LinearScale,
//   BarElement,
//   Title,
//   Tooltip,
//   Legend,
// } from "chart.js";

// ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

// import { Bar } from "react-chartjs-2";
// import { saveAs } from "file-saver";
// import Papa from "papaparse";
// import api from "@/api/axios";
// import { useAuth } from "@/auth/AuthContext";

// export default function AdminDashboard() {
//   const { user, logout } = useAuth();

//   const [tasks, setTasks] = useState([]);
//   const [empEmail, setEmpEmail] = useState("");
//   const [employees, setEmployees] = useState([]);
//   const [task, setTask] = useState({
//     title: "",
//     description: "",
//     priority: "Low",
//     dueDate: "",
//   });

//   const [search, setSearch] = useState("");
//   const [filterEmp, setFilterEmp] = useState("");
//   const [filterStatus, setFilterStatus] = useState("");

//   useEffect(() => {
//     fetchTasks();
//     fetchEmployees();
//   }, []);

//   const fetchTasks = async () => {
//     const { data } = await api.get("/admin/tasks");
//     setTasks(data);
//   };

//   const fetchEmployees = async () => {
//     const res = await api.get("/admin/employees");
//     setEmployees(res.data);
//   };

//   const addEmployee = async () => {
//     if (!empEmail) return alert("Enter employee email");
//     try {
//       await api.post("/admin/add-employee", { email: empEmail });
//       alert("Employee added");
//       setEmpEmail("");
//       fetchEmployees();
//     } catch (e) {
//       alert(e.response?.data?.error || "Failed to add employee");
//     }
//   };

//   const assignTask = async () => {
//     if (!task.title || !empEmail) {
//       alert("Enter task title and employee email");
//       return;
//     }
//     try {
//       const emp = await api.get(`/admin/lookup/${empEmail}`);
//       await api.post("/admin/assign-task", {
//         ...task,
//         assignedTo: emp.data._id,
//       });
//       alert("Task assigned");
//       setTask({ title: "", description: "", priority: "Low", dueDate: "" });
//       fetchTasks();
//     } catch (e) {
//       alert(e.response?.data?.error || "Failed to assign task");
//     }
//   };

//   const deleteTask = async (id) => {
//     if (window.confirm("Are you sure to delete this task?")) {
//       await api.delete(`/admin/task/${id}`);
//       fetchTasks();
//     }
//   };

//   const exportCSV = () => {
//     const csv = Papa.unparse(tasks);
//     const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
//     saveAs(blob, "tasks_report.csv");
//   };

//   const filteredTasks = tasks.filter(
//     (t) =>
//       (!filterEmp || t.assignedTo?.email === filterEmp) &&
//       (!filterStatus || t.status === filterStatus) &&
//       t.title.toLowerCase().includes(search.toLowerCase())
//   );

//   const TaskCard = ({ t }) => {
//     const [open, setOpen] = useState(false);
//     const handleClick = () => {
//       if (t.proof) setOpen(true);
//     };

//     return (
//       <>
//         <Card
//           elevation={3}
//           sx={{ mb: 2, borderLeft: "5px solid #888", cursor: "pointer" }}
//           onClick={handleClick}
//         >
//           <CardContent>
//             <Typography variant="h6">{t.title}</Typography>
//             <Typography sx={{ mb: 1 }}>{t.description}</Typography>
//             <Chip
//               label={t.status}
//               color={t.status === "Completed" ? "success" : "warning"}
//               icon={t.status === "Completed" ? <CheckCircleIcon /> : undefined}
//               sx={{ mr: 1 }}
//             />
//             <Chip label={t.priority} size="small" />
//             <Typography sx={{ mt: 1, fontSize: 13 }}>
//               Due: {new Date(t.dueDate).toLocaleDateString()}
//             </Typography>
//             <Box mt={1}>
//               <IconButton onClick={() => deleteTask(t._id)} color="error">
//                 <DeleteIcon />
//               </IconButton>
//               {/* You can add edit functionality here */}
//             </Box>
//           </CardContent>
//         </Card>

//         <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
//           <DialogContent>
//             {/\.(jpe?g|png|gif|webp)$/i.test(t.proof) ? (
//               <img src={t.proof} alt="proof" style={{ width: "100%" }} />
//             ) : (
//               <iframe
//                 src={t.proof}
//                 title="proof"
//                 style={{ width: "100%", height: "70vh", border: "none" }}
//               />
//             )}
//           </DialogContent>
//         </Dialog>
//       </>
//     );
//   };

//   const chartData = {
//     labels: employees.map((e) => e.email),
//     datasets: [
//       {
//         label: "Total Tasks",
//         data: employees.map((e) => tasks.filter((t) => t.assignedTo?.email === e.email).length),
//         backgroundColor: "#3b82f6",
//       },
//       {
//         label: "Completed",
//         data: employees.map(
//           (e) =>
//             tasks.filter(
//               (t) => t.assignedTo?.email === e.email && t.status === "Completed"
//             ).length
//         ),
//         backgroundColor: "#10b981",
//       },
//     ],
//   };

//   return (
//     <>
//       <AppBar position="static">
//         <Toolbar>
//           <Typography variant="h6" sx={{ flexGrow: 1 }}>
//             Admin Dashboard – {user.company} / {user.branch}
//           </Typography>
//           <Button color="inherit" onClick={logout} startIcon={<LogoutIcon />}>
//             Logout
//           </Button>
//         </Toolbar>
//       </AppBar>

//       <Container maxWidth="lg" sx={{ mt: 4 }}>
//         <Paper sx={{ p: 3, mb: 4 }}>
//           <Typography variant="h5" gutterBottom>
//             Add Employee
//           </Typography>
//           <Box display="flex" gap={2}>
//             <TextField
//               label="Employee Email"
//               fullWidth
//               value={empEmail}
//               onChange={(e) => setEmpEmail(e.target.value)}
//             />
//             <Button variant="contained" onClick={addEmployee}>
//               Add
//             </Button>
//           </Box>
//         </Paper>

//         <Paper sx={{ p: 3, mb: 4 }}>
//           <Typography variant="h5" gutterBottom>
//             Assign Task
//           </Typography>
//           <Grid container spacing={2}>
//             <Grid item xs={12} sm={6}>
//               <TextField
//                 label="Task Title"
//                 fullWidth
//                 value={task.title}
//                 onChange={(e) => setTask({ ...task, title: e.target.value })}
//               />
//             </Grid>
//             <Grid item xs={12} sm={6}>
//               <TextField
//                 label="Description"
//                 fullWidth
//                 value={task.description}
//                 onChange={(e) => setTask({ ...task, description: e.target.value })}
//               />
//             </Grid>
//             <Grid item xs={6}>
//               <TextField
//                 label="Priority"
//                 select
//                 fullWidth
//                 value={task.priority}
//                 onChange={(e) => setTask({ ...task, priority: e.target.value })}
//               >
//                 <MenuItem value="Low">Low</MenuItem>
//                 <MenuItem value="Medium">Medium</MenuItem>
//                 <MenuItem value="High">High</MenuItem>
//               </TextField>
//             </Grid>
//             <Grid item xs={6}>
//               <TextField
//                 label="Due Date"
//                 type="date"
//                 fullWidth
//                 InputLabelProps={{ shrink: true }}
//                 value={task.dueDate}
//                 onChange={(e) => setTask({ ...task, dueDate: e.target.value })}
//               />
//             </Grid>
//             <Grid item xs={12}>
//               <Button fullWidth variant="contained" onClick={assignTask}>
//                 Assign
//               </Button>
//             </Grid>
//           </Grid>
//         </Paper>

//         <Box display="flex" gap={2} mb={2}>
//           <TextField
//             label="Search Title"
//             value={search}
//             onChange={(e) => setSearch(e.target.value)}
//             InputProps={{
//               endAdornment: (
//                 <InputAdornment position="end">
//                   <SearchIcon />
//                 </InputAdornment>
//               ),
//             }}
//           />
//           <Select
//             value={filterEmp}
//             displayEmpty
//             onChange={(e) => setFilterEmp(e.target.value)}
//           >
//             <MenuItem value="">All Employees</MenuItem>
//             {employees.map((e) => (
//               <MenuItem key={e._id} value={e.email}>
//                 {e.email}
//               </MenuItem>
//             ))}
//           </Select>
//           <Select
//             value={filterStatus}
//             displayEmpty
//             onChange={(e) => setFilterStatus(e.target.value)}
//           >
//             <MenuItem value="">All Status</MenuItem>
//             <MenuItem value="Assigned">Assigned</MenuItem>
//             <MenuItem value="Completed">Completed</MenuItem>
//           </Select>
//           <Button
//             variant="outlined"
//             startIcon={<FileDownloadIcon />}
//             onClick={exportCSV}
//           >
//             Export CSV
//           </Button>
//         </Box>

//         <Grid container spacing={2}>
//           {filteredTasks.map((t) => (
//             <Grid item xs={12} md={6} key={t._id}>
//               <TaskCard t={t} />
//             </Grid>
//           ))}
//         </Grid>

//         <Divider sx={{ my: 4 }} />

//         <Typography variant="h5" gutterBottom>
//           📊 Task Analytics
//         </Typography>
//         <Paper sx={{ p: 2 }}>
//           <Bar data={chartData} />
//         </Paper>
//       </Container>
//     </>
//   );
// }


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
  const [empEmail, setEmpEmail] = useState("");

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
  }, []);

  const fetchTasks = async () => {
    const { data } = await api.get("/admin/tasks");
    setTasks(data);
  };

  const fetchEmployees = async () => {
    const res = await api.get("/admin/employees");
    setEmployees(res.data);
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
    try {
      const emp = await api.get(`/admin/lookup/${empEmail}`);
      await api.post("/admin/assign-task", {
        ...task,
        assignedTo: emp.data._id,
      });
      alert("Task assigned");
      setTask({ title: "", description: "", priority: "Low", dueDate: "" });
      fetchTasks();
    } catch (e) {
      alert(e.response?.data?.error || "Failed to assign task");
    }
  };

  const deleteTask = async (id) => {
    if (window.confirm("Are you sure to delete this task?")) {
      await api.delete(`/admin/task/${id}`);
      fetchTasks();
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

 const TaskCard = ({ t }) => {
  const [open, setOpen] = useState(false);

  const handleClick = () => {
    if (t.proof) setOpen(true);
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "High":
        return "#dc2626"; // Red
      case "Medium":
        return "#facc15"; // Yellow
      case "Low":
        return "#22c55e"; // Green
      default:
        return "#6b7280"; // Gray
    }
  };

  return (
    <>
      <Card
        elevation={4}
        sx={{
          mb: 2,
          cursor: t.proof ? "pointer" : "default",
          borderLeft: `6px solid ${getPriorityColor(t.priority)}`,
          transition: "0.2s",
          "&:hover": {
            boxShadow: 6,
            transform: "scale(1.01)",
          },
        }}
        onClick={handleClick}
      >
        <CardContent>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h6" fontWeight="bold">
              {t.title}
            </Typography>
            <Chip
              label={t.status}
              color={t.status === "Completed" ? "success" : "warning"}
              size="small"
              icon={t.status === "Completed" ? <CheckCircleIcon /> : undefined}
            />
          </Box>

          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            Assigned To: <strong>{t.assignedTo?.email || "N/A"}</strong>
          </Typography>

          <Typography variant="body1" sx={{ my: 1 }}>
            {t.description}
          </Typography>

          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Chip
              label={`Priority: ${t.priority}`}
              size="small"
              sx={{ backgroundColor: getPriorityColor(t.priority), color: "#fff" }}
            />
            <Typography variant="caption" color="text.secondary">
              Due: {new Date(t.dueDate).toLocaleDateString()}
            </Typography>
          </Box>

          <Box mt={2} display="flex" gap={1}>
            <IconButton
              onClick={(e) => {
                e.stopPropagation(); // avoid opening dialog
                if (window.confirm("Are you sure to delete this task?")) {
                  deleteTask(t._id);
                }
              }}
              color="error"
              size="small"
            >
              <DeleteIcon />
            </IconButton>
            {/* Placeholder for edit in future */}
          </Box>

          {t.proof && (
            <Typography variant="caption" color="primary" mt={1}>
              * Click card to view proof
            </Typography>
          )}
        </CardContent>
      </Card>

      {/* Proof Viewer */}
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
    labels: employees.map((e) => e.email),
    datasets: [
      {
        label: "Total Tasks",
        data: employees.map((e) =>
          tasks.filter((t) => t.assignedTo?.email === e.email).length
        ),
        backgroundColor: "#3b82f6",
      },
      {
        label: "Completed",
        data: employees.map((e) =>
          tasks.filter(
            (t) => t.assignedTo?.email === e.email && t.status === "Completed"
          ).length
        ),
        backgroundColor: "#10b981",
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
        <Paper sx={{ p: 3, mb: 4 }}>
          <Typography variant="h5" gutterBottom>
            Add Employee
          </Typography>
          <Box display="flex" gap={2}>
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
        <Paper sx={{ p: 3, mb: 4 }}>
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
            <Grid item xs={6}>
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
            <Grid item xs={6}>
              <TextField
                label="Due Date"
                type="date"
                fullWidth
                InputLabelProps={{ shrink: true }}
                value={task.dueDate}
                onChange={(e) => setTask({ ...task, dueDate: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <Button fullWidth variant="contained" onClick={assignTask}>
                Assign
              </Button>
            </Grid>
          </Grid>
        </Paper>

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
        </Box>

        {/* Task list */}
        <Grid container spacing={2}>
          {filteredTasks.map((t) => (
            <Grid item xs={12} md={6} key={t._id}>
              <TaskCard t={t} />
            </Grid>
          ))}
        </Grid>

        <Divider sx={{ my: 4 }} />

        {/* Charts */}
        <Typography variant="h5" gutterBottom>
          📊 Task Analytics
        </Typography>
        <Paper sx={{ p: 2 }}>
          <Bar data={chartData} />
        </Paper>
      </Container>
    </>
  );
}
