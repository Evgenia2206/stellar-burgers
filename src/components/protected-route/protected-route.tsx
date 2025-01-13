import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from '../../services/store';
import { isAuthorizedSelector } from '../../services/slices/user-slice';
import { ReactElement } from 'react';

type TProtectedRoute = {
  onlyUnAuth?: boolean;
  children?: ReactElement;
};

export const ProtectedRoute = ({
  onlyUnAuth = false,
  children
}: TProtectedRoute) => {
  const location = useLocation();
  const isAuthorized = useSelector(isAuthorizedSelector);
  const { from } = location.state || { from: { pathname: '/' } };

  if (onlyUnAuth && isAuthorized) {
    return <Navigate to={from} />;
  }

  if (!onlyUnAuth && !isAuthorized) {
    return <Navigate to='/login' state={{ from: location }} />;
  }

  return children;
};
