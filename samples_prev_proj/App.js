import './App.css';
import React, { useEffect, useRef, useState } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';

import Layout from './utils/Layout';
import About from './components/About';
import Projects from './components/Projects';
import Project from './components/Project';
import Contact from './components/Contact';

const App = () => {
  const [projects, setProjects] = useState([]);
  const [subHeading, setSubHeading] = useState('');

  const [pages, setPages] = useState([
    {
      name: 'About',
      to: '/',
      url: '',
    },
    {
      name: 'Projects',
      to: '/projects',
      url: 'projects',
      subsection: [
        { section: 'Polytechnic', active: true }
      ]
    },
    {
      name: 'Contact',
      to: '/contact',
      url: 'contact',
    },
  ]);

  useEffect(() => {
  }, [projects, subHeading])

  const appContents = {
    pages: pages,
    projects: projects,
    setProjects: setProjects,
    subHeading: subHeading,
    setSubHeading: setSubHeading
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout contents={appContents} />}>
          <Route path='/' element={<About title={'About Me'} />} />
          <Route path='/projects' element={<Projects title={'Projects'} contents={appContents} />} />
          <Route path='/project/*' element={<Project projects={projects} />} />
          <Route path='/contact' element={<Contact title={'Contact Me'} />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;