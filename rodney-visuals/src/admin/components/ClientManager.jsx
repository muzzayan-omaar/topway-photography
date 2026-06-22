import { useEffect, useState } from "react";
import axios from "axios";
import {
  Plus,
  Search,
  Trash2,
  Edit2,
  Copy,
  X,
} from "lucide-react";

import { API_URL } from "../../config/api";

export default function ClientManager() {
  const [clients, setClients] = useState([]);
  const [filteredClients, setFilteredClients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(null); 
  const [editingClient, setEditingClient] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [tableLoading, setTableLoading] = useState(false);
const [formLoading, setFormLoading] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    projectName: "",
    slug: "",
    password: "",
  });

  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "",
  });

  const showToast = (message, type = "success") => {
    setToast({
      show: true,
      message,
      type,
    });

    setTimeout(() => {
      setToast({
        show: false,
        message: "",
        type: "",
      });
    }, 3000);
  };
const openEdit = (client) => {
  setFormData(client);
  setEditingClient(client._id);
  setIsModalOpen(true);

};


  const fetchClients = async () => {
  setTableLoading(true);

  try {
    const token = localStorage.getItem("adminToken");

    const { data } = await axios.get(`${API_URL}/api/clients`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    setClients(data);
    setFilteredClients(data);
  } catch (error) {
    console.error(error);
    showToast("Failed to fetch clients", "error");
  } finally {
    setLoading(false);
  }
};

useEffect(() => {
  fetchClients();
}, []);

useEffect(() => {
  let results = [...clients];

  if (searchTerm) {
    results = results.filter((client) =>
      client.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    );
  }

  setFilteredClients(results);
}, [searchTerm, clients]);

const handleChange = (e) => {
  setFormData({
    ...formData,
    [e.target.name]: e.target.value,
  });
};

const createClient = async (e) => {
  e.preventDefault();
  setFormLoading(true);

  try {
    const token = localStorage.getItem("adminToken");

    if (editingClient) {
      await axios.put(
        `${API_URL}/api/clients/${editingClient}`,
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      showToast("Client updated");
    } else {
      await axios.post(`${API_URL}/api/clients`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      showToast("Client created");
    }

    setIsModalOpen(false);
    setEditingClient(null);

    setFormData({
      name: "",
      email: "",
      phone: "",
      projectName: "",
      slug: "",
      password: "",
    });

    fetchClients();
  } catch (error) {
    showToast(error.response?.data?.message || "Failed", "error");
  } finally {
    setLoading(false);
  }
};
const copyPortalLink = (slug) => {
  const link = `${window.location.origin}/client/${slug}`;

  navigator.clipboard.writeText(link);

  showToast("Portal link copied");
};
const deleteClient = async (id) => {
  if (!window.confirm("Delete this client?")) return;

  setActionLoading(id);

  try {
    const token = localStorage.getItem("adminToken");

    await axios.delete(`${API_URL}/api/clients/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    showToast("Client deleted");
    fetchClients();
  } catch (error) {
    console.error(error);
    showToast("Failed to delete client", "error");
  } finally {
    setActionLoading(null);
  }
};
if (loading) {
  return (
    <div className="text-center py-20 text-white/50">
      Loading clients...
    </div>
  );
}
const closeModal = () => {
  setIsModalOpen(false);
  setEditingClient(null);
  setFormData({
    name: "",
    email: "",
    phone: "",
    projectName: "",
    slug: "",
    password: "",
  });
};
  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between gap-4">


        <button
            onClick={() => setIsModalOpen(true)}
            className="flex cursor-pointer items-center gap-3 px-6 py-3.5 bg-[#d8b88a] hover:bg-[#c9a675] text-black rounded-2xl font-medium transition"
        >
            <Plus className="w-5 h-5" />
            New Client
        </button>
        </div>

        <>
  {/* Search */}
  <div className="relative">
    <Search className="absolute left-4 top-3.5 w-5 h-5 text-white/50" />

    <input
      type="text"
      placeholder="Search clients..."
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-2xl focus:outline-none focus:border-[#d8b88a]/50"
    />
  </div>

  {/* Clients Table */}
  <div className="bg-white/5 border border-white/10 rounded-3xl overflow-hidden">
  
    <table className="w-full">
      <thead>
        <tr className="border-b border-white/10">
          <th className="text-left p-6">Client</th>
          <th className="text-left p-6">Project</th>
          <th className="text-left p-6">Status</th>
          <th className="text-left p-6">Portal</th>
          <th className="text-right p-6">Actions</th>
        </tr>
      </thead>

      <tbody>
        
  {filteredClients.map((client) => (
    <tr
      key={client._id}
      className="border-b border-white/10 last:border-none"
    >
      <td className="p-6">
        <div>
          <p className="font-medium">
            {client.name}
          </p>

          <p className="text-sm text-white/50">
            {client.email}
          </p>
        </div>
      </td>

      <td className="p-6">
        {client.projectName}
      </td>

      <td className="p-6">
        <span className="px-3 py-1 rounded-full text-xs bg-yellow-500/20 text-yellow-400">
          {client.status}
        </span>
      </td>

      <td className="p-6">
        <button
  onClick={() => copyPortalLink(client.slug)}
  className="flex cursor-pointer items-center gap-2 text-[#d8b88a]"
>
          <Copy className="w-4 h-4" />
          Copy Link
        </button>
      </td>

      <td className="p-6">
        <div className="cursor-pointer flex justify-end gap-3">
          <button
  onClick={() => openEdit(client)}
  className="px-4 https://topway-photography.vercel.app/client/muzzayanomaar py-2 bg-white/10 rounded-xl"
>
            <Edit2 className="w-4 h-4" />
          </button>

          <button
  onClick={() => deleteClient(client._id)}
  disabled={actionLoading === client._id}
  className="cursor-pointer px-4 py-2 bg-red-500/20 text-red-400 rounded-xl disabled:opacity-50"
>
  {actionLoading === client._id ? "..." : <Trash2 className="w-4 h-4" />}
</button>
        </div>
      </td>
    </tr>
  ))}
</tbody>
    </table>

    
  </div>
  {filteredClients.length === 0 && (
  <div className="bg-white/5 border border-white/10 rounded-3xl py-20 flex flex-col items-center justify-center text-center">
    <div className="w-20 h-20 rounded-full bg-[#d8b88a]/10 flex items-center justify-center mb-6">
      <Plus className="w-10 h-10 text-[#d8b88a]" />
    </div>

    <h3 className="text-2xl font-medium mb-2">
      No Clients Yet
    </h3>

    <p className="text-white/50 max-w-md mb-8">
      Create your first client project and start managing
      media deliveries, downloads and project progress.
    </p>

    <button
      onClick={() => setIsModalOpen(true)}
      className="flex cursor-pointer items-center gap-3 px-6 py-3 bg-[#d8b88a] text-black rounded-2xl font-medium hover:bg-[#c9a675] transition"
    >
      <Plus className="w-5 h-5" />
      Create First Client
    </button>
  </div>
)}
</>

{/* Create Client Modal */}
{isModalOpen && (
  <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
    <div className="bg-[#111] border border-white/10 rounded-3xl w-full max-w-2xl overflow-hidden">

      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-white/10">
        <h3 className="text-2xl font-medium">
          Create New Client
        </h3>

        <button
          onClick={() => setIsModalOpen(false)}
          className="p-2 cursor-pointer hover:bg-white/10 rounded-xl transition"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Form */}
      <form
        onSubmit={createClient}
        className="p-6 grid md:grid-cols-2 gap-5"
      >
        <input
          type="text"
          name="name"
          placeholder="Client Name"
          value={formData.name}
          onChange={handleChange}
          required
          className="px-4 py-3 bg-white/5 border border-white/10 rounded-2xl focus:outline-none focus:border-[#d8b88a]"
        />

        <input
          type="email"
          name="email"
          placeholder="Email Address"
          value={formData.email}
          onChange={handleChange}
          required
          className="px-4 py-3 bg-white/5 border border-white/10 rounded-2xl focus:outline-none focus:border-[#d8b88a]"
        />

        <input
          type="text"
          name="phone"
          placeholder="Phone Number"
          value={formData.phone}
          onChange={handleChange}
          required
          className="px-4 py-3 bg-white/5 border border-white/10 rounded-2xl focus:outline-none focus:border-[#d8b88a]"
        />

        <input
          type="text"
          name="projectName"
          placeholder="Project Name"
          value={formData.projectName}
          onChange={handleChange}
          required
          className="px-4 py-3 bg-white/5 border border-white/10 rounded-2xl focus:outline-none focus:border-[#d8b88a]"
        />

        <input
          type="text"
          name="slug"
          placeholder="Portal URL Slug"
          value={formData.slug}
          onChange={handleChange}
          required
          className="px-4 py-3 bg-white/5 border border-white/10 rounded-2xl focus:outline-none focus:border-[#d8b88a]"
        />

        <input
          type="text"
          name="password"
          placeholder="Portal Password"
          value={formData.password}
          onChange={handleChange}
          required
          className="px-4 py-3 bg-white/5 border border-white/10 rounded-2xl focus:outline-none focus:border-[#d8b88a]"
        />

        <div className="md:col-span-2 flex gap-4 pt-4">
          <button
            type="button"
            onClick={closeModal}
            className="flex-1 py-3 cursor-pointer bg-white/10 hover:bg-white/20 rounded-2xl transition"
          >
            Cancel
          </button>

          <button
  type="submit"
  disabled={loading}
  className="flex-1 cursor-pointer py-3 bg-[#d8b88a] hover:bg-[#c9a675] text-black rounded-2xl font-medium transition disabled:opacity-50"
>
  {loading
    ? "Processing..."
    : editingClient
    ? "Update Client"
    : "Create Client"}
</button>
        </div>
      </form>

    </div>
  </div>
)}
    </div>
  );
}