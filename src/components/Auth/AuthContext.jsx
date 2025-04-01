import React, { createContext, useState, useContext, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext();

const validateToken = async (token) => {
  try {
    const response = await axios.get(
      `${import.meta.env.VITE_BACK_END_URL}/user/check-auth`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data.user !== null;
  } catch (error) {
    return false;
  }
};

const refreshAccessToken = async (refreshToken) => {
  try {
    const response = await axios.post(
      `${import.meta.env.VITE_BACK_END_URL}/user/refresh-token`,
      { refreshToken }
    );
    return response.data;
  } catch (error) {
    console.error("Error refreshing access token:", error);
    return null;
  }
};

export const AuthProvider = ({ children }) => {
  const [authTokens, setAuthTokens] = useState(() => {
    const token = localStorage.getItem("token");
    const refreshToken = localStorage.getItem("refreshToken");
    return { token, refreshToken };
  });

  const [isTokenExpired, setIsTokenExpired] = useState(false);

  const login = async ({ token, refreshToken }) => {
    localStorage.setItem("token", token);
    localStorage.setItem("refreshToken", refreshToken);
    setAuthTokens({ token, refreshToken });
    setIsTokenExpired(false);

    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    localStorage.setItem("hasLoggedIn", "true");
  };

  const logout = (manual = true) => {
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    setAuthTokens(null);
    axios.defaults.headers.common["Authorization"] = "";

    if (manual) {
      localStorage.setItem("hasLoggedOut", "true");
      setIsTokenExpired(false);
    } else {
      setIsTokenExpired(true);
    }
    localStorage.removeItem("hasLoggedIn");
  };

  const checkTokenValidity = async () => {
    if (authTokens?.token) {
      const isValid = await validateToken(authTokens.token);
      if (!isValid) {
        const refreshResponse = await refreshAccessToken(
          authTokens.refreshToken
        );
        if (refreshResponse && refreshResponse.token) {
          await login({
            token: refreshResponse.token,
            refreshToken: refreshResponse.refreshToken,
          });
        } else {
          logout(false);
        }
      }
    }
  };

  useEffect(() => {
    const intervalId = setInterval(() => {
      checkTokenValidity();
    }, 60000); // Check token validity every 1 minute

    return () => clearInterval(intervalId);
  }, [authTokens]);

  return (
    <AuthContext.Provider
      value={{
        authTokens,
        login,
        logout,
        setAuthTokens,
        isTokenExpired,
        setIsTokenExpired,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
