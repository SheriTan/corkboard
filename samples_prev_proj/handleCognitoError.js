function handleCognitoError(error) {
    var errorMsg = "";
    switch (error) {
        case "UsernameExistsException":
            errorMsg = "This user already exists.";
            break;
        case "UserNotFoundException":
            errorMsg = "This user does not exist.";
            break
        case "InvalidPasswordException":
            errorMsg = "The password does not meet the minimum requirements.";
            break;
        case "ExpiredCodeException":
            errorMsg = "Your verification code has already expired. Please request for another one.";
            break;
        case "CodeMismatchException":
            errorMsg = "This verification code is incorrect.";
            break;
        case "NotAuthorizedException":
            errorMsg = "Your username or password is incorrect.";
            break;
        case "UserNotConfirmedException":
            errorMsg = "This user is not verified.";
            break;
        case "LimitExceededException":
            errorMsg = "You have made too many attempts to request for a verification code. Please try again later.";
            break;
        default:
            errorMsg = "An unknown error has occurred. Please try again later.";
    }

    return errorMsg;
}

export default handleCognitoError;