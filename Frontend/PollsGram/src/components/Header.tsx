import { GoogleLogin, type CredentialResponse } from '@react-oauth/google';
import { googleAuth, getAccessToken } from '../Service/Api';
import { useContext, useEffect } from 'react';
import PollsContext from '../Service/PollsContext.tsx';
import { jwtDecode } from 'jwt-decode';
import type { JwtPayload } from '../Types.ts';

const Header = () => {

  const { setAccessToken, user, setUser, accessToken } = useContext(PollsContext);

  useEffect(() => { 
    const userId = localStorage.getItem('userId');
    if (userId) {
      // If refresh token exists, request a new access token
      try {
        getAccessToken(Number(userId))
          .then((response) => {
            if (response.accessToken) {
              const accessToken = response.accessToken;
              setAccessToken(accessToken);
              setInfo(accessToken);
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
          setInfo(accessToken);
        } else {
          console.error('Login failed');
        }
      })
      .catch((error) => {
        console.error('Login failed:', error);
      });
  }

  const setInfo = (accessToken: string) => {
    // get userid from access token
    const decodedToken = jwtDecode<JwtPayload>(accessToken);
    localStorage.setItem('userId', decodedToken.id.toString());
    // set user id in context
    setUser({ id: decodedToken.id, email: user.email });
  }

  return (
    <div id='header'>
      <div className='header-side' /> {/* Left spacer */}
      <h1 id='header-title'>PollsGram</h1>
      <div id='header-menu-container'>
        <button className="header-menu-btn">Home</button>

        {
          !accessToken ? (
            <GoogleLogin
              onSuccess={(credentialResponse) => {
                handleLoginSuccess(credentialResponse);
              }}
              onError={() => {
                console.log('Login Failed');
              }}
              theme='filled_black'
            />
          ) : (
            <button className="header-menu-btn">Profile</button>
          )
        }
        
      </div>
    </div>
  );
};

export default Header;