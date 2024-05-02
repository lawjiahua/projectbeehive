import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { GoogleOAuthProvider } from '@react-oauth/google';

import {UserProvider} from './UserContext'

// const googleClientId = process.env.REACT_APP_GOOGLE_CLIENT_ID || '';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  // <GoogleOAuthProvider clientId={googleClientId}>
    // <UserProvider>
        <App />
    // </UserProvider>
  // </GoogleOAuthProvider>,
);

