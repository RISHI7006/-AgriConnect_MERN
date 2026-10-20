import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../api';

const AuthContext = createContext(null);

const sanitizeAvatar = (avatar, role) => {
  if (!avatar || avatar.includes('1544717305') || avatar.includes('1534528741') || avatar.includes('unsplash.com/photo-')) {
    if (role === 'buyer') return '/images/amit.jpg';
    if (role === 'admin') return '/images/admin.jpg';
    return '/images/ramesh.jpg';
  }
  return avatar;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('agriconnect_user');
      if (!saved) return null;
      const parsed = JSON.parse(saved);
      if (parsed) {
        parsed.avatar = sanitizeAvatar(parsed.avatar, parsed.role);
        localStorage.setItem('agriconnect_user', JSON.stringify(parsed));
      }
      return parsed;
    } catch (e) {
      return null;
    }
  });
  const [token, setToken] = useState(() => localStorage.getItem('agriconnect_token') || null);
  const [loading, setLoading] = useState(true);
  const [demoProfiles, setDemoProfiles] = useState(null);

  useEffect(() => {
    const loadDemoProfiles = async () => {
      try {
        const profiles = await api.getDemoProfiles();
        setDemoProfiles(profiles);
        // Do NOT auto-login as demo user if logged out.
        // Respect logged-out state so real users can log in cleanly and fresh accounts stay clean.
      } catch (e) {
        console.error('Failed to load demo profiles:', e);
      } finally {
        setLoading(false);
      }
    };
    loadDemoProfiles();
  }, []);

  const loginWithUser = (userData, userToken = 'demo-token') => {
    const sanitized = {
      ...userData,
      avatar: sanitizeAvatar(userData?.avatar, userData?.role)
    };
    setUser(sanitized);
    setToken(userToken);
    localStorage.setItem('agriconnect_user', JSON.stringify(sanitized));
    localStorage.setItem('agriconnect_token', userToken);
  };

  const login = async (email, password) => {
    const data = await api.login(email, password);
    const isDemo = ['ramesh@farmer.com', 'amit@buyer.com', 'admin@agriconnect.com'].includes(data.email?.toLowerCase());
    const userData = { ...data, isDemo };
    loginWithUser(userData, data.token);
    return userData;
  };

  const register = async (userData) => {
    const data = await api.register(userData);
    const userDataClean = { ...data, isDemo: false };
    loginWithUser(userDataClean, data.token);
    return userDataClean;
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('agriconnect_user');
    localStorage.removeItem('agriconnect_token');
  };

  const switchRole = async (role) => {
    let profiles = demoProfiles;
    if (!profiles) {
      try {
        profiles = await api.getDemoProfiles();
        if (profiles) setDemoProfiles(profiles);
      } catch (e) {
        console.error('Failed to load demo profiles in switchRole:', e);
      }
    }

    const fallbackProfiles = {
      farmer: {
        _id: '6ad671d8e13a517d749ab49f',
        name: 'Ramesh Kumar',
        email: 'ramesh@farmer.com',
        role: 'farmer',
        phone: '+91 98234 11029',
        avatar: '/images/ramesh.jpg',
        location: { city: 'Nashik', state: 'Maharashtra', address: 'Gat No. 142, Pimpalgaon Baswant, Niphad, Nashik - 422209' },
        isDemo: true
      },
      buyer: {
        _id: '6ad671d8e13a517d749ab4ab',
        name: 'Amit Sharma',
        email: 'amit@buyer.com',
        role: 'buyer',
        phone: '+91 98110 54321',
        avatar: '/images/amit.jpg',
        location: { city: 'Delhi', state: 'Delhi', address: 'Shop 118, New Subzi Mandi, Azadpur, Delhi - 110033' },
        isDemo: true
      },
      admin: {
        _id: '6ad671d8e13a517d749ab4b3',
        name: 'Administrator',
        email: 'admin@agriconnect.com',
        role: 'admin',
        phone: '+91 99999 88888',
        avatar: '/images/admin.jpg',
        location: { city: 'New Delhi', state: 'Delhi', address: 'Krishi Bhawan, New Delhi' },
        isDemo: true
      }
    };

    const targetProfile = profiles?.[role] || fallbackProfiles[role];
    if (targetProfile) {
      const demoToken = targetProfile.token || 'demo-jwt-token';
      const userObj = { ...targetProfile, isDemo: true };
      loginWithUser(userObj, demoToken);
      return userObj;
    }
  };

  const updateUser = (updatedData) => {
    const merged = { ...user, ...updatedData };
    setUser(merged);
    localStorage.setItem('agriconnect_user', JSON.stringify(merged));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        register,
        logout,
        switchRole,
        updateUser,
        demoProfiles,
        isFarmer: user?.role === 'farmer',
        isBuyer: user?.role === 'buyer',
        isAdmin: user?.role === 'admin'
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
