import { useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button, Row, Col } from 'react-bootstrap';
import { Auth } from 'aws-amplify';


const sidebarNavItems = [
    {
        display: 'Home',
        icon: <img className='sidebar__menu__item__icon' src="/Home_Icon.png" />,
        active: <img className='sidebar__menu__item__icon' src="/Home_Icon_Filled.png" />,
        to: '/home',
        section: 'home'
    },
    {
        display: 'My Projects',
        icon: <img className='sidebar__menu__item__icon' src="/My_Projects.png" />,
        active: <img className='sidebar__menu__item__icon' src="/My_Projects_Filled.png" />,
        to: '/myproject',
        section: 'myproject'
    },
    {
        display: 'Shared Projects',
        icon: <img className='sidebar__menu__item__icon' src="/Shared.png" />,
        active: <img className='sidebar__menu__item__icon' src="/Shared_Filled.png" />,
        to: '/shared',
        section: 'shared'
    },
    {
        display: 'Manage Assets',
        icon: <img className='sidebar__menu__item__icon' src="/Assets.png" />,
        active: <img className='sidebar__menu__item__icon' src="/Assets_Filled.png" />,
        to: '/assets',
        section: 'assets'
    },
    {
        display: 'Trash',
        icon: <img className='sidebar__menu__item__icon' src="/Trash.png" />,
        active: <img className='sidebar__menu__item__icon' src="/Trash_Filled.png" />,
        to: '/trash',
        section: 'trash'
    },
    {
        display: 'Account',
        icon: <img className='sidebar__menu__item__icon' src="/TestUser.jpg" />,
        name: "Sue",
        email: 'sue@gmail.com',
        to: '/account',
        section: 'account'
    },
    {
        to: '/signin',
        section: 'signin'
    },
]

const Sidebar = ({authProps}) => {
    const [activeIndex, setActiveIndex] = useState(0);
    const [stepHeight, setStepHeight] = useState(0);
    const sidebarRef = useRef();
    const indicatorRef = useRef();
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        setTimeout(() => {
            const sidebarItem = sidebarRef.current.querySelector('.sidebar__menu__item');
            indicatorRef.current.style.height = `${sidebarItem.clientHeight}px`;
            setStepHeight(sidebarItem.clientHeight);
        }, 50);
    }, []);

    // change active index
    useEffect(() => {
        const curPath = window.location.pathname.split('/')[1];
        const activeItem = sidebarNavItems.findIndex(item => item.section === curPath);
        setActiveIndex(curPath.length === 0 ? 0 : activeItem);
    }, [location]);
    
    const handleSignOut = () => {
        Auth.signOut()
        .then((response) => {
            authProps.setUser(null);
            authProps.setIsAuthenticated(false);
            navigate('/signin');
        })
        .catch((error) => {
            console.log('Error');
            console.log(error);
        });
    }

    return <div className='sidebar'>
        <div className="sidebar__logo">
            <img src="/logo.png" style={{
                width: '14em',
                marginTop: '1.05em'
            }} />
        </div>
        <div ref={sidebarRef} className="sidebar__menu">
            <div
                ref={indicatorRef}
                className="sidebar__menu__indicator"
                style={{
                    transform: `translateX(-50%) translateY(${activeIndex * stepHeight}px)`
                }}
            ></div>
            {
                sidebarNavItems.map((item, index) => (
                    <Link to={item.to} key={index}>
                        {item.display != "Account" ?
                            <div className={`sidebar__menu__item ${activeIndex === index ? 'active' : ''}`}>
                                {(activeIndex == index) ?
                                    <div className="sidebar__menu__item__icon.active">
                                        {item.active}
                                    </div>
                                    :
                                    <div className="sidebar__menu__item__icon">
                                        {item.icon}
                                    </div>
                                }
                                {(item.display != "Account") &&
                                    <div className="sidebar__menu__item__text">
                                        {item.display}
                                    </div>
                                }
                            </div>  
                            :
                            <div className="sidebar__bottom">
                                <div className={`sidebar__user sidebar__menu__item ${activeIndex === index ? 'active' : ''}`}>
                                    <Row style={{ margin: 0 }}>
                                        <Col xs={4}>
                                            {/* <img className="account__userpic" src="/TestUser.jpg" /> */}
                                            <div className="account__userpic__container" style={{ backgroundImage: "url('/TestUser.jpg')", backgroundSize: 'cover', height: '50px', margin: '5px', width: '50px', borderRadius: '50%', textAlign: 'end' }}>
                                            </div>
                                        </Col>
                                        <Col xs={8} style={{ alignSelf: 'center' }}>
                                            <p style={{ margin: 0, fontSize: '16px', fontWeight: '500', color: '#000000' }}>{item.name}</p>
                                            <p style={{ margin: 0, fontSize: '14px', fontWeight: '500', color: '#5F5F5F' }}>{item.email}</p>
                                        </Col>
                                    </Row>
                                </div>
                                <Button onClick={handleSignOut} className="sidebar__logout" ><img className='sidebar__menu__item__icon' src="/Logout.png" />Log Out</Button>
                            </div>
                        }
                    </Link>
                ))
            }
        </div>
    </div >;
};

export default Sidebar;
