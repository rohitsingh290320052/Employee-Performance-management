import { useEffect, useState } from "react";
import api from "@/api/axios";

export default function AnalyticsTable() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await api.get("/admin/analytics");
        setRows(res.data);
      } catch (err) {
        console.error("Analytics error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  if (loading) return <p className="text-gray-500">Loading analytics…</p>;

  if (!rows.length)
    return <p className="text-gray-500">No analytics data yet.</p>;

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-sm border">
        <thead className="bg-gray-50">
          <tr>
            <th className="p-2 border">Employee</th>
            <th className="p-2 border">Total</th>
            <th className="p-2 border text-green-600">Completed</th>
            <th className="p-2 border text-red-600">Pending</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.email} className="text-center">
              <td className="p-2 border">{r.name || r.email}</td>
              <td className="p-2 border">{r.total}</td>
              <td className="p-2 border text-green-700">{r.completed}</td>
              <td className="p-2 border text-red-700">{r.pending}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
