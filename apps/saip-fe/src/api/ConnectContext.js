import { createContext } from 'react';

export const ConnectContext = createContext({
    connect: "no",
    setConnect: () => {}
});