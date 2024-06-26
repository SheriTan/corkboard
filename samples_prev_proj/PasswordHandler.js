import React, { useState, useEffect } from 'react';
import { Form, Popover, OverlayTrigger } from 'react-bootstrap';

export const PasswordPopover = ({ password, element }) => {
    const [pwdStrength, setPwdStrength] = useState('No');
    const [popoverPosition, setPopoverPosition] = useState('right');
    const [showStrengthBar, setShowStrengthBar] = useState(false);

    useEffect(() => {
        if (window.innerWidth <= 1024) {
            setPopoverPosition('top');
        } else {
            setPopoverPosition('right');
        }
        onPwdCheck();
    }, [password, window.innerWidth]);

    const popover = (
        <Popover style={(popoverPosition === "right" ? { maxWidth: "15.5em", maxHeight: "14.5em", marginLeft: "1.25em" } : { maxWidth: "18.5em", maxHeight: "14.5em" })}>
            <Popover.Header>The password must at least contain:</Popover.Header>
            <Popover.Body id="pwcheckerlist">
                <li id="pwlengthcheck" className="pwvalidation"><span>8 Characters</span></li>
                <li id="pwucasecheck" className="pwvalidation"><span>1 Uppercase Character</span></li>
                <li id="pwlcasecheck" className="pwvalidation"><span>1 Lowercase Character</span></li>
                <li id="pwnumcheck" className="pwvalidation"><span>1 Number</span></li>
                <li id="pwspcheck" className="pwvalidation"><span>1 Special Character (\-_.,~!@#$^&*)</span></li>
            </Popover.Body>
        </Popover>
    );

    const onPwdCheck = () => {
        const pwdCheckList = document.getElementsByClassName("pwvalidation");
        const pwdBarList = document.getElementsByClassName('progress-bar');
        const regexList = [".{8,32}", ".*[A-Z]+.*", ".*[a-z]+.*", ".*[0-9]+.*", ".*[-_.,~!@#$^&*]+.*"];
        let count = 0;
        let regex;

        if (pwdCheckList.length !== 0) {
            for (var r = 0; r < regexList.length; r++) {
                pwdCheckList[r].setAttribute("style", "color: #E55850;");
                regex = new RegExp(regexList[r]);
                if (regex.test(password)) {
                    pwdCheckList[r].setAttribute("style", "color: #6CC375;");
                    count++;
                }
            }
        }

        for (var p = 0; p < pwdBarList.length; p++) {
            if (Math.ceil(count / 2) >= 1) {
                pwdBarList[0].setAttribute('style', 'width: 33.3%; background-color: #E55850;');
                setPwdStrength('Weak');

                if (Math.ceil(count / 2) >= 2) {
                    pwdBarList[1].setAttribute('style', 'width: 33.3%; background-color: #FCE587;');
                    setPwdStrength('Average');

                    if (Math.ceil(count / 2) === 3) {
                        pwdBarList[2].setAttribute('style', 'width: 33.4%; background-color: #6CC375;');
                        setPwdStrength('Strong');

                    } else {pwdBarList[p].setAttribute('style', 'width: 0%; background-color: #CDCDCD;');}
                } else {pwdBarList[p].setAttribute('style', 'width: 0%; background-color: #CDCDCD;');}
            } else {
                pwdBarList[p].setAttribute('style', 'width: 0%; background-color: #CDCDCD;');
                setPwdStrength('No');
            }
        }
    }

    return (
        <OverlayTrigger trigger="focus" placement={popoverPosition} overlay={popover}>
            <Form.Group className='passwordTooltip' controlId='formBasicPassword' onClick={onPwdCheck} onFocus={() => { onPwdCheck(); setShowStrengthBar(true) }} onBlur={() => setShowStrengthBar(false)}>
                {element}
                {showStrengthBar &&
                    <>
                        <div className='progress mt-2' style={{ maxHeight: '0.625em' }}>
                            <div className='progress-bar' id='weakBar' />
                            <div className='progress-bar' id='avgBar' />
                            <div className='progress-bar' id='strongBar' />
                        </div>
                        <small style={{ marginLeft: "0.1875em" }}>{pwdStrength} Password</small>
                    </>
                }
            </Form.Group>
        </OverlayTrigger>
    )
}

export const InvalidRegexCheck = (password) => {
    return RegExp("^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$").test(password)
}