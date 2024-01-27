import React, { useEffect, useState } from "react";

const SidebarContext = React.createContext<{
  sidebarWidth: number;
  setSidebarWidth: React.Dispatch<React.SetStateAction<number>>;
}>({
  sidebarWidth: 380,
  setSidebarWidth: () => { },
});

export const SidebarProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [sidebarWidth, setSidebarWidth] = useState(() => {
    const storedWidth = localStorage.getItem('sidebarWidth');
    return storedWidth ? parseInt(storedWidth, 10) : 380;
  });

  useEffect(() => {
    localStorage.setItem('sidebarWidth', sidebarWidth.toString());
  }, [sidebarWidth]);

  return (
    <SidebarContext.Provider value={{ sidebarWidth, setSidebarWidth }}>
      {children}
    </SidebarContext.Provider>
  );
};

export default SidebarContext;