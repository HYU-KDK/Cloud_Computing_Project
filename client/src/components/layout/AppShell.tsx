import React from "react";

interface AppShellProps {
  children: React.ReactNode;
}

const AppShell: React.FC<AppShellProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-[#f8f8f8] text-black">
      {children}
    </div>
  );
};

export default AppShell;
