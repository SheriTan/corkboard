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
            case "File":
                if (!inputList.name || inputList.name === "" || !inputList.type || inputList.type === "") {
                    checkerOutcome.message = 'Filename / extension cannot be blank.'
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
            const allowedMIMETypes = {
                'application/msword': '.doc',
                'application/pdf': '.pdf',
                'application/vnd.ms-excel': '.xls',
                'application/vnd.ms-powerpoint': '.ppt',
                'application/vnd.openxmlformats-officedocument.presentationml.presentation': '.pptx',
                'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': '.xlsx',
                'application/vnd.openxmlformats-officedocument.wordprocessingml.document': '.docx',
                'application/x-zip-compressed': '.zip',
                'application/zip': '.zip',
                'image/jpeg': ['.jpg', '.jpeg'],
                'image/png': '.png',
                'text/plain': '.txt',
                'video/mp4': '.mp4',
            };


            if (inputType === 'File') {
                if (/[\<\>\"\'\;\|\%\{\}]/gi.test(inputList.name) || /[\<\>\"\'\;\|\%\{\}]/gi.test(inputList.type)) {
                    isMalicious = true;
                }
            } else {
                for (var i = 0; i < inputList.length; i++) {
                    let input = inputList[i].trim();
                    if (/[\<\>\"\'\;\|\%\{\}]/gi.test(input)) {
                        isMalicious = true;
                    }
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
                    case "Content":
                        if (inputList[0].length > 500) {
                            message = 'You cannot exceed more than 500 characters.'
                        } else {
                            isInputValid = true;
                        }
                        break;
                    case "File":
                        let count = 0;
                        if (/^(?!^(CON|PRN|AUX|NUL|COM[1-9]|LPT[1-9])$)(?!.*[<>:"/\\|?*\x00-\x1F]).*$/.test(inputList.name)) {
                            count++;
                            if (Object.keys(allowedMIMETypes).includes(inputList.type)) {
                                count++;
                                if (inputList.size <= 1048576) {
                                    count++;
                                } else {
                                    message = 'Your file is too big. Please upload a file <= 1MB.'
                                }
                            } else {
                                message = 'Your file extension is not allowed.'
                            }
                        } else {
                            message = 'Your filename contains illegal / reserved characters.';
                        }
                        if (count === 3) {
                            isInputValid = true;
                        }
                        break;
                }
            } else {
                message = 'Potential malicious input detected.';
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
