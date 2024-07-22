import { signUp, confirmSignUp, signIn, confirmSignIn, resendSignUpCode, resetPassword, updatePassword, confirmResetPassword, updateUserAttributes, updateMFAPreference } from "aws-amplify/auth";
import { defaultClientRequest } from "./AxiosHandler";

// Register - Sign Up
export const userSignUp = async (InputList) => {
    // 0: email, 1: password, 2: name, 3: role
    try {
        const body = await signUp({
            username: InputList[0],
            password: InputList[1],
            options: {
                userAttributes: {
                    email: InputList[0],
                    name: InputList[2],
                    'custom:role': InputList[3]
                    // 'custom:authNotif': '1',
                    // 'custom:commentNotif': '1',
                    // 'custom:documentNotif': '1',
                    // 'custom:threadNotif': '1'
                }
            }
        })

        await defaultClientRequest(
            'POST',
            'auth',
            {},
            {email: InputList[0]}
        );

        return { success: true, body };
    } catch (cognitoError) {
        return { success: false, message: cognitoError.message };
    }
}

// Register - Verification Code
export const userSignUpConfirmation = async (InputList) => {
    // 0: email, 1: code
    try {
        const body = await confirmSignUp({
            username: InputList[0],
            confirmationCode: InputList[1]
        });
        return { success: true, body };
    } catch (cognitoError) {
        return { success: false, message: cognitoError.message };
    }
}

// Login - Sign In
export const userSignIn = async (InputList) => {
    // 0: email, 1: password
    try {
        const body = await signIn({
            username: InputList[0],
            password: InputList[1]
        });

        return { success: true, body };
    } catch (cognitoError) {
        return { success: false, message: cognitoError.message };
    }
}

// Login - Setup / Verify TOTP (MFA)
export const userSignInConfirmation = async (InputList, nextStep) => {
    // 0: TOTP code
    try {
        const first = await confirmSignIn({
            challengeResponse: InputList[0]
        });
        let returnObj = { success: true, first }
        if (nextStep === 'CONTINUE_SIGN_IN_WITH_TOTP_SETUP') {
            const final = await updateMFAPreference({
                totp: 'ENABLED'
            });
            returnObj.final = final;
        }
        return returnObj;
    } catch (cognitoError) {
        return { success: false, message: cognitoError.message };
    }
}

// Reset Password - (Un)Authenticated user
export const userResetPassword = async (InputList, authenticated) => {
    // if auth: 0: password, 1: confirmPassword
    // if unauth: 0: email
    if (authenticated) {
        try {
            await updatePassword({
                oldPassword: InputList[0],
                newPassword: InputList[1]
            });
            return { success: true };
        } catch (cognitoError) {
            return { success: false, message: cognitoError.message };
        }
    } else {
        try {
            await resetPassword({
                username: InputList[0]
            });
            return { success: true };
        } catch (cognitoError) {
            return { success: false, message: cognitoError.message };
        }
    }
}

// Reset Password - Unauthenticated user confirmation
export const userResetPasswordConfirmation = async (InputList) => {
    // 0: email, 1: code, 2: password
    try {
        await confirmResetPassword({
            username: InputList[0],
            confirmationCode: InputList[1],
            newPassword: InputList[2]
        });
        return { success: true };
    } catch (cognitoError) {
        return { success: false, message: cognitoError.message };
    }
}

// Register / Forgot Password - Resend Code
export const resendCode = async (InputList, type) => {
    // 0: email
    if (type === 'register') {
        try {
            await resendSignUpCode({
                username: InputList[0]
            })
            return { success: true };
        } catch (cognitoError) {
            return { success: false, message: cognitoError.message };
        }
    } else if (type === 'forgot') {
        try {
            await resetPassword({
                username: InputList[0]
            })
            return { success: true };
        } catch (cognitoError) {
            return { success: false, message: cognitoError.message };
        }
    }
}