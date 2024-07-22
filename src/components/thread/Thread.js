import { useEffect, useRef, useState } from 'react';
import Post from '../thread/Post';
import Threads from '../thread/Threads';
import { defaultClientRequest } from '../../utils/AxiosHandler';
import { useLocation, useNavigate } from 'react-router-dom';

const Thread = ({ authProps }) => {
    const mounted = useRef();
    const location = useLocation();
    const navigate = useNavigate();

    const [thread, setThread] = useState([]);
    const [posts, setPosts] = useState([]);

    const handleRetrievePosts = async (id) => {
        try {
            const response = await defaultClientRequest(
                'GET',
                `threads/discussion?thread=${id}`,
                {
                    "Authorization": "Bearer " + authProps.jwttoken,
                    "X-Api-Key": authProps.apiKey,
                    "Content-Type": "application/json"
                }
            );

            if (response.length !== 0) {
                const commentsData = response?.filter(data => data.SK.startsWith('COMMENT#'));
                const threadData = response?.filter(data => data.SK.startsWith('THREAD#'));
                setPosts(commentsData);
                setThread(threadData);
            }
        } catch (error) {
            console.error('Error retrieving discussion:', error);
        }
    }

    let updateThread = {
        posts: thread,
        setPosts: setThread
    }
    let updateList = {
        posts, setPosts
    }
    
    useEffect(() => {
        if (!mounted.current) {
            handleRetrievePosts(location.pathname.split('/')[2]);
            mounted.current = true;
        }
    }, [thread, posts])


    return (
        <>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
                <b className='clickable' onClick={() => navigate(-1)}>Go Back</b>
                <Threads postType='comment' authProps={authProps} updateList={updateThread} />
                <h3>Comment ({posts.length})</h3>
                <div style={{ maxHeight: '180px', overflowY: 'scroll' }}>
                    <Threads postType='comment' authProps={authProps} updateList={updateList}/>
                </div>
                <Post postType='comment' authProps={authProps} updateList={updateList}/>
            </div>
        </>
    )
};

export default Thread;