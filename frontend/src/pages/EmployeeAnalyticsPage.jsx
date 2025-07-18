import { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Paper,
  Box,
  CircularProgress,
} from "@mui/material";
import { Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import api from "@/api/axios";

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend);

export default function EmployeeAnalyticsPage() {
  const [analyticsData, setAnalyticsData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await api.get("/admin/analytics");
        setAnalyticsData(res.data);
      } catch (err) {
        console.error("Error fetching analytics:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  const barData = {
    labels: analyticsData.map((a) => a.email),
    datasets: [
      {
        label: "Assigned",
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

  const barOptions = {
    responsive: true,
    plugins: {
      title: { display: true, text: "Task Summary per Employee" },
      legend: { position: "top" },
    },
    scales: {
      x: {
        ticks: {
          autoSkip: false,
          maxRotation: 60,
          minRotation: 45,
        },
      },
      y: {
        beginAtZero: true,
        ticks: { precision: 0 },
      },
    },
  };

  const totalAssigned = analyticsData.reduce((sum, e) => sum + e.total, 0);
  const totalCompleted = analyticsData.reduce((sum, e) => sum + e.completed, 0);
  const totalPending = analyticsData.reduce((sum, e) => sum + e.pending, 0);

  const pieData = {
    labels: ["Assigned", "Completed", "Pending"],
    datasets: [
      {
        data: [totalAssigned, totalCompleted, totalPending],
        backgroundColor: ["#3b82f6", "#10b981", "#f59e0b"],
        hoverOffset: 8,
      },
    ],
  };

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        📈 Employee Performance Analytics
      </Typography>

      <Paper sx={{ p: 3, mb: 4, overflowX: "auto" }}>
        <Box sx={{ minWidth: analyticsData.length * 80, height: 400 }}>
          <Bar data={barData} options={barOptions} />
        </Box>
      </Paper>

      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          Overall Task Distribution
        </Typography>
        <Box sx={{ maxWidth: 400, mx: "auto" }}>
          <Pie data={pieData} />
        </Box>
      </Paper>
    </Container>
  );
}
