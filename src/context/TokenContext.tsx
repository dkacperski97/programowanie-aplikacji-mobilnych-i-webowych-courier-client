import React, { useState, createContext } from "react";

interface TokenContextInterface {
    token: string|undefined;
    setToken: React.Dispatch<string|undefined>;
}

export const TokenContext = createContext<TokenContextInterface | null>(null);

export const TokenProvider: React.FC = ({ children }) => {
  const [token, setToken] = useState<string|undefined>(process.env.REACT_APP_JWT_TOKEN);
  const data: TokenContextInterface = { token, setToken };
  return <TokenContext.Provider value={data} children={children}/>;
};