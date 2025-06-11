import { useEffect, useState, useContext } from 'react';
import { getPollsByPage } from '../Service/Api';
import PollsContext from '../Service/PollsContext.tsx';
import type { Poll } from '../Types';
import PollCard from './PollCard'

const PollsView = () => {
  const [page, setPage] = useState(0);
  const [polls, setPolls] = useState({});
  const [noMorePolls, setNoMorePolls] = useState(false); // Added state to track if there are no more polls

  const { accessToken } = useContext(PollsContext);

  useEffect(() => {
    const fetchPolls = async () => {
      try {
        if (!accessToken) {
          return;
        }
        const data = await getPollsByPage(page, accessToken);
        setPolls(data);
        setNoMorePolls(Object.keys(data).length < 5); // Update based on fetched data: true if less than 5 polls
      } catch (error) {
        console.error('Error fetching polls:', error);
        setNoMorePolls(true); // Assume no more polls on error, disable next button
      }
    }

    fetchPolls();
  },[page, accessToken]);

  const handlePreviousPage = () => {
    setPage(prevPage => Math.max(0, prevPage - 1));
  };

  const handleNextPage = () => {
    setPage(prevPage => prevPage + 1);
  };

  return (
    <div id='polls-view'>
      <div className="polls-grid">
        {polls && Object.keys(polls).length > 0 ? (
          Object.entries(polls).map(([key, poll]) => (
            <PollCard key={key} {...poll as Poll} />
          ))
        ) : (
          <p>No polls available</p>
        )}
      </div>
      <div className="pagination-controls">
        <button onClick={handlePreviousPage} disabled={page === 0}>
          Previous
        </button>
        <span>Page {page + 1}</span>
        <button onClick={handleNextPage} disabled={noMorePolls}> {/* Updated disabled condition */}
          Next
        </button>
      </div>
    </div>
  )
}

export default PollsView