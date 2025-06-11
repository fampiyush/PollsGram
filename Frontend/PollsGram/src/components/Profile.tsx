import { useContext, useEffect, useState } from 'react'
import PollsContext from '../Service/PollsContext.tsx'// Assuming this function will be created
import type { Poll } from '../Types';
import PollCard from './PollCard';
// import '../App.css'; // Styles will be in App.css

const Profile = () => {
    const { user, setAccessToken, setUser } = useContext(PollsContext);
    // const [userPolls, setUserPolls] = useState<Record<string, Poll>>({});

    useEffect(() => {
        const fetchUserPolls = async () => {
            // if (user && user.id && user.email) { // user.email was used in old code, ensure user.id is primary
            //     try {
            //         // We'll need to ensure getPollsByUserId is implemented in Api.ts
            //         // For now, assuming it takes userId and accessToken
            //         const pollsData = await getPollsByUserId(user.id, localStorage.getItem('accessToken') || '');
            //         setUserPolls(pollsData);
            //     } catch (error) {
            //         console.error("Failed to fetch user polls:", error);
            //         setUserPolls({}); // Reset or handle error appropriately
            //     }
            // }
        };

        fetchUserPolls();
    }, [user]);

    const handleLogout = () => {
        setAccessToken(null);
        setUser({ id: null, email: null });
        localStorage.removeItem('userId');
    };

  return (
    <div className='profile-container'>
        <div className="profile-header">
            <h2>Profile</h2>
            <button onClick={handleLogout} className="logout-button header-menu-btn">Logout</button>
        </div>
        <div className="profile-info">
            <p><strong>Email:</strong> {user.email}</p>
        </div>

        <div className="user-polls-section">
            <h3>Your Polls</h3>
            {/* {userPolls && Object.keys(userPolls).length > 0 ? (
                <div className="polls-grid">
                    {Object.entries(userPolls).map(([key, poll]) => (
                        <PollCard key={key} {...poll} />
                    ))}
                </div>
            ) : (
                <p>You haven't created any polls yet.</p>
            )} */}
        </div>
    </div>
  )
}

export default Profile