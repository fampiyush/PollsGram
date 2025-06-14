import { useContext, useEffect, useState } from 'react'
import PollsContext from '../Service/PollsContext.tsx'
import type { Poll } from '../Types';
import PollCard from './PollCard';
import { getPollsByUserId, logout, ACCESS_TOKEN } from '../Service/Api.ts';
import { toast } from 'react-toastify';

const Profile = () => {
    const { user, setUser } = useContext(PollsContext);
    const [userPolls, setUserPolls] = useState({});

    useEffect(() => {
        const fetchUserPolls = async () => {
            if (!user.id || !ACCESS_TOKEN) {
                return;
            }
            try {
                const data = await getPollsByUserId(user.id);
                setUserPolls(data);
                console.log('User Polls:', data);
            } catch (error) {
                console.error('Error fetching user polls:', error);
            }
        };

        fetchUserPolls();
    }, [user]);

    const handleLogout = () => {
        if (!user.id || !ACCESS_TOKEN) {
            toast.error('You are not logged in');
            return;
        }
        logout(user.id)
            .then(() => {
                toast.success('Logout successful');
            })
            .catch((error) => {
                console.error('Logout failed:', error);
                toast.error('Logout failed');
            });
        setUser({ id: null, email: null });
        localStorage.removeItem('userId');
        window.location.href = '/'; // Redirect to home page after logout
    };

  return (
    <div className='profile-container'>
        <div className="profile-header">
            <h2>Profile</h2>
        </div>
        <div className="profile-info">
            <p><strong>Email:</strong> {user.email}</p>
        </div>
        <div className="user-polls-section">
            <h3>Your Polls</h3>
            <hr />
            {userPolls && Object.keys(userPolls).length > 0 ? (
                <div className="polls-grid">
                    {Object.entries(userPolls).map(([key, poll]) => (
                        <PollCard key={key} {...poll as Poll} />
                    ))}
                </div>
            ) : (
                <p>You haven't created any polls yet.</p>
            )}
        </div>
        <hr />
        <button onClick={handleLogout} className="logout-button header-menu-btn">Logout</button>
    </div>
  )
}

export default Profile