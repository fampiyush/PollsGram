import { useState, useContext, useEffect } from 'react';
import type { Poll, Option } from '../Types';
import { votePoll } from '../Service/Api';
import PollsContext from '../Service/PollsContext.tsx';
import { toast } from 'react-toastify';

const PollCard = (initialPoll: Poll) => {
    const [currentPoll, setCurrentPoll] = useState<Poll>(initialPoll);
    const [selectedOption, setSelectedOption] = useState<Option | null>(null);
    const { user } = useContext(PollsContext);

    useEffect(() => {
        setCurrentPoll(initialPoll);
        setSelectedOption(null);
    }, [initialPoll]);

  const handleOptionSelect = (option: Option) => {
    if (!currentPoll.voted) {
      setSelectedOption(option);
    }
  };

  const handleConfirmVote = () => {
    if (selectedOption) {
        if (!user.id || !currentPoll.id || !selectedOption.id) {
            console.error('User is not logged in or poll/option ID is missing');
            toast.error('Cannot vote: Missing required information.');
            return;
        }

        votePoll(user.id, currentPoll.id, selectedOption.id)
            .then(() => {
                // Update poll state to reflect the vote
                setCurrentPoll(prevPoll => {
                    const updatedOptions = prevPoll.options.map(opt =>
                        opt.id === selectedOption.id ? { ...opt, votesCount: opt.votesCount + 1 } : opt
                    );
                    return {
                        ...prevPoll,
                        voted: true,
                        votedOptionId: selectedOption.id,
                        options: updatedOptions,
                    };
                });
                toast.success('Vote cast successfully!');
            })
            .catch((error) => {
                console.error('Error voting for poll:', error);
                toast.error('Failed to cast your vote. Please try again.');
            });
        setSelectedOption(null); // Reset selection
    }
  };

  const handleCancelVote = () => {
    setSelectedOption(null);
  };

  return (
    <div>
      <div className="poll-card">
        <p>{currentPoll.question}</p>
        <div className="poll-card-options">
          {currentPoll.voted ? (
            // Display results if already voted
            currentPoll.options.map((option) => (
              <div
                key={option.id}
                className={`poll-card-option ${
                  option.id === currentPoll.votedOptionId ? 'voted-option' : ''
                }`}
              >
                <span>{option.optionText}</span>
                <span>{option.votesCount} votes</span>
              </div>
            ))
          ) : (
            // Display options for voting
            currentPoll.options.map((option, index) => (
              <div
                key={option.id || index} // Use option.id if available, otherwise index
                className={`poll-card-option ${
                  selectedOption?.id === option.id ? 'selected-option' : ''
                }`}
                onClick={() => handleOptionSelect(option)}
              >
                <label
                  htmlFor={`option-${currentPoll.id}-${option.id || index}`}
                  style={{ userSelect: 'none', cursor: 'pointer' }}
                >
                  {option.optionText}
                </label>
                <input
                  type="radio"
                  name={`poll-option-${currentPoll.id}`}
                  id={`option-${currentPoll.id}-${option.id || index}`}
                  checked={selectedOption?.id === option.id}
                  onChange={() => handleOptionSelect(option)} // Ensure radio button change also updates state
                />
              </div>
            ))
          )}
        </div>
        {!currentPoll.voted && selectedOption && (
          <div className="poll-card-actions">
            <button onClick={handleConfirmVote} className="poll-button confirm-button">Confirm</button>
            <button onClick={handleCancelVote} className="poll-button cancel-button">Cancel</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PollCard;