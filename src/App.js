import './App.css';
import {useState, useEffect} from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// pages
import Landing from './components/Landing';
import Home from './components/dashboard/Home';
import Follow from './components/dashboard/Follow';
import Profile from './components/dashboard/Profile';

// utils
import SetDocumentTitle from './utils/SetDocumentTitle';



export default function App() {
  const url = process.env.REACT_APP_API_URL;
  const region = process.env.REACT_APP_AWS_REGION;
  
  const titles = {
    '/': 'Welcome to Corkboard',
    '/home': 'Home',
    '/follow': 'Follow',
    '/profile': 'Profile'
  }

  useEffect(()=>{
  }, [])
  
  return (
    <Router>
      <SetDocumentTitle titles={titles} />
      <Routes>
        <Route accessType = 'public'>
          <Route path = '/' element={<Landing/>} />
        </Route>

        <Route accessType = 'private'>
          <Route path = '/home' element={<Home />} />
          <Route path = '/follow' element={<Follow />} />
          <Route path = '/profile' element={<Profile />} />
        </Route>
      </Routes>
    </Router>
  );
}
