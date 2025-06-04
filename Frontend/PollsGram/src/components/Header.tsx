import { GoogleLogin, type CredentialResponse } from '@react-oauth/google';
import { googleAuth } from '../Service/Api';
import { useContext } from 'react';
import PollsContext from '../Service/PollsContext.tsx';

const Header = () => {

  const { setAccessToken } = useContext(PollsContext);

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