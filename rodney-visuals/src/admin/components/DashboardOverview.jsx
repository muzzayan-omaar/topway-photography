import { useEffect, useState } from "react";
import axios from "../../api/axios";

import {
  Users,
  Briefcase,
  CheckCircle,
  Clock3,
  Image,
  MessageSquare,
  Layout,
  Plus,
  TrendingUp,
  Eye,
} from "lucide-react";

export default function DashboardOverview() {
  const [stats, setStats] = useState({
    totalClients: 0,
    activeProjects: 0,
    readyForDelivery: 0,
    delivered: 0,
  });

  const [trends, setTrends] = useState({
    totalClients: "+0",
    activeProjects: "+0",
    readyForDelivery: "+0",
    delivered: "+0",
  });

  const [monthlyGrowth, setMonthlyGrowth] = useState(0);

  const [pipeline, setPipeline] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [recentClients, setRecentClients] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem("adminToken");
      const API_URL = import.meta.env.VITE_API_URL || "";

      const { data: clients } = await axios.get(`${API_URL}/api/clients`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // KPI Stats
      const totalClients = clients.length;
      const activeProjects = clients.filter((c) => c.status !== "Delivered").length;
      const readyForDelivery = clients.filter((c) => c.status === "Ready For Delivery").length;
      const delivered = clients.filter((c) => c.status === "Delivered").length;

      setStats({
        totalClients,
        activeProjects,
        readyForDelivery,
        delivered,
      });

      // Monthly Growth Calculation
      const now = new Date();
      const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
      const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);

      const thisMonthClients = clients.filter(
        (c) => new Date(c.createdAt) >= thisMonthStart
      ).length;

      const lastMonthClients = clients.filter(
        (c) =>
          new Date(c.createdAt) >= lastMonthStart &&
          new Date(c.createdAt) < thisMonthStart
      ).length;

      const growth =
        lastMonthClients > 0
          ? Math.round(((thisMonthClients - lastMonthClients) / lastMonthClients) * 100)
          : thisMonthClients > 0
          ? 100
          : 0;

      setMonthlyGrowth(growth);

      // Simple KPI Trends
      setTrends({
        totalClients: thisMonthClients >= lastMonthClients ? `+${thisMonthClients - lastMonthClients}` : `${thisMonthClients - lastMonthClients}`,
        activeProjects: activeProjects > 0 ? "+3" : "0", // Improve later with better data
        readyForDelivery: readyForDelivery > 2 ? "+2" : "0",
        delivered: delivered > 0 ? `+${Math.floor(delivered * 0.15)}` : "+0",
      });

      // Pipeline
      setPipeline([
        { label: "Booked", count: clients.filter((c) => c.status === "Booked").length, color: "#d8b88a" },
        { label: "Coverage Complete", count: clients.filter((c) => c.status === "Coverage Complete").length, color: "#c4a36b" },
        { label: "Editing", count: clients.filter((c) => c.status === "Editing").length, color: "#b38f5e" },
        { label: "Ready For Delivery", count: readyForDelivery, color: "#d8b88a" },
        { label: "Delivered", count: delivered, color: "#a1e8a1" },
      ]);

      // Recent Projects
      const recent = [...clients]
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 5);

      setRecentClients(
        recent.map((client) => ({
          name: client.projectName || "Untitled Project",
          status: client.status,
          progress:
            client.status === "Booked"
              ? 20
              : client.status === "Coverage Complete"
              ? 40
              : client.status === "Editing"
              ? 70
              : client.status === "Ready For Delivery"
              ? 95
              : 100,
          slug: client.slug,
        }))
      );

      // Delivery Alerts
      const alertClients = clients
        .filter((c) => c.expectedDelivery && c.status !== "Delivered")
        .slice(0, 6);

      setAlerts(
        alertClients.map((client) => ({
          project: client.projectName || "Untitled Project",
          due: client.expectedDelivery,
          slug: client.slug,
        }))
      );
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96 text-white/60 text-lg">
        Loading dashboard...
      </div>
    );
  }

  return (
    <div className="space-y-8 p-6">
      {/* Header */}
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-white/60 mt-1">Good morning, let's make today productive</p>
        </div>
        <div className="flex items-center gap-3 text-sm text-white/60">
          <span>{new Date().toLocaleDateString("en-GB")}</span>
          <div className="w-px h-4 bg-white/20" />
          <span className={`flex items-center gap-1 ${monthlyGrowth >= 0 ? "text-emerald-400" : "text-red-400"}`}>
            <TrendingUp size={16} />
            {monthlyGrowth >= 0 ? "+" : ""}
            {monthlyGrowth}% this month
          </span>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {[
          { label: "Total Clients", value: stats.totalClients, icon: Users, trend: trends.totalClients },
          { label: "Active Projects", value: stats.activeProjects, icon: Briefcase, trend: trends.activeProjects },
          { label: "Ready For Delivery", value: stats.readyForDelivery, icon: Clock3, trend: trends.readyForDelivery },
          { label: "Delivered", value: stats.delivered, icon: CheckCircle, trend: trends.delivered },
        ].map((stat, i) => (
          <div
            key={i}
            className="group bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-xl border border-white/10 rounded-3xl p-6 hover:border-[#d8b88a]/40 hover:-translate-y-1 transition-all duration-300"
          >
            <div className="flex justify-between items-start">
              <stat.icon className="w-8 h-8 text-[#d8b88a]" />
              <span
                className={`text-xs px-3 py-1 rounded-full font-medium ${
                  stat.trend.startsWith("+") || stat.trend === "0"
                    ? "bg-emerald-500/20 text-emerald-400"
                    : "bg-red-500/20 text-red-400"
                }`}
              >
                {stat.trend}
              </span>
            </div>
            <h2 className="text-4xl font-bold mt-6 tracking-tighter">{stat.value}</h2>
            <p className="text-white/60 mt-1 text-lg">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Project Pipeline */}
        <div className="xl:col-span-2 bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-2xl font-medium">Project Pipeline</h3>
            <span className="text-sm text-white/50">Total Active: {stats.activeProjects}</span>
          </div>

          <div className="space-y-7">
            {pipeline.map((item, index) => (
              <div key={index} className="group">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-white/90 font-medium">{item.label}</span>
                  <span className="font-mono text-2xl font-semibold text-[#d8b88a]">
                    {item.count}
                  </span>
                </div>
                <div className="h-3 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500 group-hover:scale-x-105 origin-left"
                    style={{
                      width: `${Math.min(item.count * 7.5, 100)}%`,
                      background: `linear-gradient(90deg, ${item.color}, #f5d9a0)`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Delivery Alerts */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-medium">Delivery Alerts</h3>
            <span className="text-sm text-white/50">{alerts.length} active</span>
          </div>

          {/* Filter Bar */}
          <div className="flex gap-2 mb-6 border-b border-white/10 pb-4">
            {["All", "Today", "Tomorrow", "This Week"].map((filter) => (
              <button
                key={filter}
                className={`px-5 py-2 text-sm rounded-2xl transition-all ${
                  filter === "All" ? "bg-white/10 text-white font-medium" : "hover:bg-white/5 text-white/70"
                }`}
              >
                {filter}
              </button>
            ))}
          </div>

          <div className="space-y-1">
            {alerts.map((alert, i) => {
              const dueLower = alert.due.toLowerCase();
              const dueColor = dueLower.includes("today")
                ? "text-red-400"
                : dueLower.includes("tomorrow")
                ? "text-orange-400"
                : "text-emerald-400";

              return (
                <div
                  key={i}
                  className="group flex items-center justify-between py-4 px-5 rounded-xl hover:bg-white/5 transition-all duration-200"
                >
                  <div className="flex-1">
                    <p className="font-medium text-white">{alert.project}</p>
                    <p className={`text-sm mt-0.5 font-medium ${dueColor}`}>{alert.due}</p>
                  </div>

                  <button
                    onClick={() => window.open(`/client/${alert.slug}`, "_blank")}
                    className="p-3 text-white/60 hover:text-white transition-colors cursor-pointer opacity-70 group-hover:opacity-100"
                    title="View Project"
                  >
                    <Eye size={20} />
                  </button>
                </div>
              );
            })}
          </div>

          {alerts.length >= 3 && (
            <button className="mt-6 w-full py-3 text-sm font-medium text-[#d8b88a] hover:text-[#f0d9a8] border border-white/10 hover:border-[#d8b88a]/30 rounded-2xl transition">
              View All Alerts →
            </button>
          )}
        </div>
      </div>

      {/* Recent Projects + Content Stats */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        {/* Recent Projects */}
        <div className="xl:col-span-8 bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-2xl font-medium">Recent Projects</h3>
            <button className="text-sm text-[#d8b88a] hover:text-[#f0d9a8] flex items-center gap-1.5 transition">
              View All <span className="text-lg leading-none">→</span>
            </button>
          </div>

          <div className="space-y-2">
            {recentClients.map((client, i) => (
              <div
                key={i}
                className="group flex items-center justify-between py-5 px-6 rounded-2xl hover:bg-white/5 transition-all duration-200 cursor-pointer"
              >
                <div className="flex items-center gap-5">
                  <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#d8b88a]/10 to-transparent flex items-center justify-center text-2xl border border-white/10 flex-shrink-0">
                    📸
                  </div>
                  <div>
                    <p className="font-medium text-lg text-white group-hover:text-[#d8b88a] transition-colors">
                      {client.name}
                    </p>
                    <p className="text-white/60 text-sm">{client.status}</p>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-xs text-white/50 mb-1 tracking-widest">PROGRESS</div>
                  <div className="text-3xl font-semibold text-[#d8b88a] tabular-nums">
                    {client.progress}%
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Content Stats */}
        <div className="xl:col-span-4 space-y-6">
          {[
            { icon: Image, label: "Gallery Items", value: 124 },
            { icon: MessageSquare, label: "Testimonials", value: 17 },
            { icon: Layout, label: "Hero Slides", value: 5 },
          ].map((item, i) => (
            <div
              key={i}
              className="bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-xl border border-white/10 rounded-3xl p-7 hover:border-white/20 group transition-all hover:-translate-y-0.5"
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-5xl font-bold tracking-tighter text-white mb-1">
                    {item.value}
                  </div>
                  <p className="text-white/60 text-[17px]">{item.label}</p>
                </div>
                <div className="p-4 rounded-2xl bg-white/5 group-hover:bg-white/10 transition-colors">
                  <item.icon className="w-8 h-8 text-[#d8b88a]" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}