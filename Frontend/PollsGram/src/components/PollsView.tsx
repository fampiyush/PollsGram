import { useEffect, useState } from 'react';
import { getPollsByPage } from '../Service/Api';
import type { Poll } from '../Types';
import PollCard from './PollCard'

const PollsView = () => {
  const [page, setPage] = useState(0);
  const [polls, setPolls] = useState({});

  useEffect(() => {
    const fetchPolls = async () => {
      try {
        const data = await getPollsByPage(page);
        setPolls(data);
      } catch (error) {
        console.error('Error fetching polls:', error);
      }
    }

    fetchPolls();
  },[page]);

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
    </div>
  )
}

export default PollsView