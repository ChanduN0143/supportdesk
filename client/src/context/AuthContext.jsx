import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(
    localStorage.getItem("supportdesk_token")
  );

  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("supportdesk_user");

    return storedUser ? JSON.parse(storedUser) : null;
  });

  const login = (loginData) => {
    const { token, user } = loginData;

    localStorage.setItem("supportdesk_token", token);
    localStorage.setItem("supportdesk_user", JSON.stringify(user));

    setToken(token);
    setUser(user);
  };

  const logout = () => {
    localStorage.removeItem("supportdesk_token");
    localStorage.removeItem("supportdesk_user");

    setToken(null);
    setUser(null);
  };

  useEffect(() => {
    const storedToken = localStorage.getItem("supportdesk_token");
    const storedUser = localStorage.getItem("supportdesk_user");

    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const isAuthenticated = Boolean(token);

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        login,
        logout,
        isAuthenticated
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};