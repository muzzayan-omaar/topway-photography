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
    <div className="min-h-screen bg-[#080808]">
      <div className="max-w-6xl mx-auto px-5 py-12">

        <h1 className="text-4xl font-serif">
          {client.projectName}
        </h1>

        <p className="text-white/50 mt-2">
          {client.name}
        </p>

        <div className="mt-8 p-6 bg-white/5 border border-white/10 rounded-3xl">
          <h3 className="text-xl mb-3">
            Project Status
          </h3>

          <span className="px-4 py-2 bg-[#d8b88a]/20 text-[#d8b88a] rounded-full">
            {client.status}
          </span>
        </div>

      </div>
    </div>
  );
}