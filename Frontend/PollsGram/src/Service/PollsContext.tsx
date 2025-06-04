import React, { createContext } from 'react';

interface AccessTokenType {
    accessToken: string | null;
    setAccessToken: (token: string | null) => void;
}

const defaultAccessToken: AccessTokenType = {
  accessToken: null,
  setAccessToken: () => {},
};

interface PollsContextType extends AccessTokenType {}

const defaultValue: PollsContextType = {
    ...defaultAccessToken,
};

const PollsContext = createContext<PollsContextType>(defaultValue);

export const PollsContextProvider = ({ children }: { children: React.ReactNode }) => {
    const [accessToken, setAccessToken] = React.useState<string | null>(null);

    return (
        <PollsContext.Provider value={{ accessToken, setAccessToken }}>
            {children}
        </PollsContext.Provider>
    );
};

export default PollsContext;
