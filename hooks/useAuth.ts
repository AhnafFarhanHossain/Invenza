// hooks/useAuth.ts
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export function useAuth() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const checkAuth = () => {
      const token = document.cookie
        .split('; ')
        .find(row => row.startsWith('token='))
        ?.split('=')[1];

      if (!token) {
        setIsAuthenticated(false);
        router.push('/auth/signin');
        return;
      }

      // Optional: Add client-side token validation here
      setIsAuthenticated(true);
    };

    checkAuth();
  }, [router]);

  return { isAuthenticated };
}
