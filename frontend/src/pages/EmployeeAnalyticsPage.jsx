import { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Paper,
  Box,
  CircularProgress,
  Grid,
  Divider,
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

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

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
      <Box sx={{ display: "flex", justifyContent: "center", mt: 10 }}>
        <CircularProgress size={60} />
      </Box>
    );
  }

  const barData = {
    labels: analyticsData.map((a) => a.email.split("@")[0]),
    datasets: [
      {
        label: "Assigned",
        data: analyticsData.map((a) => a.total),
        backgroundColor: "rgba(59, 130, 246, 0.8)",
      },
      {
        label: "Completed",
        data: analyticsData.map((a) => a.completed),
        backgroundColor: "rgba(16, 185, 129, 0.8)",
      },
      {
        label: "Pending",
        data: analyticsData.map((a) => a.pending),
        backgroundColor: "rgba(245, 158, 11, 0.8)",
      },
    ],
  };

  const barOptions = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: "Task Summary per Employee",
        font: {
          size: 18,
          weight: "bold",
        },
      },
      legend: {
        position: "bottom",
      },
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
        ticks: {
          precision: 0,
          stepSize: 1,
        },
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
        backgroundColor: [
          "rgba(59, 130, 246, 0.8)",
          "rgba(16, 185, 129, 0.8)",
          "rgba(245, 158, 11, 0.8)",
        ],
        hoverOffset: 8,
      },
    ],
  };

  return (
  <Container maxWidth="lg" sx={{ py: 6 }}>
    <Box sx={{ px: { xs: 1, sm: 2, md: 3 }, py: 2 }}>
      <Typography variant="h4" gutterBottom fontWeight="bold">
        📊 Employee Performance Analytics
      </Typography>

      <Divider sx={{ mb: 4 }} />

      <Grid container spacing={4}>
        {/* Bar Chart */}
        <Grid item xs={12} md={8}>
          <Paper elevation={3} sx={{ p: 3, overflowX: "auto" }}>
            <Typography variant="h6" gutterBottom fontWeight="medium">
              Task Summary (Per Employee)
            </Typography>
            <Box sx={{ minWidth: analyticsData.length * 80, height: 400 }}>
              <Bar data={barData} options={barOptions} />
            </Box>
          </Paper>
        </Grid>

        {/* Pie Chart */}
        <Grid item xs={12} md={4}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom fontWeight="medium">
              Overall Task Distribution
            </Typography>
            <Box
              sx={{
                height: 300,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Pie data={pieData} />
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  </Container>
);
}
