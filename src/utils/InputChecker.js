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
                    } else if (i + 1 === inputList.length) {
                        checkerOutcome.doesInputExist = true;
                    }
                }
        }

        if (checkerOutcome.doesInputExist) {
            let isInputValid = false;
            let message = '';
            let isMalicious = false;

            for (var i = 0; i < inputList.length; i++) {
                let input = inputList[i].trim();
                if (/[\<\>\"\'\&]/gi.test(input)) {
                    isMalicious = true;
                    message = 'Potentially malicious input detected.';
                }
            }

            if (!isMalicious) {
                switch (inputType) {
                    case "Email":
                        if (/^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/.test(inputList[0])) {
                            isInputValid = true;
                        } else {
                            message = 'Please enter a valid email.';
                        }
                        break;
                    case "First Name":
                        if (/^([a-zA-Z0-9_\-\.\'\ ]+){0,64}$/.test(inputList[0])) {
                            isInputValid = true;
                        } else {
                            message = 'Please enter a valid first name.';
                        }
                        break;
                    case "Last Name":
                        if (/^([a-zA-Z0-9_\-\.\'\ ]+){0,64}$/.test(inputList[0])) {
                            isInputValid = true;
                        } else {
                            message = 'Please enter a valid last name.';
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
                    case "Code":
                        if (/^[0-9]{6}$/.test(inputList[0])) {
                            isInputValid = true;
                        } else {
                            message = 'Your code should be 6 digits long.';
                        }
                        break;
                }
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
