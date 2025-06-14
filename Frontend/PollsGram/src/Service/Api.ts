import type { Poll, Option } from '../Types';
import axios from 'axios';

// GET
const GET_POLLS_PAGE = '/polls/page/'; // required /pageNumber
const GET_ACCESS_TOKEN = '/auth/access-token'; // required userId as query parameter
const GET_POLLS_USER = '/polls/user/'; // required /userId

// POST
const POST_POLL = '/polls/create';
const POST_OPTION = '/options/create';
const POST_GOOGLE_AUTH = '/auth/google';
const POST_LOGOUT = '/auth/logout';

// PATCH
const PATCH_POLL_QUESTION = '/polls/update/question/'; // required /pollsId
const PATCH_OPTION_TEXT = '/options/update/';

// DELETE
const DELETE_POLL = '/polls/delete/'; // required /pollId
const DELETE_OPTION = '/options/delete/'; // required /optionId

export let ACCESS_TOKEN: string | null = null;

axios.interceptors.request.use(
    (config) => {
        if (ACCESS_TOKEN) {
            config.headers['Authorization'] = `Bearer ${ACCESS_TOKEN}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export const getPollsByPage = async (page: number) => {
    const url = `${import.meta.env.VITE_BASE_API_URL}${GET_POLLS_PAGE}${page}`;
    try {
        const response = await axios.get(url, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return response.data;
    } catch (error: unknown) {
        if (error instanceof Error) {
            throw new Error(`Failed to fetch polls: ${error.message}`);
        }
        throw new Error('Failed to fetch polls: An unknown error occurred');
    }
}

export const getPollsByUserId = async (userId: number) => {
    const url = `${import.meta.env.VITE_BASE_API_URL}${GET_POLLS_USER}${userId}`;
    try {
        const response = await axios.get(url, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return response.data;
    } catch (error: unknown) {
        if (error instanceof Error) {
            throw new Error(`Failed to fetch user polls: ${error.message}`);
        }
        throw new Error('Failed to fetch user polls: An unknown error occurred');
    }
}

export const createPoll = async (poll: Poll) => {
    const url = `${import.meta.env.VITE_BASE_API_URL}${POST_POLL}`;
    try {
        const response = await axios.post(url, poll, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return { data: response.data, statusCode: response.status };
    } catch (error: unknown) {
        if (error instanceof Error) {
            throw new Error(`Failed to create poll: ${error.message}`);
        }
        throw new Error('Failed to create poll: An unknown error occurred');
    }
}

export const createOption = async (option: Option) => {
    const url = `${import.meta.env.VITE_BASE_API_URL}${POST_OPTION}`;
    try {
        const response = await axios.post(url, option, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return response.data;
    } catch (error: unknown) {
        if (error instanceof Error) {
            throw new Error(`Failed to create option: ${error.message}`);
        }
        throw new Error('Failed to create option: An unknown error occurred');
    }
}

export const updatePollQuestion = async (pollId: number, question: string) => {
    const url = `${import.meta.env.VITE_BASE_API_URL}${PATCH_POLL_QUESTION}${pollId}`;
    try {
        const response = await axios.patch(url, { question }, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return response.data;
    } catch (error: unknown) {
        if (error instanceof Error) {
            throw new Error(`Failed to update poll question: ${error.message}`);
        }
        throw new Error('Failed to update poll question: An unknown error occurred');
    }
}

export const logout = async (userId: number) => {
    const url = `${import.meta.env.VITE_BASE_API_URL}${POST_LOGOUT}`;
    try {
        const response = await axios.post(url, { userId }, {
            headers: {
                'Content-Type': 'application/json',
            },
            withCredentials: true,
        });
        if (response.status === 200) {
            ACCESS_TOKEN = null; // Clear the access token on logout
            return response.data;
        } else {
            throw new Error('Logout failed: Unexpected response status');
        }
    } catch (error: unknown) {
        if (error instanceof Error) {
            throw new Error(`Failed to logout: ${error.message}`);
        }
        throw new Error('Failed to logout: An unknown error occurred');
    }
}

export const updateOptionText = async (optionId: number, text: string) => {
    const url = `${import.meta.env.VITE_BASE_API_URL}${PATCH_OPTION_TEXT}${optionId}`;
    try {
        const response = await axios.patch(url, { text }, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return response.data;
    } catch (error: unknown) {
        if (error instanceof Error) {
            throw new Error(`Failed to update option text: ${error.message}`);
        }
        throw new Error('Failed to update option text: An unknown error occurred');
    }
}

export const deletePoll = async (pollId: number) => {
    const url = `${import.meta.env.VITE_BASE_API_URL}${DELETE_POLL}${pollId}`;
    try {
        const response = await axios.delete(url, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return response.data;
    } catch (error: unknown) {
        if (error instanceof Error) {
            throw new Error(`Failed to delete poll: ${error.message}`);
        }
        throw new Error('Failed to delete poll: An unknown error occurred');
    }
}

export const deleteOption = async (optionId: number) => {
    const url = `${import.meta.env.VITE_BASE_API_URL}${DELETE_OPTION}${optionId}`;
    try {
        const response = await axios.delete(url, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return response.data;
    } catch (error: unknown) {
        if (error instanceof Error) {
            throw new Error(`Failed to delete option: ${error.message}`);
        }
        throw new Error('Failed to delete option: An unknown error occurred');
    }
}

export const googleAuth = async (credential: string) => {
    const url = `${import.meta.env.VITE_BASE_API_URL}${POST_GOOGLE_AUTH}`;
    try {
        const response = await axios.post(url, { credential }, {
            headers: {
                'Content-Type': 'application/json',
            },
            withCredentials: true,
        });
        if (response.data.accessToken) {
            ACCESS_TOKEN = response.data.accessToken;
            return response.data;
        } else {
            throw new Error('No access token received from Google authentication');
        }
    } catch (error: unknown) {
        if (error instanceof Error) {
            throw new Error(`Failed to authenticate with Google: ${error.message}`);
        }
        throw new Error('Failed to authenticate with Google: An unknown error occurred');
    }
}

export const getAccessToken = async (userId: number) => {
    const url = `${import.meta.env.VITE_BASE_API_URL}${GET_ACCESS_TOKEN}?userId=${userId}`;
    try {
        const response = await axios.get(url, {
            headers: {
                'Content-Type': 'application/json',
            },
            withCredentials: true,
        });
        if (response.data.accessToken) {
            ACCESS_TOKEN = response.data.accessToken;
            return response.data;
        } else {
            throw new Error('No access token received');
        }
    } catch (error: unknown) {
        if (axios.isAxiosError(error) && error.response) {
            throw new Error(`Failed to fetch access token: ${error.response.statusText}`);
        } else if (error instanceof Error) {
            throw new Error(`Failed to fetch access token: ${error.message}`);
        }
        throw new Error('Failed to fetch access token: An unknown error occurred');
    }
}