import React, { useState, useEffect, useRef } from 'react';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import { useNavigate } from "react-router-dom"
import { motion } from 'framer-motion';
import { PasswordPopover, InvalidRegexCheck } from '../utils/PasswordHandler';
import { CredentialSuccess, SignUpVerify, Loading } from '../utils/Modals';
import { Auth } from 'aws-amplify';
import { InputChecker } from '../utils/InputChecker';
import handleCognitoError from '../utils/handleCognitoError';

const Register = () => {
    const navigate = useNavigate();
    const [showSuccess, setShowSuccess] = useState(false);
    const [showCode, setShowCode] = useState(false);
    const [showLoading, setShowLoading] = useState(false);
    const [signUpField, setSignUpField] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        code: '',
        isSubmitted: false,
        isCodeSubmitted: false,
        errorMsg: ''
    });
    const [outcome, setOutcome] = useState({
        name: {},
        email: {},
        code: {},
        password: {}
    })

    useEffect(() => {
        document.title = 'Register - SP Design Studio';
        setOutcome({
            name: InputChecker("Name", [signUpField.name]),
            email: InputChecker("Email", [signUpField.email]),
            code: InputChecker("Verification Code", [signUpField.code]),
            password: InputChecker("Confirm Password", [signUpField.password, signUpField.confirmPassword])
        })
    }, [signUpField]);

    const handleSignUpChange = (event) => {
        event.preventDefault();
        const { name, value } = event.target;
        setSignUpField((prevState) => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSignUpClick = (event) => {
        let outcomeKeys = Object.keys(outcome);
        let validCounter = 0;

        event.preventDefault();
        setShowLoading(true);

        setSignUpField((prevState) => ({
            ...prevState,
            isSubmitted: true,
            errorMsg: ""
        }));

        for (var i = 0; i < outcomeKeys.length; i++) {
            if (outcomeKeys[i] !== "code" && outcome[outcomeKeys[i]].isInputValid === true) {
                validCounter++;
            }
        }

        if (validCounter === 3) {
            Auth.signUp({
                username: signUpField.email,
                password: signUpField.password,
                attributes: {
                  email: signUpField.email,
                  given_name: signUpField.name
                }
              }).then((response) => {
                setShowCode(true)
                setShowLoading(false);
              }).catch((error) => {
                console.log(error);
                setSignUpField((prevState) => ({
                    ...prevState,
                    errorMsg: handleCognitoError(error.name)
                }));

                setShowLoading(false);
            });
        } else {
            setShowLoading(false);
        }
    };

    const handleCodeClick = (event) => {
        event.preventDefault();
        setShowCode(false);
        setShowLoading(true);

        setSignUpField((prevState) => ({
            ...prevState,
            isCodeSubmitted: true,
            errorMsg: ""
        }));

        if (outcome.code.isInputValid === true) {
            Auth.confirmSignUp(signUpField.email, signUpField.code)
            .then((response) => {
                setShowSuccess(true);
                setShowLoading(false);
            })
            .catch((error) => {
                console.log(error);
                setSignUpField((prevState) => ({
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

    return (
        <motion.div
            initial={{ width: 0 }}
            animate={{ width: "100vw" }}
            exit={{ x: "100vw", transition: { duration: 0.3 } }}
        >
            <Container fluid>
                <Row className='Sign-InUp-Div'>
                    <Col xs={3} className='Sign-InUp-SideBar'>
                        <div className='Sign-InUp-SideBar-Content'>
                            <h2>Welcome Back!</h2>
                            <p>Login with your data that you entered during registration.</p>
                            <Button className='Submit-Button Submit-ButtonLight' type="submit" onClick={() => navigate('/signin')}>
                                Sign In
                            </Button>
                        </div>
                    </Col>
                    <Col xs={9} className='Sign-InUp-Activity'>
                        <Form className='Sign-InUp-Form'>
                            <h2 id="Heading" className='mb-5'>Register</h2>
                            {signUpField.errorMsg !== "" &&
                                <div className='mb-3 Form-Errors'>
                                    {signUpField.errorMsg}
                                </div>
                            }
                            <Form.Group className='mb-4'>
                                <Form.Control type='text' placeholder='Name' name='name' value={signUpField.name} onChange={handleSignUpChange} isInvalid={!outcome.name.isInputValid && signUpField.isSubmitted} required />
                                <Form.Control.Feedback type="invalid">{outcome.name.message}</Form.Control.Feedback>
                            </Form.Group>
                            <Form.Group className='mb-4'>
                                <Form.Control type='email' placeholder='Email address' name='email' value={signUpField.email} onChange={handleSignUpChange} isInvalid={!outcome.email.isInputValid && signUpField.isSubmitted} required />
                                <Form.Control.Feedback type="invalid">{outcome.email.message}</Form.Control.Feedback>
                            </Form.Group>
                            <Form.Group className='mb-4'>
                                <PasswordPopover
                                    element={
                                        <span>
                                            <Form.Control type='password' placeholder='Password' name='password' value={signUpField.password} onChange={handleSignUpChange} isInvalid={!outcome.password.isInputValid && signUpField.isSubmitted} required />
                                        </span>
                                    }
                                    password={signUpField.password}
                                />
                            </Form.Group>
                            <Form.Group className='mb-5'>
                                <Form.Control type='password' placeholder='Confirm Password' name='confirmPassword' value={signUpField.confirmPassword} onChange={handleSignUpChange} isInvalid={!outcome.password.isInputValid && signUpField.isSubmitted} required />
                                <Form.Control.Feedback type="invalid">{outcome.password.message}</Form.Control.Feedback>
                            </Form.Group>
                            <div className='Button-Alignment mb-3'>
                                <Button className='Submit-Button Submit-ButtonDark' type="submit" onClick={handleSignUpClick}>
                                    Register
                                </Button>
                            </div>
                        </Form>
                    </Col>
                </Row>
            </Container>
            <SignUpVerify modalState={{show: showCode, setShow: setShowCode, field: signUpField, setField: setSingUpField, outcome: outcome, handleChange: handleSignUpChange, handleClick: handleCodeClick}} />
            <CredentialSuccess type='register' modalState={{show: showSuccess, setShow: setShowSuccess, email: signUpField.email}} />
            <Loading show={showLoading} />
        </motion.div>
    )
}

export default Register;