import { createContext } from 'react';

export const MyContext = createContext({
    turnNum: null,
    comm: false,
    isLoading: false,
    setIsLoading: (isLoading: boolean) => {},
    setComm: (comm: boolean) => {}
});