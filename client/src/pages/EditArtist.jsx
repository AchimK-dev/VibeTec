import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';
import { toast } from 'react-toastify';
import { getSingleArtist, updateArtist } from '@/data';

const EditArtist = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [form, setForm] = useState({
    name: '',
    musicGenre: '',
    image: '',
    description: '',
    pricePerHour: ''
  });

  const { name, musicGenre, image, description, pricePerHour } = form;

  useEffect(() => {
    (async () => {
      try {
        const artist = await getSingleArtist(id);
        setForm({
          name: artist.name,
          musicGenre: artist.musicGenre,
          image: artist.image,
          description: artist.description,
          pricePerHour: artist.pricePerHour.toString()
        });
      } catch (error) {
        toast.error(error.message);
        navigate('/artists');
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
        throw new Error('All fields are required');
      }
      if (parseFloat(pricePerHour) <= 0) {
        throw new Error('Price per hour must be greater than 0');
      }
      setLoading(true);
      await updateArtist(id, { 
        name, 
        musicGenre, 
        image, 
        description, 
        pricePerHour: parseFloat(pricePerHour) 
      });
      toast.success('Artist updated successfully!');
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
    <div className="min-h-screen bg-gray-600">
      <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Edit Artist</h1>
          <p className="text-white">Update the artist information</p>
        </div>

        <div className="bg-gray-800 rounded-lg shadow-lg p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                Artist Name *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={name}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter artist name"
                required
              />
            </div>

            <div>
              <label htmlFor="musicGenre" className="block text-sm font-medium text-gray-700 mb-2">
                Music Genre *
              </label>
              <select
                id="musicGenre"
                name="musicGenre"
                value={musicGenre}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
            </div>

            <div>
              <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-2">
                Image URL *
              </label>
              <input
                type="url"
                id="image"
                name="image"
                value={image}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="https://example.com/image.jpg"
                required
              />
              {image && (
                <div className="mt-2">
                  <img 
                    src={image} 
                    alt="Preview" 
                    className="w-32 h-32 object-cover rounded-lg border"
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                </div>
              )}
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                id="description"
                name="description"
                value={description}
                onChange={handleChange}
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Describe the artist's style, experience, and specialties..."
                required
              />
            </div>

            <div>
              <label htmlFor="pricePerHour" className="block text-sm font-medium text-gray-700 mb-2">
                Price per Hour (€) *
              </label>
              <input
                type="number"
                id="pricePerHour"
                name="pricePerHour"
                value={pricePerHour}
                onChange={handleChange}
                min="1"
                step="0.01"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="150.00"
                required
              />
            </div>

            <div className="flex gap-4 pt-4">
              <button
                type="button"
                onClick={() => navigate(`/artist/${id}`)}
                className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 px-6 py-3 text-black font-bold rounded-lg transition-colors disabled:opacity-50"
                style={{backgroundColor: '#BDFF00', border: 'none'}}
              >
                {loading ? 'Updating...' : 'Update Artist'}
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
