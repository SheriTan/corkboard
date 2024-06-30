import React, { useState, useEffect } from 'react';
import { Button, TextField, FormControl, Input, InputAdornment, IconButton, InputLabel, FormHelperText, FormControlLabel, Checkbox } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import InvalidPage from '../utils/InvalidPage';


const Landing = () => {
    const navigate = useNavigate();
    // 1 : Registration / Login
    // 2 : Confirmation
    // 3 : MFA Setup / Verification
    // 4 : Profile Setup
    // 5 : Forgot Password
    const [step, setStep] = useState(1);

    // Toggle Password Visbility
    const [showPassword, setShowPassword] = useState({
        register: false,
        confirm: false,
        login: false,
        reset: false,
        resetConfirm: false
    });

    // Register Form
    const [registerField, setRegisterField] = useState({
        email: '',
        password: '',
        confirmPassword: '',
        code: '',
        firstName: '',
        lastName: '',
        role: '',
        isSubmitted: false,
        isCodeSubmitted: false,
        errorMsg: ''
    });

    // Login Form
    const [loginField, setLoginField] = useState({
        email: '',
        password: '',
        code: '',
        isSubmitted: false,
        isCodeSubmitted: false,
        errorMsg: ''
    });

    // Forgot Password Form
    const [forgotField, setForgotField] = useState({
        email: '',
        code: '',
        password: '',
        confirmPassword: '',
        isEmailSubmitted: false,
        isCodeSubmitted: false,
        isSubmitted: false,
        errorMsg: ''
    })

    // Invalid Input Messages
    const [validationOutcome, setValidationOutcome] = useState({
        reg_email: {},
        reg_password: {},
        log_email: {},
        log_password: {},
        fgt_email: {},
        fgt_password: {}
    })

    // Change input fields
    const handleInputChange = (type, e) => {
        e.preventDefault();
        const { name, value } = e.target;

        if (type === 'register') {
            setRegisterField((prevState) => ({
                ...prevState,
                [name]: value
            }))
        } else if (type === 'login') {
            setLoginField((prevState) => ({
                ...prevState,
                [name]: value
            }))
        } else if (type === 'forgot') {
            setForgotField((prevState) => ({
                ...prevState,
                [name]: value
            }))
        }
    }

    // Step 1: Registration
    const handleRegister = (e) => {
        e.preventDefault();

        // Clear Login Field
        setLoginField({
            email: '',
            password: '',
            errorMsg: '',
            isSubmitted: false
        });

        console.log(registerField);

        setRegisterField((prevState) => ({
            ...prevState,
            isSubmitted: true
        }))
        // Go to Account Confirmation
        handleLandingNav('confirmation');
    }

    // Step 1: Login
    const handleLogin = (e) => {
        e.preventDefault();

        // Clear Register Field
        setRegisterField({
            email: '',
            password: '',
            role: '',
            confirmPassword: '',
            errorMsg: '',
            isSubmitted: false
        });

        console.log(loginField)

        setLoginField((prevState) => ({
            ...prevState,
            isSubmitted: true
        }))
        // Go to Verify MFA
        handleLandingNav('mfa');
    }

    // Step 2: Confirmation
    const handleConfirmation = (type, e) => {
        e.preventDefault();
        if (type === 'register') { // [1] Account Confirmation
            const { email, code } = registerField;

            // Go to Setup MFA
            handleLandingNav('mfa');

        } else if (type === 'forgot') { // [5] Email Confirmation
            const { email, code } = forgotField;

            // Enable page to update to Reset Password
            setForgotField((prevState) => ({
                ...prevState,
                isCodeSubmitted: true
            }));

            // Go to Forgot Password
            handleLandingNav('forgot');
        }
    }

    const handleResendCode = (e) => {
        
    }

    // Step 3: MFA Setup / Verification
    const handleMFA = (type, e) => {
        e.preventDefault();

        if (type === 'setup') {
            // Go to Setup Profile
            handleLandingNav('profile');
        } else if (type === 'verify') {
            // Navigate to Home Page
            navigate('/home');
        }
    }

    // Step 4: Profile Setup
    const handleProfileSetup = (e, type) => {
        e.preventDefault();

        if (type === 'confirm'){

        }

        // Login Action
        setLoginField({
            email: registerField.email,
            password: registerField.password,
            isSubmitted: true
        });

        // Clear Register Field
        setRegisterField({
            email: '',
            password: '',
            role: '',
            confirmPassword: '',
            errorMsg: '',
            isSubmitted: false
        });

        handleLandingNav('mfa');
    }

    // Step 5: Forgot Password
    const handleForgotPassword = (e) => {
        e.preventDefault();
        const { isCodeSubmitted } = forgotField;

        // Reset Password Page
        if (isCodeSubmitted) {
            setForgotField((prevState) => ({
                ...prevState,
                isSubmitted: true
            }));
            // Go to Verify MFA
            handleLandingNav('mfa');
        }
        // Verify Email Page
        else {
            setForgotField((prevState) => ({
                ...prevState,
                isEmailSubmitted: true
            }));
            // Go to Email Confirmation
            handleLandingNav('confirmation');
        }
    }

    // Password Visibility Toggling
    const handleClickShowPassword = (type) => {
        setShowPassword((prevState) => ({
            ...prevState,
            [type]: !prevState[type]
        }));
    }

    // Checks if register / login / forgot has been submitted and if any error message returned
    const handleValidationError = (obj) => {
        return Object.keys(obj).length !== 0 && (registerField.isSubmitted || loginField.isSubmitted || forgotField.isSubmitted);
    }

    // Register Form: Select Role (Staff, Student)
    const handleRoleSetting = (e) => {
        e.preventDefault();
        const { name } = e.target;

        setRegisterField((prevState) => ({
            ...prevState,
            role: name
        }))
    }

    // Page updates
    const handleLandingNav = (action) => {
        switch (action) {
            case 'confirmation':
                setStep(2);
                break;
            case 'mfa':
                setStep(3);
                break;
            case 'profile':
                setStep(4);
                break;
            case 'forgot':
                setStep(5);
                break;
            default:
                setStep(1);
        }
    }

    useEffect(() => {
    }, [])


    return (
        <>
            {step === 1 ?
                <>
                    <div className='header'>
                        <h2>Welcome to <span style={{ color: 'blue' }}>Corkboard</span>!</h2>
                        <span>Fill up the form below to get started with registration</span>
                    </div>
                    <div className='roleSelect' style={{ display: 'flex', flexDirection: 'column' }}>
                        <span>Choose to register as either <span style={{ fontWeight: 600 }}>Staff</span> or <span style={{ fontWeight: 600 }}>Student</span>:</span>
                        <div className='roleButtons'>
                            <Button variant={registerField.role === 'staff' ? 'contained' : 'outlined'} disableElevation
                                name='staff'
                                onClick={(e) => handleRoleSetting(e)}>Staff</Button>
                            <Button variant={registerField.role === 'student' ? 'contained' : 'outlined'} disableElevation
                                name='student'
                                onClick={(e) => handleRoleSetting(e)}>Student</Button>
                        </div>
                    </div>
                    <div className='registerBox' style={{ display: 'flex', flexFlow: 'column' }}>
                        <TextField required
                            label='Email address'
                            name='email'
                            type='email'
                            value={registerField.email}
                            onChange={(e) => handleInputChange('register', e)}
                            error={handleValidationError(validationOutcome.reg_email)}
                            helperText={validationOutcome.reg_email.message}
                            variant='standard' />
                        <FormControl required error={handleValidationError(validationOutcome.reg_password)} variant='standard'>
                            <InputLabel>Password</InputLabel>
                            <Input
                                name='password'
                                type={showPassword.register ? 'text' : 'password'}
                                onChange={(e) => handleInputChange('register', e)}
                                value={registerField.password}
                                endAdornment={
                                    <InputAdornment position="end">
                                        <IconButton
                                            onClick={() => handleClickShowPassword('register')}>
                                            {showPassword.register ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                } />
                            <FormHelperText>{validationOutcome.reg_password.message}</FormHelperText>
                        </FormControl>
                        <FormControl required error={handleValidationError(validationOutcome.reg_password)} variant='standard'>
                            <InputLabel>Confirm password</InputLabel>
                            <Input
                                name='confirmPassword'
                                type={showPassword.confirm ? 'text' : 'password'}
                                onChange={(e) => handleInputChange('register', e)}
                                value={registerField.confirmPassword}
                                endAdornment={
                                    <InputAdornment position="end">
                                        <IconButton
                                            onClick={() => handleClickShowPassword('confirm')}>
                                            {showPassword.confirm ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                } />
                            <FormHelperText>{validationOutcome.reg_password.message}</FormHelperText>
                        </FormControl>
                        <Button type='submit' onClick={(e) => handleRegister(e)} variant='outlined'>Register</Button>
                    </div>
                    <hr />
                    <div className='loginBox' style={{ display: 'flex', flexDirection: 'column' }}>
                        <h3>Have an account already?</h3>
                        <TextField required
                            label='Email address'
                            name='email'
                            type='email'
                            onChange={(e) => handleInputChange('login', e)}
                            value={loginField.email}
                            error={handleValidationError(validationOutcome.log_email)}
                            helperText={validationOutcome.log_email.message}
                            variant='standard' />
                        <FormControl required error={handleValidationError(validationOutcome.log_password)} variant='standard'>
                            <InputLabel>Password</InputLabel>
                            <Input
                                name='password'
                                type={showPassword.login ? 'text' : 'password'}
                                onChange={(e) => handleInputChange('login', e)}
                                value={loginField.password}
                                endAdornment={
                                    <InputAdornment position="end">
                                        <IconButton
                                            onClick={() => handleClickShowPassword('login')}>
                                            {showPassword.login ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                } />
                            <FormHelperText>{validationOutcome.log_password.message}</FormHelperText>
                        </FormControl>
                        <span onClick={() => handleLandingNav('forgot')}>Forgot Password?</span>
                        <Button type='submit' onClick={(e) => handleLogin(e)} variant='outlined'>Login</Button>
                    </div>
                </>
                : step === 2 && (registerField.isSubmitted || forgotField.isEmailSubmitted) ?
                    <>
                        <div className='header' style={{ display: 'flex', flexDirection: 'column' }}>
                            <h2>We Emailed You</h2>
                            <span>Your code is on the way. It may take a minute to arrive.</span>
                            <span>{registerField.isSubmitted ? <span>To register your account,</span> : forgotField.isEmailSubmitted && <span>To reset your password,</span>} enter the code we emailed to {registerField.isSubmitted ? registerField.email : forgotField.isEmailSubmitted && forgotField.email}.</span>
                        </div>
                        <div className='confirmationBox' style={{ display: 'flex', flexDirection: 'column' }}>
                            <TextField required
                                label='Confirmation Code'
                                name='code'
                                type='text'
                                onChange={(e) => handleInputChange('register', e)}
                                value={registerField.isSubmitted ? registerField.code : forgotField.isEmailSubmitted && forgotField.code}
                                //error={handleValidationError(validationOutcome.log_email)}
                                // helperText={validationOutcome.log_email.message}
                                variant='standard' />

                            <Button variant='outlined'
                                type='submit'
                                onClick={(e) => {
                                    registerField.isSubmitted ?
                                        handleConfirmation('register', e)
                                        : forgotField.isEmailSubmitted &&
                                        handleConfirmation('forgot', e)
                                }}
                            >
                                Confirm
                            </Button>
                            <Button type='submit' variant='text'
                            >
                                Resend Code
                            </Button>
                        </div>
                    </>
                    : step === 3 && (registerField.isSubmitted || loginField.isSubmitted || forgotField.isSubmitted) ?
                        <>
                            {
                                (registerField.isSubmitted && !(loginField.isSubmitted || forgotField.isSubmitted)) ?
                                    <>
                                        <div className='header' style={{ display: 'flex', flexDirection: 'column' }}>
                                            <h2>Setup TOTP MFA</h2>
                                            <span>Scan this QR code with your TOTP app (e.g. Google Authenticator, Authy):</span>
                                        </div>
                                        <div className='mfaBox' style={{ display: 'flex', flexDirection: 'column' }}>
                                            <img src={registerField.qrCodeURL} alt="QR Code" />
                                            <TextField required
                                                label='TOTP Code'
                                                name='code'
                                                type='text'
                                                onChange={(e) => handleInputChange('register', e)}
                                                value={registerField.code}
                                                //error={handleValidationError(validationOutcome.log_email)}
                                                // helperText={validationOutcome.log_email.message}
                                                variant='standard' />
                                            <Button type='submit' variant='outlined'
                                                onClick={(e) => handleMFA('setup', e)}>
                                                Setup
                                            </Button>
                                        </div>
                                    </>
                                    :
                                    ((loginField.isSubmitted || forgotField.isSubmitted) && !registerField.isSubmitted) ?
                                        <>
                                            <div className='header' style={{ display: 'flex', flexDirection: 'column' }}>
                                                <h2>Verify TOTP MFA</h2>
                                                <span>Enter the code from your TOTP app (e.g. Google Authenticator, Authy).</span>
                                            </div>
                                            <div className='mfaBox' style={{ display: 'flex', flexDirection: 'column' }}>
                                                <TextField required
                                                    label='TOTP Code'
                                                    name='code'
                                                    type='text'
                                                    onChange={(e) => {
                                                        if (loginField.isSubmitted) {
                                                            handleInputChange('login', e)
                                                        } else if (forgotField.isSubmitted) {
                                                            handleInputChange('forgot', e)
                                                        }
                                                    }}
                                                    value={loginField.isSubmitted ? loginField.code : forgotField.isSubmitted && forgotField.code}
                                                    //error={handleValidationError(validationOutcome.log_email)}
                                                    // helperText={validationOutcome.log_email.message}
                                                    variant='standard' />
                                                <Button type='submit' variant='outlined'
                                                    onClick={(e) => handleMFA('verify', e)}>
                                                    Verify
                                                </Button>
                                            </div>
                                        </>
                                        :
                                        <InvalidPage />
                            }


                        </>
                        : step === 4 ?
                            <>
                                <div className='header' style={{ display: 'flex', flexDirection: 'column' }}>
                                    <h2>(Optional) Setup Profile</h2>
                                    <span>You can update these details later.</span>
                                </div>
                                <div className='profileBox' style={{ display: 'flex', flexDirection: 'column' }}>
                                    <div className='nameInputs'>
                                        <TextField required
                                            label='First name'
                                            name='firstName'
                                            type='text'
                                            value={registerField.firstName}
                                            onChange={(e) => handleInputChange('register', e)}
                                            // error={handleValidationError(validationOutcome.reg_email)}
                                            // helperText={validationOutcome.reg_email.message}
                                            variant='standard' />
                                        <TextField
                                            label='Last name'
                                            name='lastName'
                                            type='text'
                                            value={registerField.lastName}
                                            onChange={(e) => handleInputChange('register', e)}
                                            // error={handleValidationError(validationOutcome.reg_email)}
                                            // helperText={validationOutcome.reg_email.message}
                                            variant='standard' />
                                    </div>
                                    <div className='displayName' style={{ display: 'flex', flexDirection: 'column' }}>
                                        <span style={{ fontWeight: 600, fontSize: 18 }}>Displayed Name</span>
                                        <span>{registerField.firstName} {registerField.lastName}</span>
                                    </div>
                                    <FormControlLabel control={<Checkbox defaultChecked />} label="Enable Notifications" />
                                    <Button variant='outlined'
                                        type='submit'
                                        onClick={(e)=> handleProfileSetup(e, 'confirm')}
                                    >
                                        Confirm
                                    </Button>
                                    <Button type='submit' variant='text'
                                    onClick={(e)=>handleProfileSetup(e)}
                                    >
                                        Skip
                                    </Button>
                                </div>
                            </>
                            : step === 5 ?
                                <>
                                    <div className='header' style={{ display: 'flex', flexDirection: 'column' }}>
                                        <h2>{!forgotField.isCodeSubmitted ? <span>Forgot Password?</span> : <span>Reset Password</span>}</h2>
                                        {!forgotField.isCodeSubmitted &&
                                            <span>No worries! Please enter the email address associated with your account.</span>
                                        }
                                    </div>
                                    <div className='forgotBox' style={{ display: 'flex', flexDirection: 'column' }}>
                                        {!forgotField.isCodeSubmitted ?
                                            <>
                                                <TextField required
                                                    label='Email address'
                                                    name='email'
                                                    type='email'
                                                    value={forgotField.email}
                                                    onChange={(e) => handleInputChange('forgot', e)}
                                                    // error={handleValidationError(validationOutcome.reg_email)}
                                                    // helperText={validationOutcome.reg_email.message}
                                                    variant='standard' />
                                                <Button variant='outlined' type='submit'
                                                    onClick={(e) => handleForgotPassword(e)}
                                                >
                                                    Confirm
                                                </Button>
                                            </>
                                            :
                                            <>
                                                <FormControl required error={handleValidationError(validationOutcome.reg_password)} variant='standard'>
                                                    <InputLabel>New Password</InputLabel>
                                                    <Input
                                                        name='password'
                                                        type={showPassword.reset ? 'text' : 'password'}
                                                        onChange={(e) => handleInputChange('forgot', e)}
                                                        value={forgotField.password}
                                                        endAdornment={
                                                            <InputAdornment position="end">
                                                                <IconButton
                                                                    onClick={() => handleClickShowPassword('reset')}>
                                                                    {showPassword.reset ? <VisibilityOff /> : <Visibility />}
                                                                </IconButton>
                                                            </InputAdornment>
                                                        } />
                                                    <FormHelperText>{validationOutcome.reg_password.message}</FormHelperText>
                                                </FormControl>
                                                <FormControl required error={handleValidationError(validationOutcome.reg_password)} variant='standard'>
                                                    <InputLabel>Confirm password</InputLabel>
                                                    <Input
                                                        name='confirmPassword'
                                                        type={showPassword.resetConfirm ? 'text' : 'password'}
                                                        onChange={(e) => handleInputChange('forgot', e)}
                                                        value={forgotField.confirmPassword}
                                                        endAdornment={
                                                            <InputAdornment position="end">
                                                                <IconButton
                                                                    onClick={() => handleClickShowPassword('resetConfirm')}>
                                                                    {showPassword.resetConfirm ? <VisibilityOff /> : <Visibility />}
                                                                </IconButton>
                                                            </InputAdornment>
                                                        } />
                                                    <FormHelperText>{validationOutcome.reg_password.message}</FormHelperText>
                                                </FormControl>
                                                <Button variant='outlined' type='submit'
                                                    onClick={(e) => handleForgotPassword(e)}
                                                >
                                                    Reset
                                                </Button>
                                            </>
                                        }
                                    </div>
                                </>
                                :
                                <InvalidPage />
            }
        </>
    )
}

export default Landing;