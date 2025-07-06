// import {Card,CardContent,Typography,Chip,Stack,Box} from "@mui/material";
// import PriorityHighIcon from "@mui/icons-material/PriorityHigh";
// import EventIcon from "@mui/icons-material/Event";

// const priorityColors = {
//   Low: "success",
//   Medium: "warning",
//   High: "error",
// };

// export default function TaskCard({ data }) {
//   return (
//     <Card elevation={3} sx={{ borderLeft: `6px solid #1976d2`, minHeight: 150 }}>
//       <CardContent>
//         <Stack direction="row" justifyContent="space-between" alignItems="center">
//           <Typography variant="h6" fontWeight={600}>
//             {data.title}
//           </Typography>
//           <Chip
//             label={data.priority}
//             color={priorityColors[data.priority] || "default"}
//             icon={<PriorityHighIcon />}
//           />
//         </Stack>

//         <Typography variant="body2" sx={{ mt: 1.5, color: "text.secondary" }}>
//           {data.description}
//         </Typography>

//         <Box sx={{ mt: 2 }} display="flex" gap={2} alignItems="center">
//           <Chip
//             icon={<EventIcon />}
//             label={`Due: ${new Date(data.dueDate).toLocaleDateString()}`}
//             variant="outlined"
//           />
//           <Chip
//             label={`Status: ${data.status}`}
//             color={data.status === "completed" ? "success" : "info"}
//             variant="filled"
//           />
//         </Box>
//       </CardContent>
//     </Card>
//   );
// }

