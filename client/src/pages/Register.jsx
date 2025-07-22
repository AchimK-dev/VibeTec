import { useAuth } from '@/context';
import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router';
import { toast } from 'react-toastify';

const Register = () => {
  const [{ firstName, lastName, email, password, confirmPassword }, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const { signup, user, setCheckSession } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  if (user) {
    return <Navigate to={'/'} />;
  }

  const handleChange = (e) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      if (!firstName || !lastName || !email || !password || !confirmPassword)
        throw new Error('All fields are required');
      if (password !== confirmPassword) throw new Error('Passwords do not match');
      setLoading(true);
      const res = await signup({ firstName, lastName, email, password });
      if (res.error) {
        setError(res.error);
      } else {
        setCheckSession((prev) => !prev);
        navigate('/');
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container-no-padding">
      {/* 2-Kachel Grid Layout - Links halb so groß wie rechts */}
      <div className="w-full grid grid-cols-3 gap-4 min-h-screen">
        
        {/* Erste Kachel - Links (33.33% der Breite) */}
        <div className="col-span-1 bg-[#BDFF00] rounded-xl shadow-lg p-8 flex flex-col justify-center items-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-black mb-6 text-center">
            ALREADY A<br/>MEMBER?
          </h2>
          <p className="text-lg text-black mb-8 text-center">
            Welcome back! Sign in to your account
          </p>
          <div className="text-6xl mb-4">🔑</div>
          <Link to="/login" className="btn btn-outline border-black text-black hover:bg-black hover:text-[#BDFF00] px-8 py-2 rounded-lg transition-all duration-200">
            Sign In
          </Link>
        </div>
        
        {/* Zweite Kachel - Rechts mit Registrierungsformular (66.66% der Breite) */}
        <div className="col-span-2 bg-white rounded-xl shadow-lg p-8 flex flex-col justify-center">
          <div className="w-full max-w-xs mx-auto">
            <form className='flex flex-col gap-3 items-center' onSubmit={handleSubmit}>
              <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">Create Account</h1>
          <label className='input flex items-center gap-2 w-full bg-white border-2 border-black text-black'>
        <svg
          xmlns='http://www.w3.org/2000/svg'
          viewBox='0 0 16 16'
          fill='currentColor'
          className='h-4 w-4 text-black'
        >
          <path d='M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM12.735 14c.618 0 1.093-.561.872-1.139a6.002 6.002 0 0 0-11.215 0c-.22.578.254 1.139.872 1.139h9.47Z' />
        </svg>
        <input
          name='firstName'
          value={firstName}
          onChange={handleChange}
          className='grow bg-white text-black placeholder-gray-500'
          placeholder='First name'
        />
      </label>
      <label className='input flex items-center gap-2 w-full bg-white border-2 border-black text-black'>
        <svg
          xmlns='http://www.w3.org/2000/svg'
          viewBox='0 0 16 16'
          fill='currentColor'
          className='h-4 w-4 text-black'
        >
          <path d='M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM12.735 14c.618 0 1.093-.561.872-1.139a6.002 6.002 0 0 0-11.215 0c-.22.578.254 1.139.872 1.139h9.47Z' />
        </svg>
        <input
          name='lastName'
          value={lastName}
          onChange={handleChange}
          className='grow bg-white text-black placeholder-gray-500'
          placeholder='Last name'
        />
      </label>
      <label className='input flex items-center gap-2 w-full bg-white border-2 border-black text-black'>
        <svg
          xmlns='http://www.w3.org/2000/svg'
          viewBox='0 0 16 16'
          fill='currentColor'
          className='h-4 w-4 text-black'
        >
          <path d='M2.5 3A1.5 1.5 0 0 0 1 4.5v.793c.026.009.051.20.076.032L7.674 8.51c.206.1.446.1.652 0l6.598-3.185A.755.755 0 0 1 15 5.293V4.5A1.5 1.5 0 0 0 13.5 3h-11Z' />
          <path d='M15 6.954 8.978 9.86a2.25 2.25 0 0 1-1.956 0L1 6.954V11.5A1.5 1.5 0 0 0 2.5 13h11a1.5 1.5 0 0 0 1.5-1.5V6.954Z' />
        </svg>
        <input
          name='email'
          value={email}
          onChange={handleChange}
          type='email'
          className='grow bg-white text-black placeholder-gray-500'
          placeholder='Email'
        />
      </label>
      <label className='input flex items-center gap-2 w-full bg-white border-2 border-black text-black'>
        <svg
          xmlns='http://www.w3.org/2000/svg'
          viewBox='0 0 16 16'
          fill='currentColor'
          className='h-4 w-4 text-black'
        >
            <path
              fillRule='evenodd'
              d='M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z'
              clipRule='evenodd'
            />
          </svg>
          <input
            name='password'
            value={password}
            onChange={handleChange}
            type='password'
            className='grow bg-white text-black placeholder-gray-500'
            placeholder='Password'
          />
        </label>
        <label className='input flex items-center gap-2 w-full bg-white border-2 border-black text-black'>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            viewBox='0 0 16 16'
            fill='currentColor'
            className='h-4 w-4 text-black'
          >
            <path
              fillRule='evenodd'
              d='M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z'
              clipRule='evenodd'
            />
          </svg>
          <input
            name='confirmPassword'
            value={confirmPassword}
            onChange={handleChange}
            type='password'
            className='grow bg-white text-black placeholder-gray-500'
            placeholder='Confirm your password...'
          />
        </label>
              <button className='btn self-center text-black font-bold mt-5' disabled={loading} style={{backgroundColor: '#BDFF00'}}>
                Create Account
              </button>
              <p className='text-error text-center'>{error}</p>
            </form>
          </div>
        </div>
        
      </div>
    </div>
  );
};

export default Register;
