import authContext from '@src/@shared/contexts/auth/auth.context';
import { useContext } from 'react';

export default function useAuth() {
  const context = useContext(authContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider.');
  return context;
}
