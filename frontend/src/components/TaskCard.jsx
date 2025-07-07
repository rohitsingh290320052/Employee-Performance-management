import { Card, CardContent, Typography, Chip, Box, Tooltip } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";

export default function TaskCard({ data }) {
  const priorityColor = {
    High: "error",
    Medium: "warning",
    Low: "success",
  };

  const getStatusIcon = (status) => {
    return status === "Completed" ? <CheckCircleIcon color="success" /> : <HourglassEmptyIcon color="warning" />;
  };

  return (
    <Card
      elevation={4}
      sx={{
        borderLeft: `6px solid`,
        borderColor: `${priorityColor[data.priority]}.main`,
        backgroundColor: "#1f2937", // Tailwind gray-800
        color: "#fff",
        transition: "transform 0.2s ease-in-out",
        "&:hover": {
          transform: "scale(1.02)",
          boxShadow: "0 6px 20px rgba(0,0,0,0.4)",
        },
      }}
    >
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
          <Typography variant="h6" fontWeight="bold">
            {data.title}
          </Typography>
          <Tooltip title={data.status}>
            {getStatusIcon(data.status)}
          </Tooltip>
        </Box>

        <Typography variant="body2" sx={{ mb: 1 }}>
          {data.description}
        </Typography>

        <Box mb={1}>
          <Chip
            label={`Priority: ${data.priority}`}
            color={priorityColor[data.priority]}
            size="small"
            sx={{ fontWeight: 600, mr: 1 }}
          />
          <Chip
            label={`Due: ${new Date(data.dueDate).toLocaleDateString()}`}
            variant="outlined"
            size="small"
            sx={{ color: "#bbb", borderColor: "#bbb" }}
          />
        </Box>

        {data.status === "Completed" && data.proof && (
          <Typography variant="body2" mt={2}>
            📎 Proof:{" "}
            <a href={data.proof} target="_blank" rel="noreferrer" style={{ color: "#4fc3f7" }}>
              View Uploaded File
            </a>
          </Typography>
        )}
      </CardContent>
    </Card>
  );
}
