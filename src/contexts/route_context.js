import { createContext, useState } from 'react';

export const RouteContext = createContext();

export const RouteProvider = ({ children }) => {
    const [route, setRoute] = useState(null);

    return (
        <RouteContext.Provider
            value={{
                route, setRoute
            }}>
            {children}
        </RouteContext.Provider>
    );
};