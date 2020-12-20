import React, { useState, createContext } from "react";

interface LinksContextInterface {
    links: any;
    setLinks: React.Dispatch<any>;
}

export const LinksContext = createContext<LinksContextInterface | null>(null);

export const LinksProvider: React.FC = ({ children }) => {
  const [links, setLinks] = useState<any>();
  const data: LinksContextInterface = { links, setLinks };
  return <LinksContext.Provider value={data} children={children}/>;
};