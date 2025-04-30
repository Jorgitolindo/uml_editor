// src/hooks/useUserAuth.jsx
import { useState, useEffect } from 'react';
import { getAuth } from 'firebase/auth';

const useUserAuth = () => {
  const [user, setUser] = useState(null);
  const auth = getAuth();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
    });
    return unsubscribe;
  }, [auth]);

  return user;
};

export default useUserAuth;