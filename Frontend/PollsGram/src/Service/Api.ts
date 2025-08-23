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
const POST_VOTE = '/polls/vote'; // required user id, poll id, and option id in body
const POST_REACT = '/polls/react'; // required user id, poll id, and reaction type in body

// PATCH
const PATCH_POLL_QUESTION = '/polls/update/question/'; // required /pollsId
const PATCH_OPTION_TEXT = '/options/update/';

// DELETE
const DELETE_POLL = '/polls/delete/'; // required /pollId
const DELETE_OPTION = '/options/delete/'; // required /optionId
const DELETE_REACT = '/polls/delete/react/'; // required user id and poll id

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

axios.interceptors.response.use(
    (response) => {
        // This is the success handler, called for 2xx status codes
        return response;
    },
    async (error) => {
        const originalRequest = error.config;
        const originalRequestUrl = originalRequest.url || '';
        // Check if the original request was to an auth endpoint that shouldn't trigger a token refresh cycle
        const isAuthEndpointRequest = originalRequestUrl.includes(GET_ACCESS_TOKEN) || originalRequestUrl.includes(POST_LOGOUT);

        // Check if the error is 401 or 403, not a retry attempt, and not an auth endpoint itself
        if (error.response && 
            (error.response.status === 401 || error.response.status === 403) && 
            !originalRequest._retry && 
            !isAuthEndpointRequest) {
            originalRequest._retry = true; // Mark the request to avoid infinite loops

            try {
                const userId = localStorage.getItem('userId');
                if (!userId) {
                    // If no userId, cannot refresh token, treat as unauthenticated
                    console.error("No userId found in localStorage, cannot refresh token.");
                    ACCESS_TOKEN = null;
                    window.location.href = '/'; // Redirect to home/login
                    return Promise.reject(error);
                }
                const tokenData = await getAccessToken(Number(userId));

                if (tokenData && tokenData.accessToken) {
                    ACCESS_TOKEN = tokenData.accessToken; // Update global ACCESS_TOKEN
                    // Update the Authorization header in the original request's config with the new token
                    originalRequest.headers['Authorization'] = `Bearer ${tokenData.accessToken}`;
                    
                    // Retry the original request with the new token
                    return axios(originalRequest);
                } else {
                    // Handle cases where token refresh failed or no token was returned
                    console.error("Failed to refresh access token or no token returned.");
                    ACCESS_TOKEN = null;
                    localStorage.removeItem('userId');
                    window.location.href = '/'; // Redirect to home/login
                    return Promise.reject(error); // Reject with the original error
                }
            } catch (refreshError) {
                // Handle errors during the token refresh process itself
                console.error("Error during token refresh:", refreshError);
                ACCESS_TOKEN = null; // Clear the access token
                localStorage.removeItem('userId'); // Clear userId from localStorage
                console.log('Token refresh failed. Redirecting to home page.');
                window.location.href = '/'; // Redirect to home/login page
                return Promise.reject(error); // Reject with the original error that led to the refresh attempt
            }
        } else if (error.response && (error.response.status === 401 || error.response.status === 403) && isAuthEndpointRequest) {
            // If an auth endpoint itself fails with 401/403, clear local session and redirect.
            console.error(`Authentication endpoint ${originalRequestUrl} failed. Clearing session and redirecting.`);
            ACCESS_TOKEN = null;
            localStorage.removeItem('userId');
            window.location.href = '/';
            return Promise.reject(error);
        }

        // For other errors or if token refresh is not applicable/failed, reject the promise
        return Promise.reject(error);
    }
);

export const getPollsByPage = async (page: number, userId: number) => {
    const url = `${import.meta.env.VITE_BASE_API_URL}${GET_POLLS_PAGE}${page}`;
    try {
        const response = await axios.get(url, {
            params: { userId },
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

export const votePoll = async (userId: number, pollId: number, optionId: number) => {
    const url = `${import.meta.env.VITE_BASE_API_URL}${POST_VOTE}`;
    try {
        const requestData = {
            userId,
            pollId,
            optionId
        };
        const response = await axios.post(url, requestData, {
            headers: {
                'Content-Type': 'application/json',
            },
            withCredentials: true,
        });
        return response.data;
    } catch (error: unknown) {
        if (error instanceof Error) {
            throw new Error(`Failed to vote on poll: ${error.message}`);
        }
        throw new Error('Failed to vote on poll: An unknown error occurred');
    }
}

export const reactToPoll = async (userId: number, pollId: number, reactionType: string) => {
    const url = `${import.meta.env.VITE_BASE_API_URL}${POST_REACT}`;
    try {
        const requestData = {
            userId,
            pollId,
            reactionType
        };
        const response = await axios.post(url, requestData, {
            headers: {
                'Content-Type': 'application/json',
            },
            withCredentials: true,
        });
        return response.data;
    } catch (error: unknown) {
        if (error instanceof Error) {
            throw new Error(`Failed to react to poll: ${error.message}`);
        }
        throw new Error('Failed to react to poll: An unknown error occurred');
    }
}

export const removeReactionFromPoll = async (userId: number, pollId: number) => {
    const url = `${import.meta.env.VITE_BASE_API_URL}${DELETE_REACT}${userId}/${pollId}`;
    try {
        const response = await axios.delete(url, {
            headers: {
                'Content-Type': 'application/json',
            },
            withCredentials: true,
        });
        return response.data;
    } catch (error: unknown) {
        if (error instanceof Error) {
            throw new Error(`Failed to remove reaction from poll: ${error.message}`);
        }
        throw new Error('Failed to remove reaction from poll: An unknown error occurred');
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

export const deleteReaction = async (userId: number, pollId: number) => {
    const url = `${import.meta.env.VITE_BASE_API_URL}${DELETE_REACT}${userId}/${pollId}`;
    try {
        const response = await axios.delete(url, {
            headers: {
                'Content-Type': 'application/json',
            },
            withCredentials: true,
        });
        return response.data;
    } catch (error: unknown) {
        if (error instanceof Error) {
            throw new Error(`Failed to delete reaction: ${error.message}`);
        }
        throw new Error('Failed to delete reaction: An unknown error occurred');
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