import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  LayoutDashboard, 
  Image, 
  Star, 
  Settings, 
  LogOut, 
  Bell, 
  User,
  ChevronLeft,
  ChevronRight
} from "lucide-react";

import GalleryManager from "./GalleryManager";

export default function Dashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true); // Default expanded

  const logoutHandler = () => {
    localStorage.removeItem("adminToken");
    navigate("/admin/login");
  };

  const tabs = [
    { id: "overview", label: "Overview", icon: LayoutDashboard },
    { id: "gallery", label: "Gallery", icon: Image },
    { id: "hero", label: "Hero Section", icon: Image },
    { id: "testimonials", label: "Testimonials", icon: Star },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-[#080808] text-white">
      {/* Header */}
      <header className="border-b border-white/10 bg-[#0a0a0a]/90 backdrop-blur-md sticky top-0 z-50">
        <div className="px-6 py-5 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsSidebarExpanded(!isSidebarExpanded)}
              className="hidden lg:flex p-2 hover:bg-white/10 rounded-xl transition"
            >
              {isSidebarExpanded ? <ChevronLeft className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
            </button>

            <h1 className="text-3xl font-serif tracking-tight">Rodney Visuals</h1>
            <span className="text-[#d8b88a] text-sm font-medium tracking-widest">ADMIN</span>
          </div>

          <div className="flex items-center gap-6">
            <button className="relative p-2 hover:bg-white/10 rounded-xl transition">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>

            <div className="flex items-center gap-3 pl-4 border-l border-white/10">
              <div className="text-right">
                <p className="font-medium text-sm">Admin</p>
                <p className="text-xs text-white/50">rodneyvisuals.com</p>
              </div>
              <div className="w-9 h-9 bg-[#d8b88a] text-black rounded-full flex items-center justify-center font-semibold">
                RV
              </div>
            </div>

            <button
              onClick={logoutHandler}
              className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 transition border border-red-500/20"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </header>

      <div className="flex h-[calc(100vh-73px)]">
        {/* Sidebar - Sticky & Collapsible */}
        <aside
          className={`border-r border-white/10 bg-[#0a0a0a] transition-all duration-300 overflow-hidden flex-shrink-0
            ${isSidebarExpanded ? "w-72" : "w-20"}`}
        >
          <div className="h-full flex flex-col">
            <div className="p-6 flex-1 overflow-y-auto">
              <nav className="space-y-2">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;

                  return (
                    <button
  key={tab.id}
  onClick={() => setActiveTab(tab.id)}
  className={`
    w-full flex items-center rounded-2xl transition-all duration-200 group relative
    ${isSidebarExpanded ? "gap-3 px-4 py-3.5" : "justify-center py-4"}
    ${
      isActive
        ? "bg-[#d8b88a] text-black shadow-lg shadow-[#d8b88a]/20"
        : "hover:bg-white/5 text-white/80 hover:text-white"
    }
  `}
>
  <Icon
    className={`w-5 h-5 flex-shrink-0 transition-transform duration-200 ${
      !isSidebarExpanded ? "mx-auto" : ""
    } ${!isActive && "group-hover:scale-110"}`}
  />

  {/* Label */}
  {isSidebarExpanded && (
    <span className="font-medium whitespace-nowrap">
      {tab.label}
    </span>
  )}

  {/* Tooltip (only when collapsed) */}
  {!isSidebarExpanded && (
    <div className="absolute left-full ml-3 px-3 py-2 bg-[#1a1a1a] text-sm rounded-xl opacity-0 group-hover:opacity-100 pointer-events-none transition whitespace-nowrap z-50">
      {tab.label}
    </div>
  )}
</button>
                  );
                })}
              </nav>
            </div>

            {/* Sidebar Footer */}
            <div className="p-6 border-t border-white/10 mt-auto">
              <button
                onClick={logoutHandler}
                className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-500/10 rounded-2xl transition"
              >
                <LogOut className="w-5 h-5" />
                {isSidebarExpanded && <span className="font-medium">Logout</span>}
              </button>
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 overflow-auto bg-[#080808] p-6 lg:p-8">
          {/* Page Header */}
          <div className="mb-10">
            <h2 className="text-4xl font-serif capitalize">
              {tabs.find(t => t.id === activeTab)?.label}
            </h2>
            <p className="text-white/50 mt-1">Manage your website content</p>
          </div>

          {/* Content */}
          {activeTab === "overview" && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white/5 border border-white/10 rounded-3xl p-8">
                <p className="text-white/50">Total Images</p>
                <p className="text-5xl font-semibold mt-4">248</p>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-3xl p-8">
                <p className="text-white/50">Hero Slides</p>
                <p className="text-5xl font-semibold mt-4">6</p>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-3xl p-8">
                <p className="text-white/50">Testimonials</p>
                <p className="text-5xl font-semibold mt-4">14</p>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-3xl p-8">
                <p className="text-white/50">Last Updated</p>
                <p className="text-3xl font-semibold mt-4">Today</p>
              </div>
            </div>
          )}

          {activeTab === "gallery" && <GalleryManager />}

          {activeTab === "hero" && (
            <div className="bg-white/5 border border-white/10 rounded-3xl p-10 text-center">
              <h3 className="text-2xl mb-4">Hero Section Manager</h3>
              <p className="text-white/60 mb-8">Manage your homepage hero carousel / banner content</p>
              <button className="px-8 py-4 bg-[#d8b88a] text-black rounded-2xl font-medium hover:scale-105 transition">
                + Add New Slide
              </button>
            </div>
          )}

          {activeTab === "testimonials" && (
            <div className="bg-white/5 border border-white/10 rounded-3xl p-10 text-center">
              <h3 className="text-2xl mb-4">Testimonials Manager</h3>
              <p className="text-white/60 mb-8">Manage client reviews and feedback</p>
              <button className="px-8 py-4 bg-[#d8b88a] text-black rounded-2xl font-medium hover:scale-105 transition">
                + New Testimonial
              </button>
            </div>
          )}

          {activeTab === "settings" && (
            <div className="max-w-2xl mx-auto bg-white/5 border border-white/10 rounded-3xl p-10">
              <h3 className="text-2xl mb-8">Website Settings</h3>
              <div className="space-y-8">
                <div>General Settings • SEO • Contact Info • Social Links</div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}