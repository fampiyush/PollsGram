import type { Poll } from '../Types';

const PollCard = (poll: Poll) => {
  return (
    <div>
        <div className="poll-card">
            <p>{poll.question}</p>
            <div className="poll-card-options">
                {poll.options.map((option, index) => (
                    <div 
                        key={index} 
                        className="poll-card-option"
                        onClick={() => document.getElementById(`option-${poll.id}-${index}`)?.click()}
                    >
                        <label 
                            htmlFor={`option-${poll.id}-${index}`}
                            style={{ userSelect: 'none', cursor: 'pointer' }}
                        >
                            {option.optionText}
                        </label>
                        <input type="radio" name="poll-option" id={`option-${poll.id}-${index}`} />
                    </div>
                ))}
            </div>
        </div>
    </div>
  )
}

export default PollCard