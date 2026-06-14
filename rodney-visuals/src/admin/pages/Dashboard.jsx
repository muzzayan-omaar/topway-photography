import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  LayoutDashboard, 
  Image, 
  Star, 
  Settings, 
  Bell, 
  LogOut,
  ChevronLeft,
  ChevronRight
} from "lucide-react";

import GalleryManager from "./GalleryManager";
import HeroManager from "./HeroManager";

export default function Dashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);

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

      <div className="flex h-[calc(100vh-73px)] overflow-hidden">
        {/* Sidebar */}
        <aside
          className={`border-r border-white/10 bg-[#0a0a0a] transition-all duration-300 flex-shrink-0 overflow-hidden
            ${isSidebarExpanded ? "w-72" : "w-20 hover:w-72"}`}
          onMouseEnter={() => !isSidebarExpanded && setIsSidebarExpanded(true)}
          onMouseLeave={() => !isSidebarExpanded && setIsSidebarExpanded(false)}
        >
          <div className="h-full flex flex-col py-6">
            <nav className="flex-1 px-3 space-y-1">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;

                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`
                      w-full flex items-center rounded-2xl py-3 transition-all duration-200 relative group/tab
                      ${isSidebarExpanded ? "px-5 gap-3" : "justify-center"}
                      ${isActive 
                        ? "text-[#d8b88a]" 
                        : "text-white/70 hover:text-white hover:bg-white/5"
                      }
                    `}
                  >
                    {/* Icon */}
                    <div className="flex items-center justify-center w-5 h-5">
                      <Icon 
                        className={`w-5 h-5 transition-all duration-200 flex-shrink-0
                          ${isActive ? "scale-110" : "group-hover/tab:scale-110"}`}
                      />
                    </div>

                    {/* Label */}
                    <span 
                      className={`font-medium whitespace-nowrap transition-all duration-200 overflow-hidden
                        ${isSidebarExpanded 
                          ? "opacity-100 w-auto" 
                          : "opacity-0 w-0"
                        }`}
                    >
                      {tab.label}
                    </span>

                    {/* Active Indicator */}
                    {isActive && (
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-[#d8b88a] rounded-r-full" />
                    )}
                  </button>
                );
              })}
            </nav>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-auto bg-[#080808] p-6 lg:p-8">
          <div className="mb-10">
            <h2 className="text-4xl font-serif capitalize">
              {tabs.find(t => t.id === activeTab)?.label}
            </h2>
            <p className="text-white/50 mt-1">Manage your website content</p>
          </div>

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

          {activeTab === "hero" && <HeroManager />}

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