// contexts/IPContext.tsx
import React, { createContext, useContext, useState, ReactNode } from "react";

// Import το config με fallback
let ipConfig;
try {
  ipConfig = require("../config/ipConfig").ipConfig;
} catch (error) {
  console.warn("No IP config found, using default");
  ipConfig = {
    ip: "192.168.1.100",
    method: "fallback",
    timestamp: new Date().toISOString(),
  };
}
interface IPContextType {
  ip: string | null;
  loading: boolean;
  refreshIP: () => void;
  lastUpdated: string | null;
  detectionMethod: string | null;
}

const IPContext = createContext<IPContextType | undefined>(undefined);

export const useIP = (): IPContextType => {
  const context = useContext(IPContext);
  if (!context) {
    throw new Error("useIP must be used within an IPProvider");
  }
  return context;
};

interface IPProviderProps {
  children: ReactNode;
}

export const IPProvider: React.FC<IPProviderProps> = ({ children }) => {
  const [ip] = useState<string>(ipConfig.ip);
  const [loading] = useState<boolean>(false);
  const [lastUpdated] = useState<string>(ipConfig.timestamp);
  const [detectionMethod] = useState<string>(ipConfig.method);

  console.log(`✅ IP loaded from config: ${ipConfig.ip} (${ipConfig.method})`);

  const refreshIP = (): void => {
    console.log(
      '⚠️ To refresh IP, run "npm run detect-ip" and restart the app'
    );
  };

  return (
    <IPContext.Provider
      value={{
        ip,
        loading,
        refreshIP,
        lastUpdated,
        detectionMethod,
      }}
    >
      {children}
    </IPContext.Provider>
  );
};
