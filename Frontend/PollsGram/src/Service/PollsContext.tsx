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

interface ModalContextType {
    createModalIsOpen: boolean;
    setCreateModalIsOpen: (isOpen: boolean) => void;
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

const defaultModal: ModalContextType = {
    createModalIsOpen: false,
    setCreateModalIsOpen: () => {},
};

interface PollsContextType extends AccessTokenType, UserContextType, ModalContextType {}

const defaultValue: PollsContextType = {
    ...defaultAccessToken,
    ...defaultUser,
    ...defaultModal,
};

const PollsContext = createContext<PollsContextType>(defaultValue);

export const PollsContextProvider = ({ children }: { children: React.ReactNode }) => {
    const [accessToken, setAccessToken] = useState<string | null>(null);
    const [user, setUser] = useState<UserType>({
        id: null,
        email: null,
    });
    const [createModalIsOpen, setCreateModalIsOpen] = useState(false);

    return (
        <PollsContext.Provider value={{ accessToken, setAccessToken, user, setUser, createModalIsOpen, setCreateModalIsOpen }}>
            {children}
        </PollsContext.Provider>
    );
};

export default PollsContext;
