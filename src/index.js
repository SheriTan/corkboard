import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { Amplify } from 'aws-amplify';
import { sessionStorage } from 'aws-amplify/utils';
import { cognitoUserPoolsTokenProvider } from 'aws-amplify/auth/cognito';

const region = process.env.REACT_APP_AWS_REGION;
const userpool = process.env.REACT_APP_COGNITO_USERPOOLID;
const client = process.env.REACT_APP_COGNITO_USERPOOLCLIENTID;

Amplify.configure({
  Auth: {
    Cognito: {
      region: region,
      userPoolId: `${region}_${userpool}`,
      userPoolClientId: client
    }
  }
});

cognitoUserPoolsTokenProvider.setKeyValueStorage(sessionStorage);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();