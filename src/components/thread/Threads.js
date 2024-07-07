import { ForumSharp, NotificationsSharp, InsertLinkSharp } from "@mui/icons-material"
import { IconButton, List, ListItem } from "@mui/material"

export default function Threads({ threads }) {
    const renderThread = () => {

    }
    return (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
            {threads.map((thread, index) => {
                return (
                    <div key={index} style={{ backgroundColor: '#eeeeee', marginBottom: '8px' }}>
                        <small>{thread.author}</small>
                        <p>{thread.content}</p>
                        <div className="subThreadFooter">
                            <List dense={true}>
                                {thread.attachments.map((attachment, index) => (
                                    <ListItem key={index}>
                                        <InsertLinkSharp />
                                        <a href="#" download>
                                            {attachment.name}
                                        </a>
                                    </ListItem>
                                ))}
                            </List>
                        </div>
                        <div className="threadFooter">
                            <IconButton><NotificationsSharp /></IconButton>
                            <IconButton><ForumSharp /></IconButton>
                        </div>
                    </div>
                )
            })}
        </div>
    )
}