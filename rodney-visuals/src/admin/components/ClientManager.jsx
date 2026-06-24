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
  const [actionLoading, setActionLoading] = useState(null); 
  const [editingClient, setEditingClient] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [tableLoading, setTableLoading] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    projectName: "",
    slug: "",
    password: "",
    status: "Booked",
    coverImage: "",
    expectedDelivery: "",
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
  setFormData({
  name: client.name || "",
  email: client.email || "",
  phone: client.phone || "",
  projectName: client.projectName || "",
  slug: client.slug || "",
  password: "",
  status: client.status || "Booked",
    coverImage: client.coverImage || "",
  expectedDelivery:
    client.expectedDelivery || "",
});
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
    setTableLoading(false);
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
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Upload files if selected
      if (selectedFiles.length > 0) {
        const fileData = new FormData();

        selectedFiles.forEach((file) => {
          fileData.append("files", file);
        });

        await axios.post(
          `${API_URL}/api/clients/${editingClient}/files`,
          fileData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      }

      showToast("Client updated");

    } else {

      const { data } = await axios.post(
        `${API_URL}/api/clients`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Upload files immediately after creation
      if (selectedFiles.length > 0) {
        const fileData = new FormData();

        selectedFiles.forEach((file) => {
          fileData.append("files", file);
        });

        await axios.post(
          `${API_URL}/api/clients/${data._id}/files`,
          fileData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      }

      showToast("Client created");
    }

    setSelectedFiles([]);
    closeModal();
    fetchClients();

  } catch (error) {
    showToast(
      error.response?.data?.message || "Failed",
      "error"
    );
  } finally {
    setFormLoading(false);
  }
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
const closeModal = () => {
  setIsModalOpen(false);
  setEditingClient(null);
  setSelectedFiles([]);
  setFormData({
    name: "",
    email: "",
    phone: "",
    projectName: "",
    slug: "",
    password: "",
    status: "Booked",
    coverImage: "",
    expectedDelivery: "",
  });
};

const copyPortalLink = async (slug) => {
  try {
    const portalUrl = `${window.location.origin}/client/${slug}`;

    await navigator.clipboard.writeText(portalUrl);

    showToast("Portal link copied");
  } catch (error) {
    console.error(error);
    showToast("Failed to copy link", "error");
  }
};

const getStatusClass = (status) => {
  switch (status) {
    case "Booked":
      return "bg-blue-500/20 text-blue-400";

    case "Coverage Complete":
      return "bg-yellow-500/20 text-yellow-400";

    case "Editing":
      return "bg-purple-500/20 text-purple-400";

    case "Ready For Delivery":
      return "bg-green-500/20 text-green-400";

    case "Delivered":
      return "bg-emerald-500/20 text-emerald-400";

    default:
      return "bg-white/10 text-white";
  }
};

const deleteFile = async (clientId, fileUrl) => {
  if (!window.confirm("Delete this file?")) return;

  try {
    const token = localStorage.getItem("adminToken");

    await axios.delete(
      `${API_URL}/api/clients/${clientId}/files`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        data: {
          url: fileUrl,
        },
      }
    );

    showToast("File deleted");

    fetchClients();
  } catch (error) {
    console.error(error);
    showToast("Failed to delete file", "error");
  }
};
  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between gap-4">


        <button
            onClick={() => {
  setEditingClient(null);
  setSelectedFiles([]);
  setFormData({
    name: "",
    email: "",
    phone: "",
    projectName: "",
    slug: "",
    password: "",
    status: "Booked",
    coverImage: "",
    expectedDelivery: "",
  });

  setIsModalOpen(true);
}}
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
    
    {tableLoading ? (
  <div className="py-20 text-center text-white/50">
    Loading clients...
  </div>
) : (
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
        <span
  className={`px-3 py-1 rounded-full text-xs ${getStatusClass(client.status)}`}
>
  {client.status}
</span>
      </td>

      <td className="p-6">
  <div className="flex items-center gap-3">
    <button
      onClick={() => copyPortalLink(client.slug)}
      className="flex items-center gap-2 text-[#d8b88a] hover:text-[#f0d5af] transition"
    >
      <Copy className="w-4 h-4" />
      Copy
    </button>

    <a
      href={`/client/${client.slug}`}
      target="_blank"
      rel="noreferrer"
      className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 transition"
    >
      View
    </a>
  </div>
</td>

      <td className="p-6">
        <div className=" flex justify-end gap-3">
          <button
  onClick={() => openEdit(client)}
  className="px-4 cursor-pointer py-2 bg-white/10 rounded-xl"
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
  // existing table
)}



    
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
      onClick={() => {
  setEditingClient(null);

  setFormData({
    name: "",
    email: "",
    phone: "",
    projectName: "",
    slug: "",
    password: "",
    status: "Booked",
    coverImage: "",
  expectedDelivery: "",
  });

  setIsModalOpen(true);
}}
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
  {editingClient ? "Edit Client" : "Create New Client"}
</h3>

        <button
          onClick={closeModal}
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

        <select
          name="status"
          value={formData.status}
          onChange={handleChange}
          className="px-4 py-3 bg-white/5 border border-white/10 rounded-2xl focus:outline-none focus:border-[#d8b88a]"
        >
          <option value="Booked">
            Booked
          </option>

          <option value="Coverage Complete">
            Coverage Complete
          </option>

          <option value="Editing">
            Editing
          </option>

          <option value="Ready For Delivery">
            Ready For Delivery
          </option>

          <option value="Delivered">
            Delivered
          </option>
        </select>

        <input
          type="text"
          name="coverImage"
          placeholder="Cover Image URL"
          value={formData.coverImage}
          onChange={handleChange}
          className="px-4 py-3 bg-white/5 border border-white/10 rounded-2xl focus:outline-none focus:border-[#d8b88a]"
        />

        <input
          type="text"
          name="expectedDelivery"
          placeholder="Expected Delivery Date"
          value={formData.expectedDelivery}
          onChange={handleChange}
          className="px-4 py-3 bg-white/5 border border-white/10 rounded-2xl focus:outline-none focus:border-[#d8b88a]"
        />

        <div className="md:col-span-2">
          <label className="block mb-2 text-sm text-white/70">
            Deliverables
          </label>

          <input
            type="file"
            multiple
            onChange={(e) =>
              setSelectedFiles([...e.target.files])
            }
            className="w-full"
          />
        </div>
        {editingClient && (
  <div className="md:col-span-2">
    <p className="mb-2 text-sm text-white/70">
      Uploaded Deliverables
    </p>

    {clients
      .find(c => c._id === editingClient)
      ?.files?.map(file => (
        <div
  key={file.url}
  className="flex items-center justify-between py-2"
>
  <a
    href={file.url}
    target="_blank"
    rel="noreferrer"
    className="text-[#d8b88a]"
  >
    {file.name}
  </a>

  <button
    onClick={() =>
      deleteFile(editingClient, file.url)
    }
    className="text-red-400 hover:text-red-300"
  >
    <Trash2 size={16} />
  </button>
</div>
      ))}
  </div>
)}

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
  disabled={formLoading}
  className="flex-1 cursor-pointer py-3 bg-[#d8b88a] hover:bg-[#c9a675] text-black rounded-2xl font-medium transition disabled:opacity-50"
>
  {formLoading
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