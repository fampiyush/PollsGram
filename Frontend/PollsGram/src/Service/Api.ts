import type { Poll, Option } from '../Types';

// GET
const GET_POLLS_PAGE = '/polls/page/'; // required /pageNumber

// POST
const POST_POLL = '/polls/create/';
const POST_OPTION = '/options/create/';
const POST_GOOGLE_AUTH = '/auth/google'; 

// PATCH
const PATCH_POLL_QUESTION = '/polls/update/question/'; // required /pollsId
const PATCH_OPTION_TEXT = '/options/update/';

// DELETE
const DELETE_POLL = '/polls/delete/'; // required /pollId
const DELETE_OPTION = '/options/delete/'; // required /optionId

export const getPollsByPage = async (page: number, accessToken: string) => {
    const url = `${import.meta.env.VITE_BASE_API_URL}${GET_POLLS_PAGE}${page}`;
    const response = await fetch(url, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
        },
    });
    if (!response.ok) {
        throw new Error('Failed to fetch polls');
    }
    const data = await response.json();
    return data;
}

export const createPoll = async (poll: Poll, accessToken: string) => {
    const url = `${import.meta.env.VITE_BASE_API_URL}${POST_POLL}`;
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(poll),
    });
    if (!response.ok) {
        throw new Error('Failed to create poll');
    }
    const data = await response.json();
    return data;
}

export const createOption = async (option: Option, accessToken: string) => {
    const url = `${import.meta.env.VITE_BASE_API_URL}${POST_OPTION}`;
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(option),
    });
    if (!response.ok) {
        throw new Error('Failed to create option');
    }
    const data = await response.json();
    return data;
}

export const updatePollQuestion = async (pollId: number, question: string, accessToken: string) => {
    const url = `${import.meta.env.VITE_BASE_API_URL}${PATCH_POLL_QUESTION}${pollId}`;
    const response = await fetch(url, {
        method: 'PATCH',
        headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ question }),
    });
    if (!response.ok) {
        throw new Error('Failed to update poll question');
    }
    const data = await response.json();
    return data;
}

export const updateOptionText = async (optionId: number, text: string, accessToken: string) => {
    const url = `${import.meta.env.VITE_BASE_API_URL}${PATCH_OPTION_TEXT}${optionId}`;
    const response = await fetch(url, {
        method: 'PATCH',
        headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text }),
    });
    if (!response.ok) {
        throw new Error('Failed to update option text');
    }
    const data = await response.json();
    return data;
}

export const deletePoll = async (pollId: number, accessToken: string) => {
    const url = `${import.meta.env.VITE_BASE_API_URL}${DELETE_POLL}${pollId}`;
    const response = await fetch(url, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
        },
    });
    if (!response.ok) {
        throw new Error('Failed to delete poll');
    }
    const data = await response.json();
    return data;
}

export const deleteOption = async (optionId: number, accessToken: string) => {
    const url = `${import.meta.env.VITE_BASE_API_URL}${DELETE_OPTION}${optionId}`;
    const response = await fetch(url, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
        },
    });
    if (!response.ok) {
        throw new Error('Failed to delete option');
    }
    const data = await response.json();
    return data;
}

export const googleAuth = async (credential: string) => {
    const url = `${import.meta.env.VITE_BASE_API_URL}${POST_GOOGLE_AUTH}`;
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ credential }),
    });
    if (!response.ok) {
        throw new Error('Failed to authenticate with Google');
    }
    const data = await response.json();
    return data;
}