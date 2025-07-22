import { useState } from 'react';
import { useNavigate } from 'react-router';
import { toast } from 'react-toastify';
import { createArtist } from '@/data';

const CreateArtist = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: '',
    musicGenre: '',
    image: '',
    description: '',
    pricePerHour: ''
  });

  const { name, musicGenre, image, description, pricePerHour } = form;

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
      const newArtist = await createArtist({ 
        name, 
        musicGenre, 
        image, 
        description, 
        pricePerHour: parseFloat(pricePerHour) 
      });
      setForm({ name: '', musicGenre: '', image: '', description: '', pricePerHour: '' });
      navigate(`/artist/${newArtist._id}`);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-[800px] bg-gray-600">
      <div className="container mx-auto px-4 py-14">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-15 text-center">Add New Artist</h1>
        
        <form className='flex flex-col gap-6 bg-gray-800 p-8 rounded-lg shadow-lg' onSubmit={handleSubmit}>
          <div className='flex gap-4'>
            <label className='form-control flex-1'>
              <div className='label'>
                <span className='label-text font-semibold'>Artist Name</span>
              </div>
              <input
                name='name'
                value={name}
                onChange={handleChange}
                placeholder='Enter artist name...'
                className='input input-bordered w-full'
                required
              />
            </label>
            
            <label className='form-control flex-1'>
              <div className='label'>
                <span className='label-text font-semibold'>Music Genre</span>
              </div>
              <input
                name='musicGenre'
                value={musicGenre}
                onChange={handleChange}
                placeholder='e.g., House, Techno, Hip-Hop...'
                className='input input-bordered w-full'
                required
              />
            </label>
          </div>

          <label className='form-control w-full'>
            <div className='label'>
              <span className='label-text font-semibold'>Image URL</span>
            </div>
            <input
              name='image'
              value={image}
              onChange={handleChange}
              placeholder='https://example.com/artist-photo.jpg'
              className='input input-bordered w-full'
              required
            />
          </label>

          <label className='form-control w-full'>
            <div className='label'>
              <span className='label-text font-semibold'>Price per Hour (€)</span>
            </div>
            <input
              name='pricePerHour'
              type='number'
              min='0'
              step='0.01'
              value={pricePerHour}
              onChange={handleChange}
              placeholder='150.00'
              className='input input-bordered w-full'
              required
            />
          </label>

          <div className='w-full'>
            <h3 className='text-lg font-semibold text-white mb-3'>Description</h3>
            <textarea
              name='description'
              value={description}
              onChange={handleChange}
              placeholder='Tell us about this artist, their style, experience, and what makes them special...'
              className='textarea textarea-bordered h-32 resize-none w-full'
              required
            />
          </div>

          <button 
            type='submit' 
            className={`btn text-black font-bold text-lg py-3 ${loading ? 'loading' : ''}`}
            style={{backgroundColor: '#BDFF00', border: 'none'}}
            disabled={loading}
          >
            {loading ? 'Adding Artist...' : 'Add Artist'}
          </button>
        </form>
      </div>
      </div>
    </div>
  );
};

export default CreateArtist;
