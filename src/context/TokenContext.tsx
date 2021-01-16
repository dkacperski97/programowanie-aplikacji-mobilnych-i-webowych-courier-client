import React, { useState, createContext } from "react";
import { withAuthenticationRequired } from "@auth0/auth0-react";

interface TokenContextInterface {
    token: string|undefined;
    setToken: React.Dispatch<string|undefined>;
}

export const TokenContext = createContext<TokenContextInterface | null>(null);

export const TokenProviderFunc: React.FC = ({ children }) => {
  const [token, setToken] = useState<string|undefined>(process.env.REACT_APP_JWT_TOKEN);
  const data: TokenContextInterface = { token, setToken };
  return <TokenContext.Provider value={data} children={children}/>;
};

export const TokenProvider = withAuthenticationRequired(TokenProviderFunc)