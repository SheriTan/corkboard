import { useEffect, useRef, useState } from 'react';
import { Button, TextField, FormControl, Input, InputAdornment, IconButton, InputLabel, FormHelperText, Alert } from '@mui/material';
import { InputChecker } from '../../utils/InputChecker';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { userResetPassword } from '../../utils/AmplifyHandler';
import { defaultClientRequest } from '../../utils/AxiosHandler';
import { deleteUser } from 'aws-amplify/auth';

const Profile = ({ authProps }) => {
    const mounted = useRef();
    const [userDetails, setUserDetails] = useState({
        fName: '',
        lName: '',
        role: '',
        email: '',
        password: '',
        newPassword: '',
        saveChanges: false
    });
    const [showPassword, setShowPassword] = useState({
        old: false,
        new: false
    }); // Password Visibility

    const [validationOutcome, setValidationOutcome] = useState({
        fName: {}, // Later implementation
        lName: {}, // Later implementation
        newPassword: {}
    });
    const [displayMessage, setDisplayMessage] = useState({
        error: '',
        success: ''
    }); // Alert Message

    const [deletion, setDeletion] = useState(false); // Button State
    const [saving, setSaving] = useState(false); // Button State

    useEffect(() => {
        setValidationOutcome({
            fName: InputChecker("First Name", [userDetails.fName]), // Later implementation
            lName: InputChecker("Last Name", [userDetails.lName]), // Later implementation
            newPassword: InputChecker("Password", [userDetails.new])
        });

        if (!mounted.current) {
            let readFName = authProps.idtoken.payload.name.split(" ")[0];
            let readLName = authProps.idtoken.payload.name.split(" ")[1];
            setUserDetails(prevState => ({
                ...prevState,
                fName: readFName,
                lName: readLName || '',
                role: authProps.idtoken.payload['custom:role'],
                email: authProps.idtoken.payload.email
            }));
            mounted.current = true;
        }
    }, [userDetails]);

    const handleSaveChanges = async (e) => { // On click Save Changes
        e.preventDefault();
        setSaving(true);
        setUserDetails(prevState => ({ ...prevState, saveChanges: true }));
        if (validationOutcome.newPassword) {
            const response = await userResetPassword([userDetails.password, userDetails.newPassword], authProps.authenticated);
            if (response.success) {
                setDisplayMessage(prevState => ({
                    ...prevState,
                    error: '',
                    success: 'Your changes were saved successfully.'
                }))
                setUserDetails(prevState => ({ ...prevState, saveChanges: false }));
            } else {
                setDisplayMessage(prevState => ({
                    ...prevState,
                    error: response.message,
                    success: ''
                }))
            }
        }
        setSaving(false);
    }

    const handleAccountDeletion = async (e) => { // On click Confirm Delete
        e.preventDefault();
        setDeletion(true);
        try {
            await defaultClientRequest(
                'DELETE',
                'uploads',
                {
                    "Authorization": "Bearer " + authProps.jwttoken,
                    "X-Api-Key": authProps.apiKey,
                    "Content-Type": "application/json"
                },
                {
                    key: ''
                }
            );
            await deleteUser();
            authProps.handleClearSession();
        } catch (error) {
            console.error('Error deleting account:', error);
        }
        setDeletion(false);
    }

    const handleInputChange = (e) => { // On text input change
        e.preventDefault();
        const { name, value } = e.target;
        setUserDetails(prevState => ({
            ...prevState,
            [name]: value
        }));
    }

    const handleClickShowPassword = (type) => { // On click visbility icon
        setShowPassword((prevState) => ({
            ...prevState,
            [type]: !prevState[type]
        }));
    }

    const handleClear = () => { // On click Cancel
        setUserDetails(prevState => ({
            ...prevState,
            password: '',
            newPassword: '',
            saveChanges: false
        }));

        setDisplayMessage(prevState => ({
            ...prevState,
            error: '',
            success: ''
        }));
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
            <h2>Displayed Profile</h2>
            <b style={{marginBottom: '10px'}}>Name: {userDetails.fName} {userDetails.lName}</b>
            <b style={{marginBottom: '10px'}}>Role: {userDetails.role}</b>
            <b style={{marginBottom: '10px'}}>Email: {userDetails.email}</b>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
                {(displayMessage.error !== '' || displayMessage.success !== '') &&
                    <Alert severity={displayMessage.error !== '' ? 'error' : displayMessage.success !== '' && 'success'}>{displayMessage.error !== '' ? displayMessage.error : displayMessage.success !== '' && displayMessage.success}</Alert>
                }
                <FormControl required variant='standard'>
                    <InputLabel>Current Password</InputLabel>
                    <Input
                        name='password'
                        type={showPassword.old ? 'text' : 'password'}
                        onChange={(e) => handleInputChange(e)}
                        value={userDetails.password}
                        endAdornment={
                            <InputAdornment position="end">
                                <IconButton
                                    onClick={() => handleClickShowPassword('old')}>
                                    {showPassword.old ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                            </InputAdornment>
                        } />
                </FormControl>
                <FormControl required error={userDetails.saveChanges && !validationOutcome.newPassword.isInputValid} variant='standard'>
                    <InputLabel>New Password</InputLabel>
                    <Input
                        name='newPassword'
                        type={showPassword.new ? 'text' : 'password'}
                        onChange={(e) => handleInputChange(e)}
                        value={userDetails.newPassword}
                        endAdornment={
                            <InputAdornment position="end">
                                <IconButton
                                    onClick={() => handleClickShowPassword('new')}>
                                    {showPassword.new ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                            </InputAdornment>
                        } />
                    <FormHelperText>{userDetails.saveChanges && validationOutcome.newPassword.message}</FormHelperText>
                </FormControl>
            </div>
            <div style={{marginTop: '10px'}}>
                <Button sx={{marginRight: '5px'}} onClick={handleClear} variant='outlined' color='info'>Cancel</Button>
                <Button sx={{marginLeft: '5px'}} disabled={saving} onClick={(e) => handleSaveChanges(e)} variant='outlined' color='warning' disableElevation>
                    {saving ? "Saving..." : "Save Changes"}
                </Button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
                <h3>Delete Account</h3>
                <span>Note that this action is permanent and Corkboard will remove all posts and files uploaded by you.</span>
                <Button color='error' variant='contained' disableElevation
                sx={{maxWidth: '180px', marginTop: '10px'}}
                    disabled={deletion}
                    onClick={(e) => handleAccountDeletion(e)}
                >{deletion ? "Deleting Account..." : "Confirm Delete"}</Button>
            </div>
        </div>
    )
};

export default Profile;