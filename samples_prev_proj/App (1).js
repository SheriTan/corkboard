import './App.css';

import React, { useState, useEffect, useRef } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import axios from 'axios';

// Utilities
import AppLayout from './utils/AppLayout';
import AnimatedRoutes from './utils/AnimatedRoutes';

// Pages
import ForgotPassword from './frontend/ForgotPassword';
import Home from './frontend/dashboard/Home';
import MyProject from './frontend/dashboard/MyProject';
import SharedProjects from './frontend/dashboard/SharedProjects';
import ManageAssets from './frontend/dashboard/ManageAssets';
import Trash from './frontend/dashboard/Trash';
import Account from './frontend/dashboard/Account';
import Canvas from './frontend/canvas/CanvasMain';
import SignIn from './frontend/SignIn';
import { Auth } from 'aws-amplify';
import AuthChecker from './utils/AuthChecker';
import UploadAssets from './frontend/dashboard/UploadAssets';

export default function App() {
  const mounted = useRef();
  const url = 'https://ffaalvafm2.execute-api.us-east-1.amazonaws.com/dev/';

  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [user, setUser] = useState(null);  
  const [profile, setProfile] = useState(null);
  const [token, setToken] = useState(null);

  const authProps = { 
    isAuthenticated, user, profile, token,
    setIsAuthenticated, setUser, setProfile, setToken
  };

  useEffect(() => {
    if (!mounted.current) {
      Auth.currentSession()
      .then((session) => {    
        let token = session.getIdToken().getJwtToken();

        setIsAuthenticated(true);
        Auth.currentAuthenticatedUser({bypassCache: true})
        .then(async(user) => {
          const config = {
            url: url + "projects",
            method: 'GET',
            headers: {
              'Authorization': "Bearer " + token,
              'email': user.attributes.email
            }
          };

          await axios.request(config)
            .then((response) => {
              var {data} = JSON.parse(response);

              setUser(user);
              setProfile(data);
              setToken(token);
            })
            .catch((error) => console.log('Error: ', error));
        })
        .catch((e) => {
          setIsAuthenticated(false);
        })
      })
      .catch((e) => {
        setIsAuthenticated(false);
      })
      mounted.current = true;
    }    
  }, []);

  return (
    <BrowserRouter>
      <Routes>
      <Route element={<AuthChecker authProps={authProps} authType="public" />}>
        <Route path="/*" element={<AnimatedRoutes authProps={authProps} />} />
        <Route path='/forgotpassword' element={<ForgotPassword authProps={authProps} />} />
      </Route>
        
        <Route element={<AuthChecker authProps={authProps} authType="private" />}>
          <Route element={<AppLayout authProps={authProps} />}>
            <Route path='/home' element={<Home authProps={authProps} />} />
            <Route path='/myproject' element={<MyProject authProps={authProps} />} />
            <Route path='/shared' element={<SharedProjects authProps={authProps} />} />
            <Route path='/assets' element={<ManageAssets authProps={authProps} />} />
            <Route path='/assets/upload' element={<UploadAssets authProps={authProps}/>} />
            <Route path='/trash' element={<Trash authProps={authProps} />} />
            <Route path='/account' element={<Account authProps={authProps} />} />
          </Route>
        </Route> 
        <Route path='/create' element={<Canvas url={url}/>} />
      </Routes>
    </BrowserRouter>
  )
}