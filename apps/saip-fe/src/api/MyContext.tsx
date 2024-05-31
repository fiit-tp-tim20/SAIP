import { createContext } from 'react';

export const MyContext = createContext({
    turnNum: null,
    comm: false,
    isLoading: false,
    numberShow: 1,
    setIsLoading: (isLoading: boolean) => {},
    setComm: (comm: boolean) => {},
    setNumberShow: (numberShow: number) => {}
});