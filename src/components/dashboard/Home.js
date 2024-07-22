import { useEffect, useRef, useState } from 'react';
import Post from '../thread/Post';
import Threads from '../thread/Threads';
import { defaultClientRequest } from '../../utils/AxiosHandler';

const Home = ({ authProps }) => {
    const mounted = useRef();
    const [posts, setPosts] = useState([]); // Threads retrieved
    const [follows, setFollows] = useState([]) // Threads followed by user

    const handleRetrievePosts = async () => {
        try { // Get all threads
            const response = await defaultClientRequest(
                'GET',
                'threads',
                {
                    "Authorization": "Bearer " + authProps.jwttoken,
                    "X-Api-Key": authProps.apiKey,
                    "Content-Type": "application/json"
                }
            );

            const threads = response.threads || [];
            const follows = response.follows || [];

            // Filter threads to include only those that are followed
            const followingThreads = threads.filter(thread =>
                follows.some(follow => follow.thread === thread.thread)
            );

            setPosts(threads);
            setFollows(followingThreads);
        } catch (error) {
            console.error('Error retrieving discussion:', error);
        }
    }

    let updateList = {
        posts, setPosts,
        follows, setFollows
    }

    useEffect(() => {
        if (!mounted.current) {
            handleRetrievePosts();
            mounted.current = true;
        }

    }, [posts, follows])

    return (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
            <h1>Hello <span style={{ color: '#2196f3' }}>{authProps.idtoken.payload.name}</span></h1>
            <h2>Global Threads</h2>
            <Post postType='thread' authProps={authProps} updateList={updateList} />
            <Threads postType='thread' authProps={authProps} updateList={updateList} />
        </div>
    )
};

export default Home;