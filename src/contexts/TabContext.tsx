import { createContext, useContext, useState, type ReactNode } from "react";

type TabId = "hmart" | "gifts" | "b2b";

interface TabContextType {
  activeTab: TabId;
  setActiveTab: (tab: TabId) => void;
}

const TabContext = createContext<TabContextType | undefined>(undefined);

export function TabProvider({ children }: { children: ReactNode }) {
  const [activeTab, setActiveTab] = useState<TabId>("hmart");
  return (
    <TabContext.Provider value={{ activeTab, setActiveTab }}>
      {children}
    </TabContext.Provider>
  );
}

export function useTab() {
  const context = useContext(TabContext);
  if (!context) throw new Error("useTab must be used within a TabProvider");
  return context;
}
