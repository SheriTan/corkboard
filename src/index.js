import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import axios from 'axios';
import { Amplify } from 'aws-amplify';

const url = process.env.REACT_APP_API_URL;
const region = process.env.REACT_APP_AWS_REGION;
const key = process.env.REACT_APP_API_KEY;

const initialisation = async () => {
  try {
    const configResponse = await axios.get(`${url}auth?region=${region}&paramName=cognito`, {
      headers: {
        'X-Api-Key': key,
        'Content-Type': 'application/json'
      }
    });

    const payload = configResponse.data.parameters;
    const keyMapping = {
      '/cognito/app_client_id': 'userPoolWebClientId',
      '/cognito/app_client_secret': 'appClientSecret',
      '/cognito/user_pool_id': 'userPoolId'
    }

    // Construct the Auth configuration dynamically
    const authConfig = payload.reduce((acc, param) => {
      const key = keyMapping[param.name]; // Map API parameter name to Amplify key
      if (key) {
        acc[key] = param.value; // Set the value in the Auth configuration
      }
      return acc;
    }, {});

    Amplify.configure({
      Auth: {
        Cognito: {
          region: region,
          userPoolId: authConfig['userPoolId'],
          userPoolWebClientId: authConfig['userPoolWebClientId']
        }
      }
    });

    const root = ReactDOM.createRoot(document.getElementById('root'));
    root.render(
      <React.StrictMode>
        <App url={url} />
      </React.StrictMode>
    );
  } catch (error) {
    console.error('Error fetching system config: ', error);
  }
}

initialisation();
// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();