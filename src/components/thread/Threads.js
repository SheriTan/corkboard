import { ForumSharp, NotificationsSharp, InsertLinkSharp, QuestionAnswerRounded } from "@mui/icons-material"
import { IconButton, List, ListItem } from "@mui/material"
import { defaultClientRequest } from "../../utils/AxiosHandler";
import { useNavigate } from "react-router-dom";
import datetimeConverter from "../../utils/DatetimeFormat";

export default function Threads({ postType, authProps, updateList }) {
    const navigate = useNavigate();

    const handleFileDownload = async (attachment) => {
        const key = attachment;
        const download = document.createElement('a');
        // Get SignedURL of object
        try {
            const response = await defaultClientRequest(
                'GET',
                `uploads?key=${key}`,
                {
                    "Authorization": "Bearer " + authProps.jwttoken,
                    "X-Api-Key": authProps.apiKey,
                    "Content-Type": "application/json"
                }
            );

            download.href = response.signedUrl;
            download.setAttribute('download', key.split('/')[2]);
            document.body.appendChild(download);
            download.click();
        } catch (error) {
            console.error('Error generating signed url:', error);
        }
    }

    const handleFollowing = async (thread, followed) => {
        if (followed) { // To unfollow thread
            await defaultClientRequest(
                'DELETE',
                'follow',
                {
                    "Authorization": "Bearer " + authProps.jwttoken,
                    "X-Api-Key": authProps.apiKey,
                    "Content-Type": "application/json"
                },
                {
                    threadId: thread.thread
                }
            );
            updateList.setFollows(updateList.follows.filter(follow => follow.thread !== thread.thread));
        } else { // To follow thread
            await defaultClientRequest(
                'POST',
                'follow',
                {
                    "Authorization": "Bearer " + authProps.jwttoken,
                    "X-Api-Key": authProps.apiKey,
                    "Content-Type": "application/json"
                },
                {
                    threadId: thread.thread
                }
            );
            updateList.setFollows([...updateList.follows, { thread: thread.thread }]);
        }
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
            {updateList.posts &&
            updateList.posts.length !== 0 ?
            updateList.posts.map((thread, index) => {
                const isFollowed = updateList.follows?.some(follow => follow.thread === thread.thread);
                return (
                    <div key={index} style={{ backgroundColor: '#eeeeee', marginBottom: '8px', padding: '10px' }}>
                        <small style={{marginRight:'3px'}}>{thread.userDetails.name}</small>
                        <small style={{marginRight:'3px'}}>&#8226;</small>
                        <small style={{marginRight:'3px'}}>{thread.userDetails.role}</small>
                        <small style={{marginRight:'3px'}}>&#8226;</small>
                        <small>{datetimeConverter(thread.created_dt)}</small>
                        <p>{thread.content}</p>
                        <div className="subThreadFooter">
                            <List dense={true}>
                                {thread.attachments.map((attachment, index) => (
                                    <ListItem key={index}>
                                        <InsertLinkSharp fontSize="small" />
                                        <b style={{marginLeft: '5px'}} className='downloadable' onClick={() => handleFileDownload(attachment)}>
                                            {attachment.split('/')[2]}
                                        </b>
                                    </ListItem>
                                ))}
                            </List>
                        </div>
                        {
                            postType === 'thread' &&
                            <div className="threadFooter">
                                <IconButton onClick={() => handleFollowing(thread, isFollowed)}><NotificationsSharp color={isFollowed ? "primary" : 'inherit'} /></IconButton>
                                <IconButton onClick={() => navigate(`/thread/${thread.thread}`)}><ForumSharp /></IconButton>
                            </div>
                        }
                    </div>
                )
            })
        :
        <div style={{textAlign: 'center', color: '#adadad'}}>
            <QuestionAnswerRounded fontSize="large" />
        <h4>Nothing has been posted yet.</h4>
        </div>
        }
        </div>
    )
}