import Menu from './Menu';
import { Outlet } from 'react-router-dom';
export default function Layout({ authProps }) {
    return (
        <div style={{ display: 'flex' }}>
            <Menu authProps={authProps} />
            <div style={{ paddingLeft: '100px' }}>
                <Outlet />
            </div>
        </div>
    )
}