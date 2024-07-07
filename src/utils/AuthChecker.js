import { Navigate, Outlet } from "react-router-dom";

export default function AuthChecker({ authProps, authType }) {

    return (
        <>
            {authType === 'public' ?
                authProps.authenticated ?
                    <Navigate to='/home' />
                    :
                    <Outlet />
                : authType === 'private' &&
                    authProps.authenticated ?
                    <Outlet />
                    :
                    <Navigate to='/' />
            }
        </>
    )
}