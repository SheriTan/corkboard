import React, { useState, useEffect, useRef } from 'react'
import { Container, Row, Col, Form, Button } from 'react-bootstrap'
import { useNavigate } from "react-router-dom"
import { motion } from 'framer-motion';
import { Auth } from 'aws-amplify';
import { SignUpVerify, Loading } from '../utils/Modals';
import { InputChecker } from '../utils/InputChecker';
import handleCognitoError from '../utils/handleCognitoError';

const SignIn = ({authProps}) => {
    const navigate = useNavigate();
    const [showCode, setShowCode] = useState(false);
    const [showLoading, setShowLoading] = useState(false);
    const [signInField, setSignInField] = useState({
        email: '',
        password: '',
        code: '',
        isSubmitted: false,
        isCodeSubmitted: false,
        errorMsg: ''
    });
    const [outcome, setOutcome] = useState({
        email: {},
        password: {},
        code: {}
    })

    useEffect(() => {
        document.title = 'Sign In - SP Design Studio';
        setOutcome({
            email: InputChecker("Email", [signInField.email]),
            password: InputChecker("Password", [signInField.password]),
            code: InputChecker("Verification Code", [signInField.code])
        });
    }, [signInField]);

    const handleSignInChange = (event) => {
        event.preventDefault();
        const { name, value } = event.target;
        setSignInField((prevState) => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSignInClick = (event) => {
        let outcomeKeys = Object.keys(outcome);
        let validCounter = 0;
        
        event.preventDefault();
        setShowLoading(true);

        setSignInField((prevState)=>({
            ...prevState,
            isSubmitted: true,
            errorMsg: ''
        }));

        for (var i = 0; i < outcomeKeys.length; i++) {
            if (outcomeKeys[i] !== "code" && outcome[outcomeKeys[i]].isInputValid === true) {
                validCounter++;
            }
        }

        if (validCounter === 2) {
            Auth.signIn(signInField.email, signInField.password)
            .then((user) => {
                authProps.setUser(user);
                authProps.setIsAuthenticated(true);

                setShowLoading(false);
                navigate('/home');
            })
            .catch(error => {
                authProps.setUser(null);
                authProps.setIsAuthenticated(false);

                if (error.name === "UserNotConfirmedException") {
                    setShowCode(true);
                } else {
                    console.log(error);
                    
                    setSignInField((prevState) => ({
                        ...prevState,
                        errorMsg: handleCognitoError(error.name)
                    }));
                }

                setShowLoading(false);
            })
        } else {
            setShowLoading(false);
        }

    };

    const handleCodeClick = (event) => {
        event.preventDefault();
        setShowCode(false);
        setShowLoading(true);

        setSignInField((prevState) => ({
            ...prevState,
            isCodeSubmitted: true,
            errorMsg: ""
        }));

        if (outcome.code.isInputValid === true) {
            Auth.confirmSignUp(signInField.email, signInField.code)
            .then((response) => {
                Auth.signIn(signInField.email, signInField.password)
                    .then((user) => {
                        authProps.setUser(user);
                        authProps.setIsAuthenticated(true);

                        setShowLoading(false);
                        navigate('/home');
                    })
                    .catch(error => {
                        authProps.setUser(null);
                        authProps.setIsAuthenticated(false);

                        console.log(error);
                        
                        setSignInField((prevState) => ({
                            ...prevState,
                            errorMsg: handleCognitoError(error.name)
                        }));

                        setShowLoading(false);
                    })
            })
            .catch((error) => {
                console.log(error);
                setSignInField((prevState) => ({
                    ...prevState,
                    errorMsg: handleCognitoError(error.name)
                }));

                setShowCode(true);
                setShowLoading(false);
            })
        } else {
            setShowCode(true);
            setShowLoading(false);
        }

    }

    const handleForgotPassword = (event) => {
        event.preventDefault();
        navigate("/forgotpassword");
    }

    return (
        <motion.div
        initial={{width: 0}}
        animate={{width: "100vw"}}
        exit={{x: "-100vw", transition: {duration: 0.3}}}
        >
        <Container fluid>
            <Row className='Sign-InUp-Div'>
                <Col xs={9} className='Sign-InUp-Activity'>
                    <Form className='Sign-InUp-Form'>
                        <h2 id="Heading" className='mb-5'>Sign In</h2>
                        {signInField.errorMsg !== "" &&
                        <div className='mb-3 Form-Errors'>
                            {signInField.errorMsg}
                        </div>
                        }
                        <Form.Group className='mb-4'>
                            <Form.Control type='email' placeholder='Email address' name='email' value={signInField.email} onChange={handleSignInChange} isInvalid={!outcome.email.isInputValid && signInField.isSubmitted} />
                            <Form.Control.Feedback type="invalid">{outcome.email.message}</Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group className='mb-2'>
                            <Form.Control type='password' placeholder='Password' name='password' value={signInField.password} onChange={handleSignInChange} isInvalid={!outcome.password.isInputValid && signInField.isSubmitted} />
                            <Form.Control.Feedback type="invalid">{outcome.password.message}</Form.Control.Feedback>
                        </Form.Group>
                        <div className='Link ForgotPassword mb-4'><a href="#" onClick={handleForgotPassword}>Forgot Password?</a></div>
                        <div className='Button-Alignment mb-3'>
                        <Button className='Submit-Button Submit-ButtonDark' type="submit" onClick={handleSignInClick}>
                            Sign In
                        </Button>
                        </div>
                    </Form>
                </Col>
                <Col xs={3} className='Sign-InUp-SideBar'>
                    <div className='Sign-InUp-SideBar-Content'>
                    <h2>New Here?</h2>
                    <p>Fill up your personal information to create a new account.</p>
                    <Button className='Submit-Button Submit-ButtonLight' type="submit" onClick={() => navigate('/signup')}>
                        Register
                    </Button>
                    </div>
                </Col>
            </Row>
        </Container>
        <SignUpVerify modalState={{show: showCode, setShow: setShowCode, field: signInField, setField: setSignInField, outcome: outcome, handleChange: handleSignInChange, handleClick: handleCodeClick}} />
        <Loading show={showLoading} />
        </motion.div>
    );
};

export default SignIn;