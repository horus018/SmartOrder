import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface SessionData {
  restaurantId: string;
  restaurantName: string;
  tableId: string;
  userName: string;
  userPhoto?: string;
  userId?: string;
}

interface SessionContextProps extends SessionData {
  updateUser: (newName: string, newPhoto?: string) => void;
}

const SessionContext = createContext<SessionContextProps | null>(null);

export const useSession = () => {
  const context = useContext(SessionContext);
  if (!context) {
    return {
      restaurantId: "",
      restaurantName: "Smart Order", 
      tableId: "--", 
      userName: "Admin",
      userId: "unknown",
      updateUser: () => {} 
    };
  }
  return context;
};

export const SessionProvider = ({ 
  children, 
  value 
}: { 
  children: ReactNode; 
  value: SessionData | null 
}) => {
  const [sessionState, setSessionState] = useState<SessionData | null>(value);

  useEffect(() => {
    setSessionState(value);
  }, [value]);

  const updateUser = (newName: string, newPhoto?: string) => {
    if (sessionState) {
      setSessionState({
        ...sessionState,
        userName: newName,
        userPhoto: newPhoto || sessionState.userPhoto
      });
    }
  };

  const contextValue = sessionState ? {
    ...sessionState,
    updateUser
  } : null;

  return (
    <SessionContext.Provider value={contextValue}>
      {children}
    </SessionContext.Provider>
  );
};