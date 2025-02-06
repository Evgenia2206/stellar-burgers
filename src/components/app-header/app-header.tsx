import { FC } from 'react';
import { AppHeaderUI } from '@ui';
import { useSelector } from '../../services/store';
import { getUserSelector } from '../../services/slices/user-slice/user-slice';

export const AppHeader: FC = () => {
  const user = useSelector(getUserSelector)?.name;
  return <AppHeaderUI userName={user} />;
};
