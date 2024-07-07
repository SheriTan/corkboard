import { Button, IconButton, Input, ListItem, ListItemText, TextField } from '@mui/material';
import { InsertCommentSharp, UploadFileSharp, LinkOffSharp } from '@mui/icons-material';
import { FixedSizeList } from 'react-window';

export default function Post({postType, uploads}) {
    const renderRow = ({ index, style }) => (
        <ListItem style={style} key={index}>
            <IconButton>
                <LinkOffSharp />
            </IconButton>
            <ListItemText primary={uploads[index].name} />
        </ListItem>
    )

    return (
        <div className='postBox' style={{ display: 'inline-flex', flexDirection: 'column' }}>
            <TextField placeholder={`What's on your mind?`} multiline
                rows={3}
                sx={{ width: '100ch' }}
                variant='outlined' />
            <div style={{ display: 'inline-flex' }}>
                <div style={{ padding: '4px 4px 4px 0px' }}>
                    <Button variant='contained' startIcon={<InsertCommentSharp />} disableElevation>
                        Post {postType}
                    </Button>
                    <Button component='label' variant='contained' startIcon={<UploadFileSharp />} disableElevation>
                        Attach Documents
                        <Input sx={{
                            clip: 'rect(0 0 0 0)',
                            clipPath: 'inset(50%)',
                            height: 1,
                            overflow: 'hidden',
                            position: 'absolute',
                            bottom: 0,
                            left: 0,
                            whiteSpace: 'nowrap',
                            width: 1,
                        }}
                            type='file' />
                    </Button>
                </div>
                <div>
                    <FixedSizeList
                        height={90}
                        width={'32ch'}
                        itemSize={30}
                        itemCount={uploads.length}
                    >
                        {renderRow}
                    </FixedSizeList>
                </div>

            </div>
        </div>
    )
}