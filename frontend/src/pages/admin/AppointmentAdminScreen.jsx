import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { CalendarDays, Check, Clock3, X } from "lucide-react";
import api from "../../services/api";
import AdminSidebar from "./components/AdminSidebar";

const formatAppointmentDate = (date) => {
  if (!date) return "Date unavailable";
  return new Date(`${date}T00:00:00`).toLocaleDateString(undefined, {
    weekday: "short", year: "numeric", month: "short", day: "numeric",
  });
};

const statusStyle = {
  pending: "bg-amber-50 text-amber-800",
  confirmed: "bg-emerald-50 text-emerald-800",
  completed: "bg-sky-50 text-sky-800",
  cancelled: "bg-gray-100 text-gray-600",
};

const AppointmentAdminScreen = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [savingId, setSavingId] = useState("");

  const loadAppointments = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const { data } = await api.get("/appointments");
      setAppointments(Array.isArray(data) ? data : []);
    } catch (requestError) {
      setError(requestError?.response?.data?.message || "Unable to load appointment requests.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadAppointments(); }, [loadAppointments]);

  const updateStatus = async (appointment, status) => {
    setSavingId(appointment._id);
    setError("");
    try {
      const { data } = await api.put(`/appointments/${appointment._id}/status`, { status });
      setAppointments((current) => current.map((item) => item._id === appointment._id ? data : item));
    } catch (requestError) {
      setError(requestError?.response?.data?.message || "Unable to update appointment status.");
    } finally {
      setSavingId("");
    }
  };

  return (
    <main className="min-h-screen bg-white text-gray-950">
      <section className="bg-[#f7f1ee] px-6 py-12 sm:py-16">
        <div className="mx-auto max-w-[1460px]">
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-rose-700">Consultant operations</p>
          <h1 className="mt-2 text-3xl font-bold sm:text-4xl">Appointment requests</h1>
          <p className="mt-3 max-w-2xl text-gray-600">Review requests, confirm suitable appointments, and keep their status up to date.</p>
        </div>
      </section>

      <section className="mx-auto grid max-w-[1460px] gap-10 px-6 py-10 lg:grid-cols-[315px_1fr]">
        <AdminSidebar />
        <section className="min-w-0">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
            <div><h2 className="text-2xl font-bold">Consultations</h2><p className="mt-1 text-sm text-gray-500">{appointments.length} requests in the system</p></div>
            <button type="button" onClick={loadAppointments} className="border border-gray-300 px-4 py-2 text-sm font-semibold hover:border-gray-900">Refresh</button>
          </div>

          {error && <div role="alert" className="mb-5 border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">{error}</div>}
          {loading ? <div className="border border-gray-200 px-6 py-16 text-center text-sm text-gray-500">Loading appointment requests…</div> : appointments.length === 0 ? <div className="border border-gray-200 px-6 py-16 text-center text-gray-600">No appointment requests yet.</div> : (
            <div className="space-y-4">
              {appointments.map((appointment) => (
                <article key={appointment._id} className="border border-gray-200 p-5 sm:p-6">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-3">
                        <h3 className="text-lg font-bold">{appointment.name}</h3>
                        <span className={`rounded-full px-3 py-1 text-xs font-bold capitalize ${statusStyle[appointment.status] || statusStyle.pending}`}>{appointment.status}</span>
                      </div>
                      <a href={`mailto:${appointment.email}`} className="mt-1 inline-block text-sm text-rose-700 hover:underline">{appointment.email}</a>
                      <p className="mt-4 flex items-center gap-2 text-sm font-semibold"><CalendarDays size={16} />{formatAppointmentDate(appointment.appointmentDate)} <Clock3 size={16} className="ml-2" />{appointment.time}</p>
                      <p className="mt-2 text-sm text-gray-600">{appointment.mode}{appointment.phone ? ` · ${appointment.phone}` : ""}</p>
                      {appointment.concern && <p className="mt-3 text-sm"><span className="font-semibold">Concern:</span> {appointment.concern}</p>}
                      {appointment.notes && <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-gray-600">{appointment.notes}</p>}
                    </div>
                    <div className="flex shrink-0 flex-wrap gap-2">
                      {appointment.status === "pending" && <>
                        <button disabled={savingId === appointment._id} onClick={() => updateStatus(appointment, "confirmed")} className="inline-flex items-center gap-2 bg-emerald-700 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-800 disabled:opacity-50"><Check size={16} />Confirm</button>
                        <button disabled={savingId === appointment._id} onClick={() => updateStatus(appointment, "cancelled")} className="inline-flex items-center gap-2 border border-gray-300 px-4 py-2 text-sm font-semibold hover:border-red-500 hover:text-red-700 disabled:opacity-50"><X size={16} />Decline</button>
                      </>}
                      {appointment.status === "confirmed" && <button disabled={savingId === appointment._id} onClick={() => updateStatus(appointment, "completed")} className="inline-flex items-center gap-2 bg-[#272323] px-4 py-2 text-sm font-semibold text-white hover:bg-rose-700 disabled:opacity-50"><Check size={16} />Mark complete</button>}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
          <p className="mt-5 text-xs leading-5 text-gray-500">Confirming or cancelling updates the appointment record and sends the customer a status email when email delivery is configured.</p>
          <Link to="/admin-dashboard" className="mt-6 inline-block text-sm font-semibold text-rose-700 hover:underline">← Back to overview</Link>
        </section>
      </section>
    </main>
  );
};

export default AppointmentAdminScreen;
