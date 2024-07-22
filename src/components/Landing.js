import React, { useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Button, TextField, FormControl, Input, InputAdornment, IconButton, InputLabel, FormHelperText, Alert } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { InputChecker } from '../utils/InputChecker';
import { resendCode, userResetPassword, userResetPasswordConfirmation, userSignIn, userSignInConfirmation, userSignUp, userSignUpConfirmation } from '../utils/AmplifyHandler';
import InvalidPage from '../utils/InvalidPage';

const Landing = ({ authProps }) => {
    // 1 : Registration / Login
    // 2 : Confirmation
    // 3 : TOTP Setup / Verification
    // 4 : Forgot Password
    const [step, setStep] = useState(1);

    // Toggle Password Visbility
    const [showPassword, setShowPassword] = useState({
        register: false,
        registerConfirm: false,
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
        role: '',
        isFormSubmitted: false,
        isCodeSubmitted: false
    });

    // Login Form
    const [loginField, setLoginField] = useState({
        email: '',
        password: '',
        code: '',
        nextStep: '',
        setupURI: '',
        isFormSubmitted: false,
        isTOTPSubmitted: false
    });

    // Forgot Password Form
    const [forgotField, setForgotField] = useState({
        email: '',
        code: '',
        password: '',
        confirmPassword: '',
        isFormSubmitted: false,
        isResetSubmitted: false
    });

    const [errorMsg, setErrorMsg] = useState({
        register: '',
        login: '',
        forgot: ''
    });

    // Invalid Input Messages
    const [validationOutcome, setValidationOutcome] = useState({
        reg_email: {},
        reg_password: {},
        reg_code: {},
        log_email: {},
        log_password: {},
        log_code: {},
        fgt_email: {},
        fgt_password: {},
        fgt_code: {}
    })

    useEffect(() => {
        setValidationOutcome({
            reg_email: InputChecker("Email", [registerField.email]),
            reg_password: InputChecker("Confirm Password", [registerField.password, registerField.confirmPassword]),
            reg_code: InputChecker("Code", [registerField.code]),
            log_email: InputChecker("Email", [loginField.email]),
            log_password: InputChecker("Password", [loginField.password]),
            log_code: InputChecker("Code", [loginField.code]),
            fgt_email: InputChecker("Email", [forgotField.email]),
            fgt_password: InputChecker("Confirm Password", [forgotField.password, forgotField.confirmPassword]),
            fgt_code: InputChecker("Code", [forgotField.code])
        });
    }, [registerField, loginField, forgotField])

    // Step 1: Registration
    const handleRegister = async (e) => {
        e.preventDefault();

        // Clear Login + Forgot Fields
        handleClearFields(['login', 'forgot']);
        setRegisterField((prevState) => ({
            ...prevState,
            isFormSubmitted: true
        }))
        let customMsg = '';

        // Check for role
        if (registerField.role === '' || registerField.role === null || registerField.role === undefined) {
            customMsg = 'Please select a role type';
        } else {
            const validCount = handleValidCounter('reg');
            if (validCount === 2) {
                let defaultName = registerField.email.split('@')[0];
                if (defaultName.length > 64) {
                    customMsg = 'This email address is too long. Please provide another email address.';
                } else {
                    const response = await userSignUp([registerField.email, registerField.password, defaultName, registerField.role]);
                    if (response.success) {
                        // Clear error message (if any)
                        setErrorMsg(prevState => ({
                            ...prevState,
                            register: ''
                        }));
                        // Go to Account Confirmation
                        handleLandingNav('confirmation');
                    } else {
                        customMsg = response.message;
                    }
                }
            }
        }
        if (customMsg !== '' && customMsg !== null && customMsg !== undefined) {
            setErrorMsg(prevState => ({
                ...prevState,
                register: customMsg
            }));
        }
    }

    // Step 1: Login
    const handleLogin = async (e) => {
        e.preventDefault();

        // Clear Register + Forgot Fields
        handleClearFields(['register', 'forgot']);
        setLoginField((prevState) => ({
            ...prevState,
            isFormSubmitted: true
        }))

        const validCount = handleValidCounter('log');
        if (validCount == 2) {
            const response = await userSignIn([loginField.email, loginField.password]);
            if (response.success) {
                if (response.body.nextStep.signInStep === 'CONTINUE_SIGN_IN_WITH_TOTP_SETUP') {
                    const setupURI = response.body.nextStep.totpSetupDetails.getSetupUri('corkboard_app');
                    //loginField.setupURI = setupURI.href;
                    setLoginField(prevState => ({
                        ...prevState,
                        setupURI: setupURI.href
                    }))
                }
                // Clear error message (if any)
                setErrorMsg(prevState => ({
                    ...prevState,
                    login: ''
                }));
                setLoginField(prevState => ({
                    ...prevState,
                    nextStep: response.body.nextStep.signInStep,
                }));
                // Go to Setup / Verify TOTP
                handleLandingNav('totp');
            } else {
                setErrorMsg(prevState => ({
                    ...prevState,
                    login: response.message
                }))
            }
        }
    }

    // Step 2: Confirmation
    const handleConfirmation = async (e, type) => {
        e.preventDefault();
        let customMsg = '';
        if (type === 'register') { // [1] Account Confirmation
            const { email, code } = registerField;

            setRegisterField((prevState) => ({
                ...prevState,
                isCodeSubmitted: true
            }));

            if (validationOutcome.reg_code.isInputValid) {
                const response = await userSignUpConfirmation([email, code]);
                if (response.success) {
                    setErrorMsg(prevState => ({
                        ...prevState,
                        [type]: ''
                    }));
                    loginField.email = registerField.email;
                    loginField.password = registerField.password;
                    validationOutcome.log_email = InputChecker("Email", [registerField.email]);
                    validationOutcome.log_password = InputChecker("Password", [registerField.password]);

                    // Trigger Login when confirmation done
                    handleLogin(e);
                } else {
                    customMsg = response.message;
                }
            }

        } else if (type === 'forgot') { // Reset Password Confirmation
            const { email, code, password } = forgotField;
            setForgotField(prevState => ({
                ...prevState,
                isResetSubmitted: true
            }));
            const validCount = handleValidCounter('fgt');
            if (validCount === 3) {
                const response = await userResetPasswordConfirmation([email, code, password]);
                if (!response.success) {
                    customMsg = response.message;
                } else {
                    setErrorMsg(prevState => ({
                        ...prevState,
                        [type]: ''
                    }));
                    loginField.email = forgotField.email;
                    loginField.password = forgotField.password;
                    validationOutcome.log_email = InputChecker("Email", [forgotField.email]);
                    validationOutcome.log_password = InputChecker("Password", [forgotField.password]);
                    // Trigger Login when confirmation done
                    handleLogin(e);
                }
            }
        }
        if (customMsg !== '' && customMsg !== null && customMsg !== undefined) {
            setErrorMsg(prevState => ({
                ...prevState,
                [type]: customMsg
            }));
        }
    }

    const handleResendCode = async (e, type) => {
        e.preventDefault();
        let email = '';
        let customMsg = '';
        if (type === 'register') {
            email = registerField.email;
        } else if (type === 'forgot') {
            email = forgotField.email;
        }
        const response = await resendCode([email], type);
        if (!response.success) {
            customMsg = response.message;
        } else {
            setErrorMsg(prevState => ({
                ...prevState,
                forgot: ''
            }));
        }

        if (customMsg !== '' && customMsg !== null && customMsg !== undefined) {
            setErrorMsg(prevState => ({
                ...prevState,
                [type]: customMsg
            }));
        }
    }

    // Step 3: TOTP Setup / Verification
    const handleTOTP = async (e) => {
        e.preventDefault();

        setLoginField(prevState => ({
            ...prevState,
            isTOTPSubmitted: true
        }));
        if (validationOutcome.log_code.isInputValid) {
            const response = await userSignInConfirmation([loginField.code], loginField.nextStep);
            if (response.success) {
                setErrorMsg(prevState => ({
                    ...prevState,
                    login: ''
                }));

                authProps.handleCreateSession();
            } else {
                setErrorMsg(prevState => ({
                    ...prevState,
                    login: response.message
                }));

            }
        }
    }

    // Step 4: Forgot Password
    const handleForgotPassword = async (e) => {
        e.preventDefault();

        // Clear Register + Login Fields
        handleClearFields(['register', 'login']);

        setForgotField((prevState) => ({
            ...prevState,
            isFormSubmitted: true
        }));
        let customMsg = '';
        if (validationOutcome.fgt_email.isInputValid) {
            const response = await userResetPassword([forgotField.email], false);
            if (!response.success) {
                customMsg = response.message;
            } else {
                // Go to Password Reset
                handleLandingNav('confirmation');
            }
        }
        if (customMsg !== '' && customMsg !== null && customMsg !== undefined) {
            setErrorMsg(prevState => ({
                ...prevState,
                forgot: customMsg
            }));
        }
    }

    // Change input fields
    const handleInputChange = (e, type) => {
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

    // Valid field counter
    const handleValidCounter = (keyPrefix) => {
        let count = 0;
        let validationKeys = Object.keys(validationOutcome);
        validationKeys.forEach(key => {
            if (key.startsWith(`${keyPrefix}_`) && validationOutcome[key].isInputValid) {
                count++;
            }
        });
        return count;
    }

    // Clear other fields
    const handleClearFields = (fields) => {
        let fieldState = {};
        fields.forEach(field => {
            if (field === 'register') {
                fieldState = registerField;
            } else if (field === 'login') {
                fieldState = loginField;
            } else if (field === 'forgot') {
                fieldState = forgotField;
            }

            let fieldKeys = Object.keys(fieldState);
            fieldKeys.forEach(key => {
                if (key.startsWith('is')) {
                    fieldState[key] = false;
                } else {
                    fieldState[key] = '';
                }
            })
        })
    }

    // Password Visibility Toggling
    const handleClickShowPassword = (type) => {
        setShowPassword((prevState) => ({
            ...prevState,
            [type]: !prevState[type]
        }));
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
            case 'totp':
                setStep(3);
                break;
            case 'forgot':
                setStep(4);
                break;
            default:
                setStep(1);
        }
    }

    return (
        <>
            {step === 1 ?
                <>
                    <div className='header'>
                        <h2>Welcome to <span style={{ color: '#2196f3' }}>Corkboard</span>!</h2>
                        <span>Fill up the form below to get started with registration</span>
                    </div>
                    <div className='roleSelect' style={{ display: 'flex', flexDirection: 'column' }}>
                        {errorMsg.register !== "" &&
                            <Alert severity='error'>{errorMsg.register}</Alert>
                        }
                        <span>Choose to register as either <span style={{ fontWeight: 600 }}>Staff</span> or <span style={{ fontWeight: 600 }}>Student</span>:</span>
                        <div className='roleButtons'>
                            <Button color='secondary' variant={registerField.role === 'staff' ? 'contained' : 'outlined'} disableElevation
                                name='staff'
                                onClick={(e) => handleRoleSetting(e)}>Staff</Button>
                            <Button color='error' variant={registerField.role === 'student' ? 'contained' : 'outlined'} disableElevation
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
                            onChange={(e) => handleInputChange(e, 'register')}
                            error={registerField.isFormSubmitted && !validationOutcome.reg_email.isInputValid}
                            helperText={registerField.isFormSubmitted && validationOutcome.reg_email.message}
                            variant='standard' />
                        <FormControl required error={registerField.isFormSubmitted && !validationOutcome.reg_password.isInputValid} variant='standard'>
                            <InputLabel>Password</InputLabel>
                            <Input
                                name='password'
                                type={showPassword.register ? 'text' : 'password'}
                                onChange={(e) => handleInputChange(e, 'register')}
                                value={registerField.password}
                                endAdornment={
                                    <InputAdornment position="end">
                                        <IconButton
                                            onClick={() => handleClickShowPassword('register')}>
                                            {showPassword.register ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                } />
                            <FormHelperText>{registerField.isFormSubmitted && validationOutcome.reg_password.message}</FormHelperText>
                        </FormControl>
                        <FormControl required error={registerField.isFormSubmitted && !validationOutcome.reg_password.isInputValid} variant='standard'>
                            <InputLabel>Confirm password</InputLabel>
                            <Input
                                name='confirmPassword'
                                type={showPassword.registerConfirm ? 'text' : 'password'}
                                onChange={(e) => handleInputChange(e, 'register')}
                                value={registerField.confirmPassword}
                                endAdornment={
                                    <InputAdornment position="end">
                                        <IconButton
                                            onClick={() => handleClickShowPassword('registerConfirm')}>
                                            {showPassword.registerConfirm ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                } />
                            <FormHelperText>{registerField.isFormSubmitted && validationOutcome.reg_password.message}</FormHelperText>
                        </FormControl>
                        <Button type='submit' onClick={(e) => handleRegister(e)} variant='outlined'>Register</Button>
                    </div>
                    <hr />
                    <div className='loginBox' style={{ display: 'flex', flexDirection: 'column' }}>
                        <h3>Have an account already?</h3>
                        {errorMsg.login !== "" &&
                            <Alert severity='error'>{errorMsg.login}</Alert>
                        }
                        <TextField required
                            label='Email address'
                            name='email'
                            type='email'
                            onChange={(e) => handleInputChange(e, 'login')}
                            value={loginField.email}
                            error={loginField.isFormSubmitted && !validationOutcome.log_email.isInputValid}
                            helperText={loginField.isFormSubmitted && validationOutcome.log_email.message}
                            variant='standard' />
                        <FormControl required error={loginField.isFormSubmitted && !validationOutcome.log_password.isInputValid} variant='standard'>
                            <InputLabel>Password</InputLabel>
                            <Input
                                name='password'
                                type={showPassword.login ? 'text' : 'password'}
                                onChange={(e) => handleInputChange(e, 'login')}
                                value={loginField.password}
                                endAdornment={
                                    <InputAdornment position="end">
                                        <IconButton
                                            onClick={() => handleClickShowPassword('login')}>
                                            {showPassword.login ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                } />
                            <FormHelperText>{loginField.isFormSubmitted && validationOutcome.log_password.message}</FormHelperText>
                        </FormControl>
                        <span className='clickable' style={{color: 'inherit'}} onClick={() => handleLandingNav('forgot')}>Forgot Password?</span>
                        <Button type='submit' onClick={(e) => handleLogin(e)} variant='outlined'>Login</Button>
                    </div>
                </>
                : step === 2 && (registerField.isFormSubmitted || forgotField.isFormSubmitted) ?
                    <>
                        <div className='header' style={{ display: 'flex', flexDirection: 'column' }}>
                            <h2>We Emailed You</h2>
                            <span>Your code {registerField.isFormSubmitted ? "and verification link are" : forgotField.isFormSubmitted && "is"}  on the way. It may take a minute to arrive.</span>
                            {registerField.isFormSubmitted ?
                                <>
                                    <span>To register your account, kindly fulfill the following steps that we emailed to {registerField.email}:</span>
                                    <ol type='1'>
                                        <li>Enter the code from email subject: <b>Corkboard Confirmation Code</b></li>
                                        <li>(Optional) Click on the subscription link from email subject: <b>AWS Notification - Subscription Confirmation</b></li>
                                    </ol>
                                </>
                                : forgotField.isFormSubmitted &&
                                <span>To reset your password, enter the code we emailed to {forgotField.email}.</span>
                            }
                        </div>
                        <div className='confirmationBox' style={{ display: 'flex', flexDirection: 'column' }}>
                            {
                                errorMsg.register || errorMsg.forgot !== '' &&
                                <Alert severity='error'>{registerField.isFormSubmitted ? errorMsg.register : forgotField.isFormSubmitted && errorMsg.forgot}</Alert>
                            }

                            <TextField required
                                label='Confirmation Code'
                                name='code'
                                type='text'
                                onChange={(e) => {
                                    registerField.isFormSubmitted ? handleInputChange(e, 'register')
                                        : forgotField.isFormSubmitted && handleInputChange(e, 'forgot')
                                }}
                                value={registerField.isFormSubmitted ? registerField.code : forgotField.isFormSubmitted && forgotField.code}
                                error={registerField.isCodeSubmitted ? !validationOutcome.reg_code.isInputValid : forgotField.isResetSubmitted && !validationOutcome.fgt_code.isInputValid}
                                helperText={registerField.isCodeSubmitted ? validationOutcome.reg_code.message : forgotField.isResetSubmitted && validationOutcome.fgt_code.message}
                                variant='standard' />
                            {
                                (forgotField.isFormSubmitted && !registerField.isFormSubmitted) &&
                                <>
                                    <FormControl required error={forgotField.isResetSubmitted && !validationOutcome.fgt_password.isInputValid} variant='standard'>
                                        <InputLabel>New Password</InputLabel>
                                        <Input
                                            name='password'
                                            type={showPassword.reset ? 'text' : 'password'}
                                            onChange={(e) => handleInputChange(e, 'forgot')}
                                            value={forgotField.password}
                                            endAdornment={
                                                <InputAdornment position="end">
                                                    <IconButton
                                                        onClick={() => handleClickShowPassword('reset')}>
                                                        {showPassword.reset ? <VisibilityOff /> : <Visibility />}
                                                    </IconButton>
                                                </InputAdornment>
                                            } />
                                        <FormHelperText>{forgotField.isResetSubmitted && validationOutcome.fgt_password.message}</FormHelperText>
                                    </FormControl>
                                    <FormControl required error={forgotField.isResetSubmitted && !validationOutcome.fgt_password.isInputValid} variant='standard'>
                                        <InputLabel>Confirm password</InputLabel>
                                        <Input
                                            name='confirmPassword'
                                            type={showPassword.resetConfirm ? 'text' : 'password'}
                                            onChange={(e) => handleInputChange(e, 'forgot')}
                                            value={forgotField.confirmPassword}
                                            endAdornment={
                                                <InputAdornment position="end">
                                                    <IconButton
                                                        onClick={() => handleClickShowPassword('resetConfirm')}>
                                                        {showPassword.resetConfirm ? <VisibilityOff /> : <Visibility />}
                                                    </IconButton>
                                                </InputAdornment>
                                            } />
                                        <FormHelperText>{forgotField.isResetSubmitted && validationOutcome.fgt_password.message}</FormHelperText>
                                    </FormControl>
                                </>
                            }
                            <Button variant='outlined'
                                type='submit'
                                onClick={(e) => {
                                    registerField.isFormSubmitted ?
                                        handleConfirmation(e, 'register')
                                        : forgotField.isFormSubmitted &&
                                        handleConfirmation(e, 'forgot')
                                }}>
                                Confirm
                            </Button>
                            <Button type='submit' variant='text'
                                onClick={(e) => {
                                    registerField.isFormSubmitted ?
                                        handleResendCode(e, 'register')
                                        : forgotField.isFormSubmitted &&
                                        handleResendCode(e, 'forgot')
                                }}>
                                Resend Code
                            </Button>
                        </div>
                    </>
                    : step === 3 ?
                        loginField.isFormSubmitted ?
                            <>
                                <div className='header' style={{ display: 'flex', flexDirection: 'column' }}>
                                    <h2>{loginField.nextStep === 'CONTINUE_SIGN_IN_WITH_TOTP_SETUP' ? 'Setup' : 'Verify'} TOTP MFA</h2>
                                    {loginField.isTOTPSubmitted && errorMsg.login !== '' &&
                                    <Alert severity='error'>{errorMsg.login}</Alert>
                                    }
                                    <span>{loginField.nextStep === 'CONTINUE_SIGN_IN_WITH_TOTP_SETUP' ? 'Scan this QR code with' : 'Enter the code from'} your TOTP app (e.g. Google Authenticator, Authy):</span>
                                </div>
                                <div className='totpBox' style={{ display: 'flex', flexDirection: 'column' }}>
                                    {
                                        loginField.nextStep === 'CONTINUE_SIGN_IN_WITH_TOTP_SETUP' &&
                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <QRCodeSVG value={loginField.setupURI} />
                                        </div>
                                    }
                                    <TextField required
                                    sx={{marginTop: '20px', maxWidth: '200px'}}
                                        label='TOTP Code'
                                        name='code'
                                        type='text'
                                        onChange={(e) => handleInputChange(e, 'login')}
                                        value={loginField.code}
                                        error={loginField.isTOTPSubmitted && !validationOutcome.log_code.isInputValid}
                                        helperText={loginField.isTOTPSubmitted && validationOutcome.log_code.message}
                                        variant='standard' />
                                    <Button sx={{marginTop:'10px', maxWidth: '100px'}} type='submit' variant='outlined' onClick={(e) => handleTOTP(e)}>
                                        {loginField.nextStep === 'CONTINUE_SIGN_IN_WITH_TOTP_SETUP' ? 'Setup' : 'Verify'}
                                    </Button>
                                </div>
                            </>
                            :
                            <InvalidPage />
                        : step === 4 ?
                            <>
                                <div className='header' style={{ display: 'flex', flexDirection: 'column' }}>
                                    <h2>Forgot Password?</h2>
                                    <span>No worries! Please enter the email address associated with your account.</span>
                                </div>
                                <div className='forgotBox' style={{ display: 'flex', flexDirection: 'column' }}>
                                    {errorMsg.forgot !== '' &&
                                        <Alert severity='error'>{errorMsg.forgot}</Alert>
                                    }
                                    <TextField required
                                        label='Email address'
                                        name='email'
                                        type='email'
                                        value={forgotField.email}
                                        onChange={(e) => handleInputChange(e, 'forgot')}
                                        error={forgotField.isFormSubmitted && !validationOutcome.fgt_email.isInputValid}
                                        helperText={forgotField.isFormSubmitted && validationOutcome.fgt_email.message}
                                        variant='standard' />
                                    <Button variant='outlined' type='submit' onClick={(e) => handleForgotPassword(e)}>
                                        Confirm
                                    </Button>
                                </div>
                            </>
                            :
                            <InvalidPage />
            }
        </>
    )
}

export default Landing;