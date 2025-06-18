import { useState, useEffect, useRef } from 'react';
import type { Poll } from '../Types.ts';
import { deletePoll } from '../Service/Api.ts';
import { toast } from 'react-toastify';

const PollCardSelf = ({ initialPoll, onDelete }: { initialPoll: Poll, onDelete: (pollId: number) => void }) => {
    const [currentPoll, setCurrentPoll] = useState<Poll>(initialPoll);
    const [showConfirm, setShowConfirm] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setCurrentPoll(initialPoll);
    }, [initialPoll]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setMenuOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [menuRef]);

    const handleMenuClick = () => {
        setMenuOpen(!menuOpen);
    };

    const handleDeleteClick = () => {
        setMenuOpen(false);
        setShowConfirm(true);
    };

    const handleCancelDelete = () => {
        setShowConfirm(false);
    };

    const handleConfirmDelete = async () => {
        if (!currentPoll.id) return;
        try {
            await deletePoll(currentPoll.id);
            toast.success('Poll deleted successfully!');
            onDelete(currentPoll.id);
            setShowConfirm(false);
        } catch (error) {
            console.error('Failed to delete poll:', error);
            toast.error('Failed to delete poll.');
        }
    };

    return (
        <div>
            <div className="poll-card">
                <div className="poll-card-menu-container" ref={menuRef}>
                    <button onClick={handleMenuClick} className="poll-card-menu-btn">⋮</button>
                    {menuOpen && (
                        <div className="poll-card-menu">
                            <button onClick={handleDeleteClick} className="poll-card-menu-item">Delete</button>
                        </div>
                    )}
                </div>
                {showConfirm && (
                    <div className="confirm-dialog-overlay">
                        <div className="confirm-dialog">
                            <p>Are you sure you want to delete this poll?</p>
                            <button onClick={handleConfirmDelete} className="poll-button confirm-button">Confirm</button>
                            <button onClick={handleCancelDelete} className="poll-button cancel-button">Cancel</button>
                        </div>
                    </div>
                )}
                <p>{currentPoll.question}</p>
                <div className="poll-card-options">
                    {currentPoll.options.map((option) => (
                        <div
                            key={option.id}
                            className="poll-card-option"
                        >
                            <span>{option.optionText}</span>
                            <span>{option.votesCount} votes</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default PollCardSelf;