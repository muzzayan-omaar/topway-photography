import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../../config/api";

export default function ClientDashboard() {
  const { slug } = useParams();

  const [client, setClient] = useState(null);

  const fetchPortal = async () => {
    try {
      const { data } = await axios.get(
        `${API_URL}/api/clients/portal/${slug}`
      );

      setClient(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchPortal();
  }, []);

  if (!client) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  return (
  <div className="min-h-screen bg-[#080808] text-white">

    {/* Hero */}
    <div className="relative h-[260px]">

      {client.coverImage ? (
        <img
          src={client.coverImage}
          alt={client.projectName}
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="w-full h-full bg-gradient-to-br from-[#111] to-[#1b1b1b]" />
      )}

      <div className="absolute inset-0 bg-black/55" />

      <div className="absolute bottom-0 left-0 right-0 p-6">
        <p className="text-[#d8b88a] uppercase tracking-[0.3em] text-[10px]">
          Nova Client Portal
        </p>

        <h1 className="text-3xl font-serif mt-2">
          {client.projectName}
        </h1>

        <p className="text-white/70 mt-1">
          {client.name}
        </p>
      </div>
    </div>

    <div className="px-5 py-6 space-y-6 max-w-4xl mx-auto">

      {/* Status Card */}
      <div className="bg-white/5 border border-white/10 rounded-3xl p-5">

        <p className="text-white/50 text-sm mb-3">
          Project Status
        </p>

        <span className="inline-flex px-4 py-2 rounded-full bg-[#d8b88a]/20 text-[#d8b88a] text-sm">
          {client.status}
        </span>

      </div>

      {/* Timeline */}
      <div className="bg-white/5 border border-white/10 rounded-3xl p-5">

        <h3 className="font-medium mb-5">
          Project Progress
        </h3>

        {[
          "Booked",
          "Coverage Complete",
          "Editing",
          "Ready For Delivery",
          "Delivered",
        ].map((step, index) => {
          const currentIndex = [
            "Booked",
            "Coverage Complete",
            "Editing",
            "Ready For Delivery",
            "Delivered",
          ].indexOf(client.status);

          const active = index <= currentIndex;

          return (
            <div
              key={step}
              className="flex items-center gap-4 mb-5 last:mb-0"
            >
              <div
                className={`w-4 h-4 rounded-full ${
                  active
                    ? "bg-[#d8b88a]"
                    : "bg-white/20"
                }`}
              />

              <span
                className={`text-sm ${
                  active
                    ? "text-white"
                    : "text-white/40"
                }`}
              >
                {step}
              </span>
            </div>
          );
        })}
      </div>

      {/* Message */}
      <div className="bg-white/5 border border-white/10 rounded-3xl p-5">

        <h3 className="font-medium mb-4">
          Message From Nova
        </h3>

        <p className="text-white/70 leading-relaxed">
          {client.clientMessage ||
            "Your project is currently being processed. We will keep you updated as progress is made."}
        </p>

      </div>

      {/* Coming Soon */}
      <div className="bg-white/5 border border-dashed border-white/10 rounded-3xl p-8 text-center">

        <h3 className="text-lg font-medium">
          Media Center
        </h3>

        <p className="text-white/50 mt-2">
          Photos, videos and downloads will appear here once delivery is ready.
        </p>

      </div>

    </div>
  </div>
);
}