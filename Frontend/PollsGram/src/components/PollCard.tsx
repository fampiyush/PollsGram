import { useState, useContext, useEffect } from 'react';
import type { Poll, Option, ReactionType } from '../Types';
import { votePoll, reactToPoll, deleteReaction } from '../Service/Api';
import PollsContext from '../Service/PollsContext.tsx';
import { toast } from 'react-toastify';
import { AiOutlineLike, AiOutlineDislike, AiFillLike, AiFillDislike } from "react-icons/ai";

const PollCard = (initialPoll: Poll) => {
  const [currentPoll, setCurrentPoll] = useState<Poll>(initialPoll);
  const [selectedOption, setSelectedOption] = useState<Option | null>(null);
  const [reaction, setReaction] = useState<ReactionType>(null); // UI-only reaction state
  const [likeCount, setLikeCount] = useState<number>(initialPoll.likes ?? 0);
  const [dislikeCount, setDislikeCount] = useState<number>(initialPoll.dislikes ?? 0);
  const { user } = useContext(PollsContext);

  useEffect(() => {
    setCurrentPoll(initialPoll);
    setSelectedOption(null);
    if (initialPoll.hasReacted) {
      setReaction(initialPoll.reactionType);
    } else {
      setReaction(null);
    }
    setLikeCount(initialPoll.likes ?? 0);
    setDislikeCount(initialPoll.dislikes ?? 0);
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

  const onReactionChange = (newReaction: ReactionType) => {
    if (!(user.id && currentPoll.id)) return;

    const prevReaction = reaction;

    const applyLocalCounts = (target: ReactionType) => {
      if (prevReaction === 'LIKE') setLikeCount(c => Math.max(0, c - 1));
      else if (prevReaction === 'DISLIKE') setDislikeCount(c => Math.max(0, c - 1));

      if (target === 'LIKE') setLikeCount(c => c + 1);
      else if (target === 'DISLIKE') setDislikeCount(c => c + 1);
    };

    if (newReaction) {
      applyLocalCounts(newReaction);
      setReaction(newReaction);
      reactToPoll(user.id, currentPoll.id, newReaction)
        .then(() => {
          toast.success(`Successfully ${newReaction === 'LIKE' ? 'liked' : 'disliked'} the poll!`);
        })
        .catch((error) => {
            if (newReaction === 'LIKE') setLikeCount(c => Math.max(0, c - 1));
            if (newReaction === 'DISLIKE') setDislikeCount(c => Math.max(0, c - 1));

            if (prevReaction === 'LIKE') setLikeCount(c => c + 1);
            if (prevReaction === 'DISLIKE') setDislikeCount(c => c + 1);
            setReaction(prevReaction);
          console.error('Error reacting to poll:', error);
          toast.error('Failed to react to the poll. Please try again.');
        });
    } else {
      // Removing reaction
      if (prevReaction === 'LIKE') setLikeCount(c => Math.max(0, c - 1));
      if (prevReaction === 'DISLIKE') setDislikeCount(c => Math.max(0, c - 1));
      setReaction(null);
      deleteReaction(user.id, currentPoll.id)
        .then(() => {
          toast.success('Successfully removed your reaction from the poll!');
        })
        .catch((error) => {
          // Revert removal
          if (prevReaction === 'LIKE') setLikeCount(c => c + 1);
          if (prevReaction === 'DISLIKE') setDislikeCount(c => c + 1);
          setReaction(prevReaction);
          console.error('Error removing reaction from poll:', error);
          toast.error('Failed to remove your reaction from the poll. Please try again.');
        });
    }
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
        <div className='likeUnlikeContainerSelf likeUnlikeContainer'>
          <div className="reaction-group">
            <button
              className={`likeButton ${reaction === 'LIKE' ? 'active' : ''}`}
              type="button"
              aria-label={reaction === 'LIKE' ? 'Remove like' : 'Like'}
              onClick={() => onReactionChange(reaction === 'LIKE' ? null : 'LIKE')}
            >
              {reaction === 'LIKE' ? <AiFillLike /> : <AiOutlineLike />}
            </button>
            <span className="reaction-count like-count">{likeCount}</span>
          </div>
          <div className="reaction-group">
            <button
              className={`unlikeButton ${reaction === 'DISLIKE' ? 'active' : ''}`}
              type="button"
              aria-label={reaction === 'DISLIKE' ? 'Remove dislike' : 'Dislike'}
              onClick={() => onReactionChange(reaction === 'DISLIKE' ? null : 'DISLIKE')}
            >
              {reaction === 'DISLIKE' ? <AiFillDislike /> : <AiOutlineDislike />}
            </button>
            <span className="reaction-count unlike-count">{dislikeCount}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PollCard;