import { useEffect, useState, useContext } from 'react';
import { getPollsByPage } from '../Service/Api';
import PollsContext from '../Service/PollsContext.tsx';
import type { Poll } from '../Types';
import PollCard from './PollCard'

const PollsView = () => {
  const [page, setPage] = useState(0);
  const [polls, setPolls] = useState({});

  const { accessToken } = useContext(PollsContext);

  useEffect(() => {
    const fetchPolls = async () => {
      try {
        if (!accessToken) {
          console.error('Access token is not available');
          return;
        }
        const data = await getPollsByPage(page, accessToken);
        setPolls(data);
      } catch (error) {
        console.error('Error fetching polls:', error);
      }
    }

    fetchPolls();
  },[page, accessToken]);

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