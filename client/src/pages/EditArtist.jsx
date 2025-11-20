import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import { toast } from "react-toastify";
import { getSingleArtist, updateArtist } from "@/data";

const EditArtist = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [form, setForm] = useState({
    name: "",
    musicGenre: "",
    image: "",
    description: "",
    pricePerHour: "",
  });

  const { name, musicGenre, image, description, pricePerHour } = form;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const artist = await getSingleArtist(id);
        setForm({
          name: artist.name,
          musicGenre: artist.musicGenre,
          image: artist.image,
          description: artist.description,
          pricePerHour: artist.pricePerHour.toString(),
        });
      } catch (error) {
        toast.error(error.message);
        navigate("/artists");
      } finally {
        setInitialLoading(false);
      }
    })();
  }, [id, navigate]);

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
      await updateArtist(id, {
        name,
        musicGenre,
        image,
        description,
        pricePerHour: parseFloat(pricePerHour),
      });
      toast.success("Artist updated successfully!");
      navigate(`/artist/${id}`);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="loading loading-spinner loading-lg"></div>
      </div>
    );
  }

  return (
    <div className="page-container-no-padding">
      <div className="bg-base-100 rounded-xl min-h-screen">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto">
            <h1 className="text-4xl font-bold text-base-content mb-8 text-center">
              Edit Artist
            </h1>

            <form
              className="flex flex-col gap-6 bg-base-200 p-8 rounded-lg shadow-lg"
              onSubmit={handleSubmit}
            >
              <div className="flex flex-col md:flex-row gap-4">
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
                  <select
                    name="musicGenre"
                    value={musicGenre}
                    onChange={handleChange}
                    className="select select-bordered w-full"
                    required
                  >
                    <option value="">Select a genre</option>
                    <option value="House">House</option>
                    <option value="Techno">Techno</option>
                    <option value="Trance">Trance</option>
                    <option value="EDM">EDM</option>
                    <option value="Deep House">Deep House</option>
                    <option value="Progressive">Progressive</option>
                    <option value="Minimal">Minimal</option>
                    <option value="Drum & Bass">Drum & Bass</option>
                    <option value="Hip Hop">Hip Hop</option>
                    <option value="Pop">Pop</option>
                    <option value="Other">Other</option>
                  </select>
                </label>
              </div>

              <label className="form-control w-full">
                <div className="label">
                  <span className="label-text font-semibold">Image URL</span>
                </div>
                <input
                  name="image"
                  type="url"
                  value={image}
                  onChange={handleChange}
                  placeholder="https://example.com/artist-photo.jpg"
                  className="input input-bordered w-full"
                  required
                />
                {image && (
                  <div className="mt-4">
                    <img
                      src={image}
                      alt="Preview"
                      className="w-32 h-32 object-cover rounded-lg border-2 border-base-300"
                      onError={(e) => {
                        e.target.style.display = "none";
                      }}
                    />
                  </div>
                )}
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
                  min="1"
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
                  placeholder="Describe the artist's style, experience, and what makes them special..."
                  className="textarea textarea-bordered h-32 resize-none w-full"
                  required
                />
              </div>

              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => navigate(`/artist/${id}`)}
                  className="btn btn-outline flex-1"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="btn btn-primary text-primary-content font-bold flex-1"
                >
                  {loading ? (
                    <>
                      <span className="loading loading-spinner loading-sm"></span>
                      Updating...
                    </>
                  ) : (
                    "Update Artist"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditArtist;
