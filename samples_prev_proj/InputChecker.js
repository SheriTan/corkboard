import { useEffect } from "react";

export const InputChecker = (inputType, inputList) => {
    var checkerOutcome = {
        isInputValid: false,
        doesInputExist: false,
        message: ''
    }


    const checkingInput = () => {
        switch (inputType) {
            case "Confirm Password":
                if (!inputList[0] || inputList[0] === "") {
                    checkerOutcome.message = 'This cannot be blank.';
                    break;
                } else if (!inputList[0] === inputList[1]) {
                    checkerOutcome.message = 'These passwords do not match.';
                    break;
                } else {
                    checkerOutcome.doesInputExist = true;
                }
                break;
            default:
                for (var i = 0; i < inputList.length; i++) {
                    if (!inputList[i] || inputList[i] === "") {
                        checkerOutcome.message = 'This cannot be blank.';
                        return;
                    } else if (i+1 === inputList.length) {
                        checkerOutcome.doesInputExist = true;
                    }
                }
        }
        
        if (checkerOutcome.doesInputExist) {
            let isInputValid = false;
            let message = '';

            switch (inputType) {
                case "Email":
                    if (/^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/.test(inputList[0])) {
                        isInputValid = true;
                    } else {
                        message = 'Please enter a valid email.';
                    }
                    break;
                case "Name":
                    if (/^[a-zA-Z\-\'\ ]{0,64}$/.test(inputList[0])) {
                        isInputValid = true;
                    } else {
                        message = 'Please enter a valid name.';
                    }
                    break;
                case "Confirm Password":
                    if (/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[\-_.,~!@#$^&*])^[^()\[\]+\<\>%\\\/:;'"={}\n]{8,32}$/.test(inputList[0])) {
                        if (inputList[0] === inputList[1] || inputList[1] === inputList[0]) {
                            isInputValid = true;
                        } else {
                            message = 'These passwords do not match.';
                        }
                    } else {
                        message = 'Please enter a valid password.';
                    }
                    break;
                case "Password":
                    if (/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[\-_.,~!@#$^&*])^[^()\[\]+\<\>%\\\/:;'"={}\n]{8,32}$/.test(inputList[0])) {
                        isInputValid = true;
                    } else {
                        message = 'Please enter a valid password.';
                    }
                    break;
                case "Verification Code":
                    if (/^[0-9]{6}$/.test(inputList[0])) {
                        isInputValid = true;
                    } else {
                        message = 'Your code should be 6 digits long.';
                    }
                    break;
                case "Project Name":
                    if (/^[a-zA-Z\d\-\_\ ]{3,255}$/.test(inputList[0])) {
                        isInputValid = true;
                    } else {
                        message = 'You cannot use this name. Please enter another project name.';
                    }
                    break;
            }

            checkerOutcome = {
                isInputValid: isInputValid,
                message: message
            }
        }
    }

    checkingInput();
    
    return checkerOutcome;
}
        