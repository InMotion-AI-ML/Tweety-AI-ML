// import React from 'react';
// // import {useNavigate} from 'react-router-dom' // needs to be installed; then replace onClick handling

// const Logout = () => {
//   return (
//     <div className='Logout'>
//       <button
//         onClick={() =>
//           (window.location.href = 'http://localhost:8080/auth/google')
//         }
//       >
//         Log In
//       </button>
//     </div>
//   );
// };

// {
//   /* <body>
//   <h1>Welcome to the Google Login Demo</h1>
//   <p>If you're not logged in, please click below to login with Google:</p>
//   <a href="/auth/google"><button>Login with Google</button></a>
  
//   <p id="user-info"></p>

//   <a href="/logout" id="logout-button" style="display:none;"><button>Logout</button></a>

//   <script>
//     document.addEventListener("DOMContentLoaded", () => {
//       if (document.body.innerHTML.includes('Welcome')) {
//         document.getElementById('logout-button').style.display = 'inline';
//       } else {
//         document.getElementById('logout-button').style.display = 'none';
//       }
//     });
//   </script>
// </body> */
// }

// export default Logout;

import React, { useEffect, useState } from 'react';

const Logout = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check if the user is authenticated by checking the session or a specific API endpoint
    const checkAuthStatus = async () => {
      try {
        const res = await fetch('http://localhost:3000/api/auth/status', { method: 'GET' });
        if (res.ok) {
          const data = await res.json();
          setIsAuthenticated(data.isAuthenticated); // Assume the response returns an 'isAuthenticated' field
        }
      } catch (error) {
        console.error('Error checking authentication status', error);
      }
    };

    checkAuthStatus();

    // Load the Google Identity Services script dynamically
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.onload = () => {
      // Initialize Google One Tap
      window.google.accounts.id.initialize({
        client_id: process.env.REACT_APP_GOOGLE_CLIENT_ID, // Ensure this is set in your .env file
        callback: handleLoginResponse,
      });
    };
    document.body.appendChild(script);

    return () => {
      // Clean up the script when the component is unmounted
      document.body.removeChild(script);
    };
  }, []);

  const handleLoginResponse = async (response) => {
    try {
      // Send the ID token to your backend for validation and session management
      const res = await fetch('http://localhost:3000/auth/google/onetap', {
        method: 'POST',
        body: JSON.stringify({ token: response.credential }), // Send the Google ID token
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (res.ok) {
        // On successful login, update authentication status
        setIsAuthenticated(true);
        window.location.href = '/'; // Redirect to the home page
      } else {
        console.error('Failed to authenticate');
      }
    } catch (error) {
      console.error('Error during Google One Tap login', error);
    }
  };

  const handleLogout = async () => {
    try {
      // Call your backend to log the user out
      const res = await fetch('http://localhost:3000/logout', {
        method: 'GET', // Assuming a GET request for logging out
      });

      if (res.ok) {
        setIsAuthenticated(false); // Update state to reflect the user is logged out
        window.location.href = '/'; // Redirect to the home page
      } else {
        console.error('Failed to log out');
      }
    } catch (error) {
      console.error('Error during logout', error);
    }
  };

  return (
    <div id='Logout'
    className='mb-2 pb-2 px-4 py-0.3 cursor-pointer bg-red-600 rounded-lg hover:bg-red-700'>
      <h1 onClick={handleLogout}>Log Out</h1>
      {/* {isAuthenticated ? (
        <h1 onClick={handleLogout}>Log Out</h1>
      ) : (
        <button onClick={() => window.google.accounts.id.prompt()}>Log In with Google</button>
      )} */}
    </div>
  );
};

export default Logout;