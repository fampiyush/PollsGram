import React, { createContext, useState } from 'react';

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

interface PollsContextType extends UserContextType, ModalContextType {}

const defaultValue: PollsContextType = {
    ...defaultUser,
    ...defaultModal,
};

const PollsContext = createContext<PollsContextType>(defaultValue);

export const PollsContextProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<UserType>({
        id: null,
        email: null,
    });
    const [createModalIsOpen, setCreateModalIsOpen] = useState(false);

    return (
        <PollsContext.Provider value={{ user, setUser, createModalIsOpen, setCreateModalIsOpen }}>
            {children}
        </PollsContext.Provider>
    );
};

export default PollsContext;
