import { useContext, useState, useEffect } from 'react';
import PollsContext from '../Service/PollsContext';
import Modal from 'react-modal';
import { createPoll, ACCESS_TOKEN } from '../Service/Api';
import type { Poll, Option } from '../Types';
import { toast } from 'react-toastify';
import { IoClose } from "react-icons/io5";

const customStyles = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
        backgroundColor: 'var(--bg-color)',
        color: 'var(--text-color)',
        fontSize: '1.2rem',
        minWidth: '50%',
        maxWidth: '600px',
        maxHeight: '70vh',
        border: '1px solid var(--menu-bg)',
        borderRadius: '12px',
        boxShadow: 'var(--shadow)',
        padding: '2rem',
        zIndex: 1000,
    },
    overlay: {
        backgroundColor: 'rgba(0, 0, 0, 0.75)',
    },
}

const Create = () => {
    const { createModalIsOpen, setCreateModalIsOpen, user } = useContext(PollsContext);
    const [pollTitle, setPollTitle] = useState('');
    const [numOptions, setNumOptions] = useState(2);
    const [options, setOptions] = useState(Array(2).fill(''));

    useEffect(() => {
        setOptions(Array(numOptions).fill(''));
    }, [numOptions]);

    const openModal = () => {
        setCreateModalIsOpen(true);
    };

    const closeModal = () => {
        setCreateModalIsOpen(false);
    };

    const handleOptionChange = (index: number, value: string) => {
        const newOptions = [...options];
        newOptions[index] = value;
        setOptions(newOptions);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (pollTitle.trim() === '' || options.some(option => option.trim() === '')) {
            alert('Please fill in all fields.');
            return;
        }

        if(!ACCESS_TOKEN || !user || !user.id) {
            alert('You must be logged in to create a poll.');
            return;
        }

        const optionRes: Option[] = options.map((option) => ({
            id: null,
            optionText: option,
            votesCount: 0,
            pollId: null,
        }));

        const poll: Poll = {
            id: null,
            question: pollTitle,
            creator_id: user.id,
            options: optionRes,
        };


        createPoll(poll)
            .then((response) => {
                if (response.statusCode === 201) {
                    toast.success('Poll created successfully!');
                    window.location.reload();
                } else {
                    toast.error('Failed to create poll. Please try again.');
                }
            })
            .catch((error) => {
                console.error('Error creating poll:', error);
                console.log("message: ", error.message);
            });

        closeModal();
    };

    return (
        <Modal
            isOpen={createModalIsOpen}
            onRequestClose={closeModal}
            contentLabel="Create Poll"
            style={customStyles}
            ariaHideApp={false} // Added to prevent console warnings
        >
            <div className="create-container">
                <h2>Create Poll</h2>
                <form onSubmit={handleSubmit} className="create-form">
                    <div className="form-group">
                        <label htmlFor="pollTitle">Poll Title:</label>
                        <input
                            type="text"
                            id="pollTitle"
                            name="pollTitle"
                            value={pollTitle}
                            onChange={(e) => setPollTitle(e.target.value)}
                            maxLength={80}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="numOptions">Number of Options (2-5):</label>
                        <select
                            id="numOptions"
                            name="numOptions"
                            value={numOptions}
                            onChange={(e) => {
                                const val = parseInt(e.target.value);
                                setNumOptions(val);
                            }}
                            required
                        >
                            <option value="2">2</option>
                            <option value="3">3</option>
                            <option value="4">4</option>
                            <option value="5">5</option>
                        </select>
                    </div>
                    {options.map((option, index) => (
                        <div className="form-group" key={index}>
                            <label htmlFor={`option${index + 1}`}>{`Option ${index + 1}:`}</label>
                            <input
                                type="text"
                                id={`option${index + 1}`}
                                name={`option${index + 1}`}
                                value={option}
                                onChange={(e) => handleOptionChange(index, e.target.value)}
                                maxLength={65}
                                required
                            />
                        </div>
                    ))}
                    <button type="submit" className="submit-poll-btn">Create Poll</button>
                </form>
                <button onClick={closeModal} id='modal-close'>
                    <IoClose color='red' className='modal-close-btn' />
                </button>
            </div>
        </Modal>
    )
}

export default Create