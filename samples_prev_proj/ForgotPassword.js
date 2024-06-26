import React, { useState, useEffect, useRef } from 'react'
import { Container, Form, Image, Button } from 'react-bootstrap'
import { Navigate, useNavigate } from "react-router-dom"
import { motion } from 'framer-motion';
import { Auth } from 'aws-amplify';
import { PasswordPopover } from '../utils/PasswordHandler';
import { InputChecker } from '../utils/InputChecker';
import { CredentialSuccess } from '../utils/Modals';
import handleCognitoError from '../utils/handleCognitoError';

const ForgotPassword = () => {
    const navigate = useNavigate();
    const [errorMsg, setErrorMsg] = useState("");
    const [resendMsg, setResendMsg] = useState("");
    const [verifyEmailField, setVerifyEmailField] = useState({
        email: '',
        code: '',
    });
    const [submit, setSubmit] = useState({
        email: false,
        emailSuccess: false,
        code: false,
        codeSuccess: false,
        resetPassword: false,
        resetPasswordSuccess: false
    });
    const [resetPasswordField, setResetPasswordField] = useState({
        password: '',
        confirmPassword: '',
    })
    const [outcome, setOutcome] = useState({
        email: {},
        code: {},
        password: {},
        confirmPassword: {},
    })

    const [show, setShow] = useState(false);

    useEffect(() => {
        document.title = 'Forgot Password - SP Design Studio';
        setOutcome({
            email: InputChecker("Email", [verifyEmailField.email]),
            code: InputChecker("Verification Code", [verifyEmailField.code]),
            password: InputChecker("Confirm Password", [resetPasswordField.password, resetPasswordField.confirmPassword])
        })
    }, [verifyEmailField, resetPasswordField]);

    const onFieldChange = (event) => {
        event.preventDefault();
        setErrorMsg("");
        setResendMsg("");
        const { name, value } = event.target;
        if (name !== "password" && name !== "confirmPassword") {
            setVerifyEmailField((prevState) => ({
                ...prevState,
                [name]: value
            }))
        } else {
            setResetPasswordField((prevState) => ({
                ...prevState,
                [name]: value
            }))
        }
    }

    const handleSuccessClick = (event) => {
        event.preventDefault();
        const { name, value } = event.target;
        // Checks whether the button is clicked
        setSubmit((prevState) => ({
            ...prevState,
            [value]: true
        }));

        // Checks if the fields are valid
        switch (name) {
            case 'verifyEmailField':

                switch (value) {
                    case "email":
                        if (outcome.email.isInputValid) {
                            Auth.forgotPassword(verifyEmailField.email)
                            .then((response) => {
                                setSubmit((prevState) => ({
                                    ...prevState,
                                    [value + "Success"]: true
                                }));
                            })
                            .catch((error) => {
                              console.log(error.name);
                              seterrorMsg(handleCognitoError(error.name));
                            });
                        }
                        break;
                    case "code":
                        if (outcome.code.isInputValid) {
                            setSubmit((prevState) => ({
                                ...prevState,
                                [value + "Success"]: true
                            }));
                        }
                        break;
                }
                break;
            case 'resetPasswordField':
                if (outcome.password.isInputValid) {
                    Auth.forgotPasswordSubmit(verifyEmailField.email, verifyEmailField.code, resetPasswordField.password)
                    .then((response) => {
                        setSubmit((prevState) => ({
                            ...prevState,
                            [value + "Success"]: true
                        }));
                        setShow(true);
                    })
                    .catch((error) => {
                        console.log(error.name);
                        setErrorMsg(handleCognitoError(error.name))
                    });
                }
                break;
        }
    }

    const handleBackClick = (event) => {
        event.preventDefault();
        const { name } = event.target;

        switch (name) {
            case "email":
                navigate("/signin");
                break;
            case "code":
                setSubmit((prevState) => ({
                    ...prevState,
                    emailSuccess: false,
                    codeSuccess: false,
                    resetPasswordSuccess: false
                }));
                break;
            case 'resetPassword':
                setSubmit((prevState) => ({
                    ...prevState,
                    emailSuccess: true,
                    codeSuccess: false,
                    resetPasswordSuccess: false
                }));
                break;
        }
    }

    const handleResendClick = () => {
        setErrorMsg("");
        setResendMsg("");
        
        Auth.forgotPassword(verifyEmailField.email)
        .then((response) => {
            setResendMsg("You have successfully requested for a new code.")
        })
        .catch((error) => {
        console.log(error);
        setErrorMsg(handleCognitoError(error.name));
        });
    }

    const modalState = {
        show: show,
        setShow: setShow,
    }

    return (
        <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: [0, 1], scale: 1 }}
        transition={{ duration: 0.5 }}
        >
            <div className='ForgotPassword-Div'>
                <Container className="Container">
                <motion.div
                        initial={{ scale: 0 }}
                        animate={{ rotate: 360, scale: 1}}
                        transition={{
                            type: "spring",
                            stiffness: 100,
                            damping: 20
                        }}
                        className="ForgotPassword-Container"
                    >
                    {
                        submit.emailSuccess ?
                            submit.codeSuccess ?
                                <Form className="ForgotPassword-Form" name="resetPasswordField" value="resetPassword" onSubmit={handleSuccessClick}>
                                    <div className='mb-2'>
                                        <h2 className="Heading mb-3">Set new password</h2>
                                        <p className="context-text stage2 mb-4">Please enter your new password.</p>
                                        {errorMsg !== "" &&
                                        <div className='Form-Errors context-text stage2 mb-3'>
                                            {errorMsg}
                                        </div>
                                        }
                                        <Form.Group className='mb-3'>
                                            <PasswordPopover
                                                element={
                                                    <span>
                                                        <Form.Control type='password' placeholder='Password' name='password' value={resetPasswordField.password} onChange={onFieldChange} isInvalid={submit.resetPassword && !outcome.password.isInputValid} required />
                                                    </span>
                                                }
                                                password={resetPasswordField.password}
                                            />
                                            <Form.Control.Feedback type="invalid" />
                                        </Form.Group>
                                        <Form.Group className='mb-4'>
                                            <Form.Control type='password' placeholder='Confirm Password' name='confirmPassword' value={resetPasswordField.confirmPassword} onChange={onFieldChange} isInvalid={submit.resetPassword && !outcome.password.isInputValid} required />
                                            <Form.Control.Feedback type="invalid">{outcome.password.message}</Form.Control.Feedback>
                                        </Form.Group>
                                        <div className='d-flex justify-content-between align-items-center'>
                                            <div className='Link Back'><a href="#" name="resetPassword" onClick={handleBackClick}>Back</a></div>
                                            <Button className="Submit-Button Submit-ButtonDark" type="submit" name="resetPasswordField" value="resetPassword" onClick={handleSuccessClick}>
                                                Reset Password
                                            </Button>
                                        </div>
                                    </div>
                                </Form>
                                :
                                <Form className="ForgotPassword-Form" name="verifyEmailField" value="code" onSubmit={handleSuccessClick}>
                                    <div>
                                        <h2 className="Heading mb-3">Verify email</h2>
                                        <p className="context-text stage2 mb-4">
                                            Please enter the verification code sent to the following email address.
                                        </p>
                                        {errorMsg !== "" &&
                                        <div className='Form-Errors context-text stage2 mb-3'>
                                            {errorMsg}
                                        </div>
                                        }
                                        {
                                        resendMsg !== "" &&
                                        <div className="context-text stage2" style={{paddingBottom: "1em"}}>
                                            {resendMsg}
                                        </div>  
                                        }
                                        <Form.Group className='mb-3'>
                                            <Form.Control disabled className="Form-Input" type='text' value={verifyEmailField.email} />
                                        </Form.Group>
                                        <Form.Group className='mb-4'>
                                            <Form.Control className="Form-Input" type='text' placeholder='Verification Code' name='code' value={verifyEmailField.code} onChange={onFieldChange} isInvalid={submit.code ? !outcome.code.isInputValid && true : false} />
                                            <Form.Control.Feedback type="invalid">{outcome.code.message}</Form.Control.Feedback>
                                        </Form.Group>
                                        <div className='d-flex justify-content-between align-items-center mb-4'>
                                            <div className='Link Back'><a href="#" name="code" onClick={handleBackClick}>Back</a></div>
                                            <div className='Link Resend'><a href="#" onClick={handleResendClick}>Resend Code</a></div>
                                        </div>
                                    </div>
                                    <Button className="Submit-Button Submit-ButtonDark" type="submit" name="verifyEmailField" value="code" onClick={handleSuccessClick}>
                                        Verify
                                    </Button>
                                </Form>
                            :
                            <Form className="ForgotPassword-Form" name="verifyEmailField" value="email" onSubmit={handleSuccessClick}>
                                <div>
                                    <h2 className="Heading mb-3">Don't worry</h2>
                                    <p className="context-text stage1 mb-4">
                                        We are here to help you to recover your password. Enter the email address you used when you joined and we'll send you a verification code to reset your password.
                                    </p>
                                    {errorMsg !== "" &&
                                        <div className='Form-Errors context-text stage1 mb-3'>
                                            {errorMsg}
                                        </div>
                                    }
                                    <Form.Group className='mb-4'>
                                        <Form.Control className="Form-Input" type='text' placeholder='Email Address' name='email' value={verifyEmailField.email} onChange={onFieldChange} isInvalid={submit.email ? !outcome.email.isInputValid && true : false} />
                                        <Form.Control.Feedback type="invalid">{outcome.email.message}</Form.Control.Feedback>
                                    </Form.Group>
                                    <div className='d-flex justify-content-between align-items-center'>
                                        <div className='Link Back'><a href="#" name="email" onClick={handleBackClick}>Back</a></div>
                                        <Button className="Submit-Button Submit-ButtonDark" type="submit" name="verifyEmailField" value="email" onClick={handleSuccessClick}>
                                            Send
                                        </Button>
                                    </div>
                                </div>
                            </Form>
                    }
                </motion.div>
                </Container>
                <CredentialSuccess type='reset' modalState={modalState} />
            </div>
        </motion.div>
    );
};

export default ForgotPassword;