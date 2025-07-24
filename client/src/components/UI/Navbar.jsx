import { Link, NavLink } from 'react-router';
import { useAuth } from '@/context';

const Navbar = () => {
  const { user, signout } = useAuth();
  const handleLogout = async () => {
    await signout();
    window.location.reload();
  };
  
  return (
    <div className='max-width-wrapper'>
      <div className='bg-sky-950 text-white mb-3 rounded-xl font-bold'>
        <div className='page-container'>
          <div className='navbar min-h-30'>
            <div className='flex-1'>
              <Link to='/' className='hover:bg-transparent flex items-center'>
                <img 
                  src="/images/logos/vibetec-logo.png" 
                  alt="VibeTec" 
                  className="h-15 w-auto"
                />
              </Link>
            </div>
            <div className='flex-none'>
            <ul className='menu menu-horizontal text-2xl pr-15'>
              <li>
                <NavLink to='/' className='hover:text-[#BDFF00] transition-colors duration-300'>Home</NavLink>
              </li>
              <li>
                <NavLink to='/artists' className='hover:text-[#BDFF00] transition-colors duration-300'>Artists</NavLink>
              </li>
              {user ? (
                <>
                  {user.role === 'ADMIN' && (
                    <li>
                      <NavLink to='/admin-dashboard' className='hover:text-[#BDFF00] transition-colors duration-300'>Dashboard</NavLink>
                    </li>
                  )}
                  <li>
                    <NavLink to='/my-bookings' className='hover:text-[#BDFF00] transition-colors duration-300'>My Bookings</NavLink>
                  </li>
                  <li>
                    <NavLink to='/user-profile' className='hover:text-[#BDFF00] transition-colors duration-300'>
                      <span className='font-bold'>
                        {user.role === 'ADMIN' ? 'Admin User' : `${user.firstName} ${user.lastName}`}
                      </span>
                    </NavLink>
                  </li>
                  <li>
                    <button onClick={handleLogout} className='hover:text-[#BDFF00] transition-colors duration-300'>Logout</button>
                  </li>
                </>
              ) : (
                <>
                  <li>
                    <NavLink to='/register' className='hover:text-[#BDFF00] transition-colors duration-300'>Register</NavLink>
                  </li>
                  <li>
                    <NavLink to='/login' className='hover:text-[#BDFF00] transition-colors duration-300'>Login</NavLink>
                  </li>
                </>
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
};

export default Navbar;
