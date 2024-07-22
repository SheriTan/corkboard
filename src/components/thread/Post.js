import { useEffect, useState } from 'react';
import { Alert, Button, IconButton, Input, ListItem, TextField } from '@mui/material';
import { InsertCommentSharp, UploadFileSharp, LinkOffSharp } from '@mui/icons-material';
import { FixedSizeList } from 'react-window';
import { InputChecker } from '../../utils/InputChecker';
import { customClientRequest, defaultClientRequest } from '../../utils/AxiosHandler';
import { useLocation } from 'react-router-dom';

export default function Post({ postType, authProps, updateList }) {
    const [uploading, setUploading] = useState(false); // Button State
    const [posting, setPosting] = useState(false); // Button State
    const [uploadFiles, setUploadFiles] = useState([]); // Files in temp
    const [errorMsg, setErrorMsg] = useState({
        upload: '',
        post: ''
    });
    const [postData, setPostData] = useState({
        postID: '',
        parentID: '',
        content: '',
        success: false
    });

    const location = useLocation();

    useEffect(() => {
    }, [uploadFiles, postData])

    const handleFileChange = async (e) => { // On upload file
        e.preventDefault();

        const file = e.target.files[0];
        setUploading(true);

        if (uploadFiles.length === 5) {
            setErrorMsg(prevState => ({
                ...prevState,
                upload: 'You cannot upload more than 5 files.'
            }))
        } else {
            const uploadOutcome = InputChecker("File", file)
            if (uploadOutcome.isInputValid) {
                setErrorMsg(prevState => ({
                    ...prevState,
                    upload: ''
                }));

                try {
                    // Get presigned POST data
                    const response = await defaultClientRequest(
                        'POST',
                        'uploads',
                        {
                            "Authorization": "Bearer " + authProps.jwttoken,
                            "X-Api-Key": authProps.apiKey,
                            "Content-Type": "application/json"
                        },
                        {
                            "type": "temp",
                            "postID": postData.postID,
                            "attachment": {
                                "name": file.name,
                                "contenttype": file.type
                            }
                        }
                    );

                    const { url, fields } = response.data;
                    if (fields.key) {
                        setPostData(prevState => ({
                            ...prevState,
                            postID: fields.key.split('/')[1]
                        }));
                    }
                    // Uploading to S3...
                    if (url !== '' && Object.keys(fields).length !== 0) {
                        const formData = new FormData();
                        Object.entries(fields).forEach(([key, value]) => {
                            formData.append(key, value);
                        });
                        formData.append('file', file);

                        await customClientRequest('POST', url, {
                            'Content-Type': 'multipart/form-data',
                            'Access-Control-Allow-Origin': '*',
                            'Access-Control-Allow-Methods': 'GET,POST',
                        }, formData);

                        setUploadFiles(prevItems => [
                            ...prevItems,
                            {
                                key: fields.key,
                                name: fields.key.split('/')[2]
                            }
                        ]);
                    }
                } catch (error) {
                    console.error('Error uploading file:', error);
                }
            } else {
                setErrorMsg(prevState => ({
                    ...prevState,
                    upload: uploadOutcome.message
                }));
            }
        }
        setUploading(false);
    }

    const handlePost = async (e) => { // On post thread / comment
        e.preventDefault();
        setPosting(true);
        if (postType === 'comment') { // Finding parent ID (thread) from location
            postData.parentID = location.pathname.split('/')[2];
            setPostData(prevState => ({
                ...prevState,
                parentID: location.pathname.split('/')[2]
            }))
        }
        const postOutcome = InputChecker("Content", [postData.content]);

        if (postOutcome.isInputValid) {
            setErrorMsg(prevState => ({
                ...prevState,
                upload: ''
            }));
            try {
                // Posting Thread / Comment...
                const response = await defaultClientRequest(
                    'POST',
                    'uploads',
                    {
                        "Authorization": "Bearer " + authProps.jwttoken,
                        "X-Api-Key": authProps.apiKey,
                        "Content-Type": "application/json"
                    },
                    {
                        ...postData,
                        "type": "post",
                    }
                );

                updateList.setPosts(prevItems => [...prevItems, response.data.posts]);
                if (postType === 'thread') {
                    updateList.setFollows(prevItems => [...prevItems, response.data.follows]);
                }

                setPostData(prevState => ({
                    ...prevState,
                    postID: '',
                    content: '',
                    success: true
                }));

                setUploadFiles([]);

            } catch (error) {
                console.error(`Error posting ${postType}: `, error);
            }
        } else {
            setErrorMsg(prevState => ({
                ...prevState,
                post: postOutcome.message
            }));
        }
        setPosting(false);
    }

    const handleFileDownload = async (index) => {
        const download = document.createElement('a');
        // Get SignedURL of object
        try {
            const response = await defaultClientRequest(
                'GET',
                `uploads?key=${uploadFiles[index].key}`,
                {
                    "Authorization": "Bearer " + authProps.jwttoken,
                    "X-Api-Key": authProps.apiKey,
                    "Content-Type": "application/json"
                }
            );

            download.href = response.signedUrl;
            download.setAttribute('download', uploadFiles[index].name);
            document.body.appendChild(download);
            download.click();
        } catch (error) {
            console.error('Error generating signed url:', error);
        }
    }

    const handleFileRemove = async (index) => {

        // Delete S3 Object
        try {
            setUploadFiles(prevItems => {
                const updatedFiles = [...prevItems];
                updatedFiles.splice(index, 1);
                return updatedFiles;
            });

            await defaultClientRequest(
                'DELETE',
                'uploads',
                {
                    "Authorization": "Bearer " + authProps.jwttoken,
                    "X-Api-Key": authProps.apiKey,
                    "Content-Type": "application/json"
                },
                {
                    key: uploadFiles[index].key
                }
            );
        } catch (error) {
            console.error('Error deleting attachment:', error);
        }
    }

    const handleInputChange = (e) => {
        e.preventDefault();
        const { name, value } = e.target;

        setPostData(prevState => ({
            ...prevState,
            [name]: value
        }));
    }

    const renderRow = ({ index, style }) => (
        <ListItem style={style} key={index}>
            <IconButton onClick={() => handleFileRemove(index)}>
                <LinkOffSharp />
            </IconButton>
            <b className='downloadable' onClick={() => handleFileDownload(index)}>{uploadFiles[index].name}</b>
        </ListItem>
    )

    return (
        <div className='postBox' style={{ display: 'inline-flex', flexDirection: 'column', marginTop:'5px' }}>
            {errorMsg.post !== "" &&
                <Alert severity='error'>{errorMsg.post}</Alert>
            }
            {errorMsg.upload !== "" &&
                <Alert severity='error'>{errorMsg.upload}</Alert>
            }
            {postData.success &&
                <Alert severity='success'>{postType[0].toUpperCase() + postType.slice(1)} posted successfully.</Alert>
            }
            <TextField placeholder={`What's on your mind?`} multiline
                name='content'
                type='text'
                value={postData.content}
                onChange={(e) => handleInputChange(e)}
                rows={3}
                sx={{ width: '100ch' }}
                variant='outlined' />
            <div style={{ display: 'inline-flex' }}>
                <div style={{ padding: '4px 4px 4px 0px' }}>
                    <Button
                    color='info'
                        disabled={posting}
                        onClick={(e) => handlePost(e)}
                        sx={{marginRight: '10px', marginTop: '5px'}}
                        variant='contained' startIcon={<InsertCommentSharp />} disableElevation>
                        {posting ? 'Posting...' : `Post ${postType}`}
                    </Button>
                    <Button
                    color='secondary'
                        disabled={uploading}
                        sx={{marginRight: '10px', marginTop: '5px'}}
                        component='label' variant='contained' startIcon={<UploadFileSharp />} disableElevation>
                        {uploading ? 'Uploading...' : 'Attach Documents'}
                        <Input
                            onChange={(e) => handleFileChange(e)}
                            sx={{ display: 'none' }}
                            type='file'
                            value=''
                        />
                    </Button>
                </div>
                <div>
                    <FixedSizeList
                        height={90}
                        width={'50ch'}
                        itemSize={30}
                        itemCount={uploadFiles.length}
                    >
                        {renderRow}
                    </FixedSizeList>
                </div>

            </div>
        </div>
    )
}