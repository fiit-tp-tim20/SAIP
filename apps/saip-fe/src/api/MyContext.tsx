import { createContext } from 'react';

export const MyContext = createContext({
    num: null,
    comm: null,
    start: null,
    isLoading: false,
    setIsLoading: (isLoading: boolean) => {}
});