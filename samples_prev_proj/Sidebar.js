import React, { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Poly from '../components/works/Poly';

const Sidebar = ({ items }) => {
    const location = useLocation();
    const currPath = location.pathname.split('/')[1];
    const pages = items.pages;

    useEffect(() => {
        pages.forEach((page) => {
            if (page.url.includes(currPath) && currPath.includes('project')) {
                page.subsection.forEach((category) => {
                    if (category.active) {
                        items.setSubHeading(category.section);
                        switch (category.section) {
                            case 'Polytechnic': items.setProjects(Poly);
                                break;
                            default: {
                                page.subsection.forEach((ref, index) => {
                                    if (index === 0) {
                                        ref.active = true;
                                    } else {
                                        ref.active = false;
                                    }
                                })
                            }
                        }
                    }
                })
            }
        })
    }, [location])

    return (
        <div className='navbar'>
            <img className='logo' src='/Logo.png' />
            {pages.map((page, index) => (
                <Link to={page.to} key={index}>
                    <div className={`nav_item ${(page.url === currPath || page.url.includes(currPath) && currPath.includes('project')) && 'active primary'}`}>
                        <span>{page.name}</span>
                    </div>
                    {(page.url.includes(currPath) && currPath.includes('project')) &&
                        page.subsection.map((category, subindex) => (
                            <div key={subindex} className={`nav_item ${category.active && 'active secondary'}`}>
                                <span>{category.section}</span>
                            </div>
                        ))
                    }
                </Link>
            ))}
        </div>
    );
}

export default Sidebar;