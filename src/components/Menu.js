import { HomeSharp, NotificationsSharp, PersonSharp, LogoutSharp } from "@mui/icons-material";
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { IconButton } from "@mui/material";

export default function Menu({ authProps }) {
    const location = useLocation();
    const currPath = location.pathname.split('/')[1];
    const [activeItem, setActiveItem] = useState(0);

    const navItems = [
        {
            page: 'Home',
            default: <HomeSharp sx={{ color: '#ffffff' }} />,
            active: <HomeSharp sx={{ color: '#071013' }} />,
            to: '/home'
        },
        {
            page: 'Follow',
            default: <NotificationsSharp sx={{ color: '#ffffff' }} />,
            active: <NotificationsSharp sx={{ color: '#071013' }} />,
            to: '/follow'
        },
        {
            page: 'Profile',
            default: <PersonSharp sx={{ color: '#ffffff' }} />,
            active: <PersonSharp sx={{ color: '#071013' }} />,
            to: '/profile'
        },
        {
            page: 'Logout',
            default: <LogoutSharp sx={{ color: '#ffffff' }} />
        }
    ];

    useEffect(() => {
        const currItem = navItems.findIndex(item => item.page.toLowerCase() === currPath);
        setActiveItem(currPath.length === 0 ? 0 : currItem);
    }, [location]);

    return (
        <div className="navbar" style={{ backgroundColor: 'red', height: '100vh', width: '60px', display: "inline-flex", flexDirection: 'column', alignItems: 'center' }}>
            {navItems.map((item, index) => {
                if (index !== navItems.length - 1) {
                    return (
                        <Link to={item.to} key={index}>
                            <div className={`menu_item_box ${activeItem === index ? 'active' : ''}`}>
                                {activeItem === index ? item.active : item.default}
                            </div>
                        </Link>
                    );
                } else {
                    return (
                        <IconButton onClick={() => authProps.handleClearSession()} key={index}>
                            {item.default}
                        </IconButton>
                    );
                }
            })}
        </div>
    );
}