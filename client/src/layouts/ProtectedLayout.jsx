import { AuthContext } from '@/context';
import { useContext } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router';

function Protected() {
  const { user, loading } = useContext(AuthContext);
  const location = useLocation();
  return (
    <>
      {!loading && (
        <>{user ? <Outlet /> : <Navigate to='/login' state={{ next: location.pathname }} />}</>
      )}
    </>
  );
}

export default Protected;
