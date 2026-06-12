import { useEffect, useState } from "react";
import api from "../../api/axios";

export default function GalleryManager() {
  const [gallery, setGallery] = useState([]);

  const [title, setTitle] = useState("");
  const [category, setCategory] =
    useState("");

  const [featured, setFeatured] =
    useState(false);

  const [image, setImage] = useState(null);

  const token =
    localStorage.getItem("adminToken");

  const fetchGallery = async () => {
    const { data } = await api.get(
      "/gallery"
    );

    setGallery(data);
  };

  useEffect(() => {
    fetchGallery();
  }, []);

  const submitHandler = async (e) => {
    e.preventDefault();

    const formData = new FormData();

    formData.append("title", title);
    formData.append("category", category);
    formData.append("featured", featured);
    formData.append("image", image);

    try {
      await api.post(
        "/gallery",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      fetchGallery();

      setTitle("");
      setCategory("");
      setImage(null);
      setFeatured(false);
    } catch (error) {
      console.log(error);
    }
  };

  const deleteHandler = async (id) => {
    if (
      !window.confirm(
        "Delete this image?"
      )
    )
      return;

    await api.delete(
      `/gallery/${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    fetchGallery();
  };

  return (
    <div className="min-h-screen bg-black text-white p-10">

      <h1 className="text-4xl mb-8">
        Gallery Manager
      </h1>

      <form
        onSubmit={submitHandler}
        className="space-y-4 mb-12"
      >
        <input
          placeholder="Title"
          className="w-full p-3 bg-zinc-900 rounded"
          value={title}
          onChange={(e) =>
            setTitle(e.target.value)
          }
        />

        <input
          placeholder="Category"
          className="w-full p-3 bg-zinc-900 rounded"
          value={category}
          onChange={(e) =>
            setCategory(e.target.value)
          }
        />

        <input
          type="file"
          onChange={(e) =>
            setImage(
              e.target.files[0]
            )
          }
        />

        <label className="flex gap-2">
          <input
            type="checkbox"
            checked={featured}
            onChange={(e) =>
              setFeatured(
                e.target.checked
              )
            }
          />
          Featured
        </label>

        <button
          className="bg-[#d8b88a] text-black px-6 py-3 rounded"
        >
          Upload
        </button>
      </form>

      <div className="grid md:grid-cols-4 gap-6">
        {gallery.map((item) => (
          <div
            key={item._id}
            className="bg-zinc-900 rounded-xl overflow-hidden"
          >
            <img
              src={item.image}
              alt=""
              className="h-56 w-full object-cover"
            />

            <div className="p-4">
              <h3>{item.title}</h3>

              <p className="text-zinc-400">
                {item.category}
              </p>

              <button
                onClick={() =>
                  deleteHandler(
                    item._id
                  )
                }
                className="mt-3 bg-red-500 px-4 py-2 rounded"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}