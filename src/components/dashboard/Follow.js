import { useEffect, useRef, useState } from 'react';
import { defaultClientRequest } from '../../utils/AxiosHandler';
import Threads from '../thread/Threads';

const Follow = ({ authProps }) => {
    const mounted = useRef();

    const [posts, setPosts] = useState([]);
    const [follows, setFollows] = useState([]);

    const handleRetrievePosts = async () => {
        try {
            const response = await defaultClientRequest(
                'GET',
                'follow',
                {
                    "Authorization": "Bearer " + authProps.jwttoken,
                    "X-Api-Key": authProps.apiKey,
                    "Content-Type": "application/json"
                }
            );

            (response.data).sort((a, b) => b.created_dt - a.created_dt);
            setPosts(response.data);
            (response.data).map(thread => {
                setFollows(prevItems => [...prevItems, {thread: thread.thread}])
            })
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
    }, [posts])

    return (
        <>
            <div style={{ display: 'flex', flexDirection: 'column', minWidth: '902px' }}>
                <h2>Followed Threads</h2>
                <Threads postType='thread' authProps={authProps} updateList={updateList} />
            </div>
        </>
    )
};

export default Follow;