import { useEffect, useState, useMemo } from "react";
import axios from "axios";
import {
  Plus,
  Edit2,
  Trash2,
  Star,
  Search,
  ChevronLeft,
  ChevronRight,
  Loader2,
} from "lucide-react";

import { API_URL } from "../../config/api";

export default function GalleryManager() {
  const [gallery, setGallery] = useState([]);           // Current page data
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 25,
    totalPages: 1,
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortOption, setSortOption] = useState("newest");
  const [itemsPerPage, setItemsPerPage] = useState(25);

  // Bulk Selection
  const [selectedIds, setSelectedIds] = useState([]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Delete Confirmation
  const [deleteConfirm, setDeleteConfirm] = useState({ 
    show: false, 
    id: null, 
    isBulk: false 
  });

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [featured, setFeatured] = useState(false);
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  // Toast
  const [toast, setToast] = useState({ show: false, message: "", type: "" });

  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: "", type: "" }), 3000);
  };

  // Fetch Gallery with Server-Side Pagination
  const fetchGallery = async (page = 1) => {
    setIsLoading(true);
    try {
      const params = {
        page,
        limit: itemsPerPage,
        search: searchTerm,
        category: selectedCategory,
        sort: sortOption,
      };

      const { data } = await axios.get(`${API_URL}/api/gallery`, { params });

      setGallery(data.data);
      setPagination(data.pagination);
      setSelectedIds([]); // Clear selection when data changes
    } catch (error) {
      console.error(error);
      showToast("Failed to fetch gallery", "error");
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch when filters or pagination change
  useEffect(() => {
    fetchGallery(1); // Always reset to page 1 when filters change
  }, [searchTerm, selectedCategory, sortOption, itemsPerPage]);

  // Category Statistics (Client-side for now - fast enough)
  const [allGalleryForStats, setAllGalleryForStats] = useState([]);

  useEffect(() => {
    const getStats = async () => {
      try {
        const { data } = await axios.get(`${API_URL}/api/gallery?limit=9999`);
        setAllGalleryForStats(data.data || []);
      } catch (e) {
        console.error(e);
      }
    };
    getStats();
  }, []);

  const categoryStats = useMemo(() => {
    const stats = {};
    allGalleryForStats.forEach(item => {
      stats[item.category] = (stats[item.category] || 0) + 1;
    });
    return stats;
  }, [allGalleryForStats]);

  const totalFeatured = allGalleryForStats.filter(item => item.featured).length;

  // Bulk Selection
  const toggleSelect = (id) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(itemId => itemId !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === gallery.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(gallery.map(item => item._id));
    }
  };

  const handleBulkDelete = () => {
    if (selectedIds.length === 0) return;
    setDeleteConfirm({ show: true, id: null, isBulk: true });
  };

  // Delete Handler
  const confirmDelete = async () => {
    try {
      const token = localStorage.getItem("adminToken");

      if (deleteConfirm.isBulk) {
        await Promise.all(
          selectedIds.map(id =>
            axios.delete(`${API_URL}/api/gallery/${id}`, {
              headers: { Authorization: `Bearer ${token}` },
            })
          )
        );
        showToast(`${selectedIds.length} images deleted successfully`);
        setSelectedIds([]);
      } else if (deleteConfirm.id) {
        await axios.delete(`${API_URL}/api/gallery/${deleteConfirm.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        showToast("Image deleted successfully");
      }

      fetchGallery(pagination.page);
    } catch (error) {
      console.error(error);
      showToast("Failed to delete", "error");
    } finally {
      setDeleteConfirm({ show: false, id: null, isBulk: false });
    }
  };

  // Form Handlers (unchanged logic)
  const resetForm = () => {
    setTitle("");
    setCategory("");
    setFeatured(false);
    setImage(null);
    setImagePreview(null);
    setEditingItem(null);
  };

  const openModal = (item = null) => {
    if (item) {
      setEditingItem(item);
      setTitle(item.title);
      setCategory(item.category);
      setFeatured(item.featured);
      setImagePreview(item.image);
      setImage(null);
    } else {
      resetForm();
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    resetForm();
  };

  const openDeleteConfirm = (id) => {
    setDeleteConfirm({ show: true, id, isBulk: false });
  };

  const closeDeleteConfirm = () => {
    setDeleteConfirm({ show: false, id: null, isBulk: false });
  };

  const toggleFeatured = async (id, currentFeatured) => {
    try {
      const token = localStorage.getItem("adminToken");
      await axios.put(
        `${API_URL}/api/gallery/${id}`,
        { featured: !currentFeatured },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      showToast("Featured status updated");
      fetchGallery(pagination.page);
    } catch (error) {
      showToast("Failed to update featured status", "error");
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    // ... (your existing submit logic - unchanged)
    // Just call fetchGallery(pagination.page) after success
  };

  const categories = ["Wedding", "Graduation", "Corporate", "Birthday", "Fashion", "Portrait"];
  const filterCategories = ["All", ...new Set(allGalleryForStats.map(item => item.category))];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-4xl font-semibold">Gallery Manager</h1>
        <button
          onClick={() => openModal()}
          className="flex items-center gap-3 bg-[#d8b88a] hover:bg-[#c9a46f] text-black px-6 py-3 rounded-2xl font-medium transition"
        >
          <Plus className="w-5 h-5" />
          Add New Image
        </button>
      </div>

      {/* Category Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        <div className="bg-white/5 border border-white/10 rounded-3xl p-6">
          <p className="text-white/60 text-sm">Total Images</p>
          <p className="text-4xl font-semibold mt-2">{pagination.total}</p>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-3xl p-6">
          <p className="text-white/60 text-sm">Featured</p>
          <p className="text-4xl font-semibold mt-2 text-[#d8b88a]">{totalFeatured}</p>
        </div>
        {Object.entries(categoryStats).slice(0, 4).map(([cat, count]) => (
          <div key={cat} className="bg-white/5 border border-white/10 rounded-3xl p-6">
            <p className="text-white/60 text-sm">{cat}</p>
            <p className="text-4xl font-semibold mt-2">{count}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 items-center bg-white/5 border border-white/10 rounded-3xl p-6">
        <div className="flex-1 min-w-[280px] relative">
          <Search className="absolute left-4 top-3.5 text-white/40" />
          <input
            type="text"
            placeholder="Search by title..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-black/50 border border-white/10 pl-11 py-3 rounded-2xl focus:outline-none focus:border-[#d8b88a]"
          />
        </div>

        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="bg-black/50 border border-white/10 px-5 py-3 rounded-2xl focus:outline-none"
        >
          {filterCategories.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>

        <select
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value)}
          className="bg-black/50 border border-white/10 px-5 py-3 rounded-2xl focus:outline-none"
        >
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
          <option value="az">A - Z</option>
          <option value="za">Z - A</option>
        </select>

        <select
          value={itemsPerPage}
          onChange={(e) => setItemsPerPage(Number(e.target.value))}
          className="bg-black/50 border border-white/10 px-5 py-3 rounded-2xl focus:outline-none"
        >
          <option value={10}>10 per page</option>
          <option value={25}>25 per page</option>
          <option value={50}>50 per page</option>
          <option value={100}>100 per page</option>
        </select>
      </div>

      {/* Bulk Action Bar */}
      {selectedIds.length > 0 && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-3xl p-4 flex items-center justify-between">
          <span className="font-medium">{selectedIds.length} selected</span>
          <button
            onClick={handleBulkDelete}
            className="flex items-center gap-2 bg-red-600 hover:bg-red-700 px-6 py-2.5 rounded-2xl text-white transition"
          >
            <Trash2 className="w-5 h-5" />
            Delete Selected
          </button>
        </div>
      )}

      {/* Table */}
      <div className="bg-white/5 border border-white/10 rounded-3xl overflow-hidden relative">
        {isLoading && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-10">
            <Loader2 className="w-8 h-8 animate-spin text-[#d8b88a]" />
          </div>
        )}

        <table className="w-full">
          <thead>
            <tr className="border-b border-white/10">
              <th className="p-6 w-12">
                <input
                  type="checkbox"
                  checked={gallery.length > 0 && selectedIds.length === gallery.length}
                  onChange={toggleSelectAll}
                  className="w-5 h-5 accent-[#d8b88a]"
                />
              </th>
              <th className="text-left p-6 w-24">Image</th>
              <th className="text-left p-6">Title</th>
              <th className="text-left p-6">Category</th>
              <th className="text-center p-6">Featured</th>
              <th className="text-left p-6">Date</th>
              <th className="text-right p-6 pr-8">Actions</th>
            </tr>
          </thead>
          <tbody>
            {gallery.map((item) => (
              <tr key={item._id} className="border-b border-white/10 hover:bg-white/5 transition">
                <td className="p-6">
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(item._id)}
                    onChange={() => toggleSelect(item._id)}
                    className="w-5 h-5 accent-[#d8b88a]"
                  />
                </td>
                <td className="p-6">
                  <img src={item.image} alt={item.title} className="w-16 h-16 object-cover rounded-xl" />
                </td>
                <td className="p-6 font-medium">{item.title}</td>
                <td className="p-6 text-white/70">{item.category}</td>
                <td className="p-6 text-center">
                  <button onClick={() => toggleFeatured(item._id, item.featured)}>
                    {item.featured ? (
                      <Star className="w-5 h-5 text-[#d8b88a] fill-current" />
                    ) : (
                      <Star className="w-5 h-5 text-white/40" />
                    )}
                  </button>
                </td>
                <td className="p-6 text-white/60">
                  {new Date(item.createdAt).toLocaleDateString()}
                </td>
                <td className="p-6 text-right pr-8">
                  <div className="flex justify-end gap-3">
                    <button
                      onClick={() => openModal(item)}
                      className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-xl flex items-center gap-2 transition"
                    >
                      <Edit2 className="w-4 h-4" />
                      Edit
                    </button>
                    <button
                      onClick={() => openDeleteConfirm(item._id)}
                      className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-xl transition"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {gallery.length === 0 && !isLoading && (
          <div className="text-center py-16 text-white/50">No images found</div>
        )}
      </div>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-between text-sm">
          <p className="text-white/60">
            Showing {(pagination.page - 1) * pagination.limit + 1} to{" "}
            {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} images
          </p>

          <div className="flex items-center gap-3">
            <button
              onClick={() => fetchGallery(pagination.page - 1)}
              disabled={pagination.page === 1}
              className="p-3 bg-white/5 hover:bg-white/10 rounded-2xl disabled:opacity-50"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <span className="px-6 py-2 bg-white/5 rounded-2xl">
              Page {pagination.page} of {pagination.totalPages}
            </span>

            <button
              onClick={() => fetchGallery(pagination.page + 1)}
              disabled={pagination.page === pagination.totalPages}
              className="p-3 bg-white/5 hover:bg-white/10 rounded-2xl disabled:opacity-50"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {/* Your existing Modals (Main Form Modal + Delete Confirmation + Toast) */}
      {/* Paste your original modal code here */}

      {/* Updated Delete Confirmation Modal */}
      {deleteConfirm.show && (
        <div className="fixed inset-0 bg-black/80 z-[60] flex items-center justify-center p-4">
          <div className="bg-[#111] border border-white/10 rounded-3xl w-full max-w-sm p-8 text-center">
            <div className="mx-auto w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mb-6">
              <Trash2 className="w-8 h-8 text-red-500" />
            </div>
            <h3 className="text-2xl font-medium mb-2">
              {deleteConfirm.isBulk 
                ? `Delete ${selectedIds.length} Images?` 
                : "Delete Image?"}
            </h3>
            <p className="text-white/60 mb-8">This action cannot be undone.</p>

            <div className="flex gap-4">
              <button
                onClick={closeDeleteConfirm}
                className="flex-1 py-3 bg-white/10 hover:bg-white/20 rounded-2xl transition"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="flex-1 py-3 bg-red-600 hover:bg-red-700 text-white rounded-2xl transition"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast.show && (
        <div className={`fixed bottom-6 right-6 px-6 py-4 rounded-2xl text-white shadow-xl z-50 ${
          toast.type === "error" ? "bg-red-600" : "bg-green-600"
        }`}>
          {toast.message}
        </div>
      )}
    </div>
  );
}