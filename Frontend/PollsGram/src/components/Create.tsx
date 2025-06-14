import { useContext, useState, useEffect } from 'react';
import PollsContext from '../Service/PollsContext';
import Modal from 'react-modal';
import { createPoll, ACCESS_TOKEN } from '../Service/Api';
import type { Poll, Option } from '../Types';
import { toast } from 'react-toastify';

const customStyles = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
        backgroundColor: 'var(--bg-color)', // Updated
        color: 'var(--text-color)', // Added
        fontSize: '1.2rem', // Adjusted for better fit with new styles
        minWidth: '50%',
        maxWidth: '600px', // Added for better responsiveness
        maxHeight: '70vh', // Added to prevent overflow
        border: '1px solid var(--menu-bg)', // Added
        borderRadius: '12px', // Added
        boxShadow: 'var(--shadow)', // Added
        padding: '2rem', // Added for better spacing
        zIndex: 1000, // Added to ensure modal is on top
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
            ariaHideApp={false} // Added to prevent console warnings, set appropriately for your app
        >
            <div className="create-container">
                <h2>Create Poll</h2>
                <form onSubmit={handleSubmit} className="create-form"> {/* Added className */}
                    <div className="form-group">
                        <label htmlFor="pollTitle">Poll Title:</label>
                        <input
                            type="text"
                            id="pollTitle"
                            name="pollTitle"
                            value={pollTitle}
                            onChange={(e) => setPollTitle(e.target.value)}
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
                                required
                            />
                        </div>
                    ))}
                    <button type="submit" className="submit-poll-btn">Create Poll</button> {/* Added className */}
                </form>
                <button onClick={closeModal} id='modal-close' className="modal-close-btn">❌</button> {/* Added className */}
            </div>
        </Modal>
    )
}

export default Create