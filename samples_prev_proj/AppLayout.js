import React, { Fragment } from 'react';
import { Outlet } from 'react-router-dom';
import { Navigate } from 'react-router-dom';
import Sidebar from "./Sidebar";

const AppLayout = ({ authProps }) => {
    return (
        <Fragment className='main_layout'>
                <Sidebar authProps={authProps} />
                <Outlet authProps={authProps} />
        </Fragment>
    )
};

export default AppLayout;
