import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
const Layout = ({contents}) => {
    return (
        <div className='background_container'>
            <div className='inner_container'>
                <Sidebar items={contents} />
                <div className='main_content'>
                    <Outlet />
                </div>
            </div>
        </div>
    );
}

export default Layout;