import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";
import AdminSidebar from "./components/AdminSidebar";

const AdminAuditLogScreen = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api.get("/admin/audit-logs", { params: { limit: 100 } })
      .then(({ data }) => setLogs(Array.isArray(data) ? data : []))
      .catch((requestError) => setError(requestError?.response?.data?.message || "Unable to load audit history."))
      .finally(() => setLoading(false));
  }, []);

  return (
    <main className="min-h-screen bg-white text-gray-950">
      <section className="bg-[#f7f1ee] px-6 py-12 sm:py-16"><div className="mx-auto max-w-[1460px]"><p className="text-sm font-semibold uppercase tracking-[0.16em] text-rose-700">Security</p><h1 className="mt-2 text-3xl font-bold sm:text-4xl">Admin audit log</h1><p className="mt-3 text-gray-600">Recent successful or rejected admin write actions. Request contents are not recorded.</p></div></section>
      <section className="mx-auto grid max-w-[1460px] gap-10 px-6 py-10 lg:grid-cols-[315px_1fr]"><AdminSidebar /><section className="min-w-0">
        {error && <div role="alert" className="mb-5 border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">{error}</div>}
        {loading ? <div className="border border-gray-200 px-6 py-16 text-center text-sm text-gray-500">Loading audit history…</div> : logs.length === 0 ? <div className="border border-gray-200 px-6 py-16 text-center text-sm text-gray-500">No admin write actions have been logged yet.</div> : <div className="overflow-x-auto border border-gray-200"><table className="w-full min-w-[680px] text-left text-sm"><thead className="bg-gray-50 text-xs uppercase tracking-wide text-gray-500"><tr><th className="px-4 py-3">Time</th><th className="px-4 py-3">Admin</th><th className="px-4 py-3">Action</th><th className="px-4 py-3">Resource</th><th className="px-4 py-3">Result</th></tr></thead><tbody className="divide-y divide-gray-100">{logs.map((log) => <tr key={log._id}><td className="whitespace-nowrap px-4 py-3 text-gray-600">{new Date(log.createdAt).toLocaleString()}</td><td className="px-4 py-3">{log.actor?.name || log.actorEmail}</td><td className="px-4 py-3 font-semibold">{log.action}</td><td className="max-w-[340px] truncate px-4 py-3 font-mono text-xs text-gray-600">{log.resource}</td><td className="px-4 py-3">{log.statusCode}</td></tr>)}</tbody></table></div>}
        <Link to="/admin-dashboard" className="mt-6 inline-block text-sm font-semibold text-rose-700 hover:underline">← Back to overview</Link>
      </section></section>
    </main>
  );
};

export default AdminAuditLogScreen;
