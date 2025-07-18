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

  const cellStyle = {
  padding: "12px 16px",
  textAlign: "left",
  fontSize: "14px",
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
          
          <Paper sx={{ p: 3, mb: 8 }}>
  <Typography variant="h6" gutterBottom>
    📋 Employee Task Summary Table (Sorted by Efficiency)
  </Typography>

  <Box sx={{ overflowX: "auto" }}>
    <table style={{ width: "100%", borderCollapse: "collapse" }}>
      <thead>
        <tr style={{ backgroundColor: "#f1f5f9" }}>
          <th style={cellStyle}>Employee</th>
          <th style={cellStyle}>Assigned</th>
          <th style={cellStyle}>Completed</th>
          <th style={cellStyle}>Efficiency</th>
        </tr>
      </thead>
      <tbody>
        {analyticsData
          .slice()
          .filter((emp) => emp.total > 0)
          .sort((a, b) => (b.completed / b.total) - (a.completed / a.total))
          .map((emp, i) => {
            const username = emp.email.split("@")[0];
            const efficiency = ((emp.completed / emp.total) * 100).toFixed(1);
            return (
              <tr key={i} style={{ borderBottom: "1px solid #e5e7eb" }}>
                <td style={cellStyle}>{username}</td>
                <td style={cellStyle}>{emp.total}</td>
                <td style={cellStyle}>{emp.completed}</td>
                <td style={cellStyle}>{efficiency}%</td>
              </tr>
            );
          })}
      </tbody>
    </table>
  </Box>
</Paper>


        </Grid>
      </Grid>
    </Box>
  </Container>
);
}
