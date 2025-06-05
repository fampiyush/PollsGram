import React, { createContext, useState } from 'react';

interface AccessTokenType {
    accessToken: string | null;
    setAccessToken: (token: string | null) => void;
}

interface UserType {
    id: number | null;
    email: string | null;
}

interface UserContextType {
    user: UserType;
    setUser: (user: UserType) => void;
}

const defaultAccessToken: AccessTokenType = {
  accessToken: null,
  setAccessToken: () => {},
};

const defaultUser: UserContextType = {
    user: {
        id: null,
        email: null,
    },
    setUser: () => {},
};

interface PollsContextType extends AccessTokenType, UserContextType {}

const defaultValue: PollsContextType = {
    ...defaultAccessToken,
    ...defaultUser
};

const PollsContext = createContext<PollsContextType>(defaultValue);

export const PollsContextProvider = ({ children }: { children: React.ReactNode }) => {
    const [accessToken, setAccessToken] = useState<string | null>(null);
    const [user, setUser] = useState<UserType>({
        id: null,
        email: null,
    });

    return (
        <PollsContext.Provider value={{ accessToken, setAccessToken, user, setUser }}>
            {children}
        </PollsContext.Provider>
    );
};

export default PollsContext;
