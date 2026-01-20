import React, { createContext, useContext, useState } from "react";

type User = any; // 지금은 느슨하게, 나중에 types.ts로 정리해도 됨

interface UserContextValue {
  user: User | null;
  setUser: (user: User) => void;
  clearUser: () => void;
}

const UserContext = createContext<UserContextValue | undefined>(undefined);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUserState] = useState<User | null>(() => {
    const saved = localStorage.getItem("paperquest_user");
    return saved ? JSON.parse(saved) : null;
  });

  const setUser = (u: User) => {
    setUserState(u);
    localStorage.setItem("paperquest_user", JSON.stringify(u));
  };

  const clearUser = () => {
    setUserState(null);
    localStorage.removeItem("paperquest_user");
  };

  return (
    <UserContext.Provider value={{ user, setUser, clearUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const ctx = useContext(UserContext);
  if (!ctx) {
    throw new Error("useUser must be used within UserProvider");
  }
  return ctx;
};
