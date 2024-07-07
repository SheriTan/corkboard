import { useEffect } from 'react';
import Post from '../thread/Post';
import Threads from '../thread/Threads';

const Home = ({ authProps }) => {
    useEffect(() => {
        // console.log(authProps)
        // console.log('Home')
    }, [])

    const sample = [
        { name: 'Hello' },
        { name: 'Nice' },
        { name: 'To' },
        { name: 'Meet' },
        { name: 'You' },
        { name: 'Hii' }
    ]

    const samplethreads = [
        {
            author: 'Somebody',
            content: 'hellooooooooo one and all',
            follow: ['user1', 'user2'],
            attachments: [
                { name: 'Hello' },
                { name: 'Nice' }
            ]
        },
        {
            author: 'Somebody',
            content: 'hellooooooooo one and all',
            follow: ['user1', 'user2'],
            attachments: [
                { name: 'Hello' },
                { name: 'Nice' }
            ]
        },
        {
            author: 'Somebody',
            content: 'hellooooooooo one and all',
            follow: ['user1', 'user2'],
            attachments: [
                { name: 'Hello' },
                { name: 'Nice' }
            ]
        }
    ]


    return (
        <>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
                <h1>Hello {authProps.idtoken.payload.name}</h1>
                <h2>Global Threads</h2>
                <Post postType='thread' uploads={sample} />
                <Threads threads={samplethreads} />
            </div>
        </>
    )
};

export default Home;