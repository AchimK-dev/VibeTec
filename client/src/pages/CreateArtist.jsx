import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import { createArtist } from "@/data";
import { useAuth } from "@/context";

const CreateArtist = () => {
  const { isDemo } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    musicGenre: "",
    image: "",
    description: "",
    pricePerHour: "",
  });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const { name, musicGenre, image, description, pricePerHour } = form;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!name || !musicGenre || !image || !description || !pricePerHour) {
        throw new Error("All fields are required");
      }
      if (parseFloat(pricePerHour) <= 0) {
        throw new Error("Price per hour must be greater than 0");
      }
      setLoading(true);
      const newArtist = await createArtist({
        name,
        musicGenre,
        image,
        description,
        pricePerHour: parseFloat(pricePerHour),
      });
      setForm({
        name: "",
        musicGenre: "",
        image: "",
        description: "",
        pricePerHour: "",
      });
      navigate(`/artist/${newArtist._id}`);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container-no-padding">
      <div className="bg-base-100 rounded-xl min-h-[calc(100vh-120px)]">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-7xl mx-auto">
            {isDemo && (
              <div className="bg-warning/10 border-2 border-warning rounded-lg p-4 mb-8">
                <div className="flex items-center justify-center gap-3">
                  <div className="text-warning">
                    <svg
                      className="w-8 h-8"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                      />
                    </svg>
                  </div>
                  <div className="text-center">
                    <p className="text-warning font-bold text-lg">
                      Demo Mode - Read-only Access
                    </p>
                    <p className="text-sm text-base-content">
                      All sensitive data is anonymized. Modification actions are
                      disabled.
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="text-center mb-8">
              <h1 className="text-5xl font-bold text-base-content mb-4">
                Admin Dashboard
              </h1>
              <p className="text-xl text-base-content">
                Comprehensive management center for VibeTec
              </p>
            </div>

            <div className="flex justify-center mb-12">
              <div className="bg-base-100 border-1 border-primary rounded-xl p-2 flex space-x-2">
                <button
                  onClick={() => navigate("/admin-dashboard")}
                  type="button"
                  className="px-6 py-3 rounded-lg font-semibold transition-all duration-200 text-base-content hover:text-base-content/60 flex items-center gap-2"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                    />
                  </svg>
                  Overview
                </button>
                <button
                  onClick={() => navigate("/admin-dashboard?tab=bookings")}
                  type="button"
                  className="px-6 py-3 rounded-lg font-semibold transition-all duration-200 text-base-content hover:text-base-content/60 flex items-center gap-2"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  Bookings
                </button>
                <button
                  onClick={() => navigate("/user-management")}
                  type="button"
                  className="px-6 py-3 rounded-lg font-semibold transition-all duration-200 text-base-content hover:text-base-content/60 flex items-center gap-2"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                    />
                  </svg>
                  User Management
                </button>
                <button
                  type="button"
                  className="px-6 py-3 rounded-lg font-semibold transition-all duration-200 bg-primary text-primary-content shadow-md flex items-center gap-2"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                  Create Artist
                </button>
              </div>
            </div>
          </div>

          <div className="max-w-2xl mx-auto">
            <form
              className="flex flex-col gap-6 bg-base-200 p-8 rounded-lg shadow-lg"
              onSubmit={handleSubmit}
            >
              <div className="flex gap-4">
                <label className="form-control flex-1">
                  <div className="label">
                    <span className="label-text font-semibold">
                      Artist Name
                    </span>
                  </div>
                  <input
                    name="name"
                    value={name}
                    onChange={handleChange}
                    placeholder="Enter artist name..."
                    className="input input-bordered w-full"
                    required
                  />
                </label>

                <label className="form-control flex-1">
                  <div className="label">
                    <span className="label-text font-semibold">
                      Music Genre
                    </span>
                  </div>
                  <input
                    name="musicGenre"
                    value={musicGenre}
                    onChange={handleChange}
                    placeholder="e.g., House, Techno, Hip-Hop..."
                    className="input input-bordered w-full"
                    required
                  />
                </label>
              </div>

              <label className="form-control w-full">
                <div className="label">
                  <span className="label-text font-semibold">Image URL</span>
                </div>
                <input
                  name="image"
                  value={image}
                  onChange={handleChange}
                  placeholder="https://example.com/artist-photo.jpg"
                  className="input input-bordered w-full"
                  required
                />
              </label>

              <label className="form-control w-full">
                <div className="label">
                  <span className="label-text font-semibold">
                    Price per Hour (€)
                  </span>
                </div>
                <input
                  name="pricePerHour"
                  type="number"
                  min="0"
                  step="0.01"
                  value={pricePerHour}
                  onChange={handleChange}
                  placeholder="150.00"
                  className="input input-bordered w-full"
                  required
                />
              </label>

              <div className="w-full">
                <h3 className="text-lg font-semibold text-base-content mb-3">
                  Description
                </h3>
                <textarea
                  name="description"
                  value={description}
                  onChange={handleChange}
                  placeholder="Tell us about this artist, their style, experience, and what makes them special..."
                  className="textarea textarea-bordered h-32 resize-none w-full"
                  required
                />
              </div>

              <button
                type="submit"
                className={`btn text-primary-content font-bold text-lg py-3 btn-primary text-primary-content ${
                  loading ? "loading" : ""
                }`}
                disabled={loading}
              >
                {loading ? "Adding Artist..." : "Add Artist"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateArtist;
