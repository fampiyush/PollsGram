import { GoogleLogin, type CredentialResponse } from '@react-oauth/google';
import { googleAuth, getAccessToken } from '../Service/Api';
import { useContext, useEffect } from 'react';
import PollsContext from '../Service/PollsContext.tsx';

const Header = () => {

  const { setAccessToken, user } = useContext(PollsContext);

  useEffect(() => {
    // Check for refresh token and ask for access token if it exists
    const refreshToken = document.cookie
      .split('; ')
      .find(row => row.startsWith('refreshToken='))
      ?.split('=')[1];

      const userId = user.id;

    if (refreshToken && userId) {
      // If refresh token exists, request a new access token
      try {
        getAccessToken(userId)
          .then((response) => {
            if (response.accessToken) {
              const accessToken = response.accessToken;
              setAccessToken(accessToken);
            } else {
              console.error('Failed to retrieve access token');
            }
          })
          .catch((error) => {
            console.error('Error fetching access token:', error);
          });
      } catch (error) {
        console.error('Failed to refresh token:', error);
      }
    }
  }, []);

  const handleLoginSuccess = (credentialResponse: CredentialResponse) => {
    googleAuth(credentialResponse.credential || '')
      .then((response) => {
        if (response.accessToken) {
          const accessToken = response.accessToken;
          setAccessToken(accessToken);
        } else {
          console.error('Login failed');
        }
      })
      .catch((error) => {
        console.error('Login failed:', error);
      });
  }

  return (
    <div id='header'>
      <div className='header-side' /> {/* Left spacer */}
      <h1 id='header-title'>PollsGram</h1>
      <div id='header-menu-container'>
        <button className="header-menu-btn">Home</button>
        {/* <button className="header-menu-btn"> */}
          <GoogleLogin
            onSuccess={(credentialResponse) => {
              handleLoginSuccess(credentialResponse);
            }}
            onError={() => {
              console.log('Login Failed');
            }}
            theme='filled_black'
          />
        {/* </button> */}
      </div>
    </div>
  );
};

export default Header;