import React, { useEffect, Fragment } from 'react';
import { Outlet } from 'react-router-dom';
import { Navigate, useNavigate } from 'react-router-dom';

const AuthChecker = ({ authProps, authType }) => {
    if (authType === "public") {
        return (
            <div>
                {
                !authProps.isAuthenticated ? 
                    <Fragment>
                        <Outlet authProps={authProps} />
                    </Fragment>
                :
                    <Navigate to="/home" />
                }
            </div>
        )
    } else if (authType === "private") {
        return (
            <div>
                {
                authProps.isAuthenticated ? /* If authorized, return an outlet that will render child elements. If not, return element that will navigate to login page. */
                    <Fragment>
                        <Outlet authProps={authProps} />
                    </Fragment>
                :
                    <Navigate to="/signin" />
                }
            </div>       
        ) 
    }
};

export default AuthChecker;