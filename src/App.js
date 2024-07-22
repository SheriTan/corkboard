import './App.css';
import { useState, useEffect, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { fetchAuthSession, getCurrentUser, signOut } from 'aws-amplify/auth';

// page components
import Landing from './components/Landing';
import Home from './components/dashboard/Home';
import Follow from './components/dashboard/Follow';
import Thread from './components/thread/Thread';
import Profile from './components/dashboard/Profile';

// misc components
import Layout from './components/Layout';

// utils
import SetDocumentTitle from './utils/SetDocumentTitle';
import {defaultClientRequest} from './utils/AxiosHandler';
import AuthChecker from './utils/AuthChecker';

export default function App() {
  const mounted = useRef();

  const [authenticated, setAuthenticated] = useState(false);
  const [apiKey, setAPIKey] = useState('');
  const [jwttoken, setJWTToken] = useState('');
  const [idtoken, setIDToken] = useState(null);

  const titles = {
    '/': 'Welcome to Corkboard',
    '/home': 'Home',
    '/follow': 'Follow',
    '/thread': 'Thread',
    '/profile': 'Profile'
  };

  const handleClearSession = async () => {
    if (authenticated) {
      try {
        await signOut();
        setAuthenticated(false);
        setAPIKey('');
        setJWTToken('');
        setIDToken(null);
      } catch (err) {
        console.error("Error occurred on sign out: ", err);
      }
    }
  }

  const handleCreateSession = async () => {
    if (!authenticated) {
      const authSession = await fetchAuthSession();
      let token = authSession.tokens?.accessToken?.toString();
      let user = authSession.tokens?.idToken;
      if (!token) {
        handleClearSession();
      } else {
        setJWTToken(token);
        setIDToken(user);
        try {
          const currentUser = await getCurrentUser();
          if (currentUser.userId !== '' && currentUser.username !== '' && Object.keys(currentUser.signInDetails) !== 0) {
            try {
              const response = await defaultClientRequest(
                'GET',
                `auth?param=agw`,
                {
                  "Content-Type": "application/json",
                  "Authorization": "Bearer " + token
                }
              )
              if (response.parameters[0].name.endsWith('api-key')) {
                setAPIKey(response.parameters[0].value);
                setAuthenticated(true);
              }
            } catch (err) {
              console.error('Error occurred in making request: ', err);
              handleClearSession();
            }
          }
        } catch (authError) {
          console.error('Unauthenticated user: ', authError);
          handleClearSession();
        }
      }
    }
  }

  const authProps = {
    authenticated, setAuthenticated,
    apiKey, setAPIKey,
    jwttoken, setJWTToken,
    idtoken, setIDToken,
    handleCreateSession,
    handleClearSession
  }

  useEffect(() => {
    if (!mounted.current) {
      handleCreateSession();
      mounted.current = true;
    }
  }, [])

  return (
    <Router>
      <SetDocumentTitle titles={titles} />
      <Routes>
        <Route element={<AuthChecker authProps={authProps} authType="public" />}>
          <Route path='/' element={<Landing authProps={authProps} />} />
        </Route>
        <Route element={<AuthChecker authProps={authProps} authType="private" />}>
          <Route element={<Layout authProps={authProps} />}>
            <Route path='/home' element={<Home authProps={authProps} />} />
            <Route path='/follow' element={<Follow authProps={authProps} />} />
            <Route path='/thread/:id' element={<Thread authProps={authProps} />} />
            <Route path='/profile' element={<Profile authProps={authProps} />} />
          </Route>
        </Route>
      </Routes>
    </Router>
  );
}
