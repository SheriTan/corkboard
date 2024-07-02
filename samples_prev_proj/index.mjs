// Get specific parameter
import { SSMClient, GetParameterCommand } from '@aws-sdk/client-ssm';

export const handler = async (event, context) => {
    try {
        // Parse the request body from the event
        const requestBody = JSON.parse(event.body);

        // Extract region and parameter from the request body
        const regionName = requestBody.region;
        const paramName = requestBody.param;

        // Initialize the SSM client
        const ssmClient = new SSMClient({ region: regionName });

        // Parameters for the getParameter API call
        const params = {
            Name: paramName,
            WithDecryption: true // Specify if the parameter is encrypted
        };

        // Call getParameter directly from the client
        const data = await ssmClient.send(new GetParameterCommand(params));

        // Return the parameter value in the response
        const response = {
            statusCode: 200,
            body: JSON.stringify({
                message: 'Parameter value retrieved successfully',
                parameterValue: data.Parameter.Value
            })
        };
        return response;
    } catch (err) {
        // Handle errors
        console.log("Error:", err);
        const response = {
            statusCode: 500,
            body: JSON.stringify({
                message: 'Failed to retrieve parameter',
                error: err.message // Display the error message
            })
        };
        return response;
    }
};

// Get multiple parameters
import { SSMClient, GetParametersByPathCommand } from '@aws-sdk/client-ssm';

export const handler2 = async (event) => {
    try {
        // Parse the request body from the event
        const requestBody = JSON.parse(event.body);

        // Extract region and parameter prefix from the request body
        const regionName = requestBody.region;
        const parameterPrefix = requestBody.param;

        // Initialize the SSM client
        const ssmClient = new SSMClient({ region: regionName });

        // Parameters for the getParametersByPath API call
        const params = {
            Path: parameterPrefix,
            Recursive: true,
            WithDecryption: true // Specify if the parameters are encrypted
        };

        // Call getParametersByPath directly from the client
        const data = await ssmClient.send(new GetParametersByPathCommand(params));

        // Extract parameter values from the response
        const parameters = data.Parameters.map(param => ({
            name: param.Name,
            value: param.Value
        }));

        // Return the parameter values in the response
        const response = {
            statusCode: 200,
            body: JSON.stringify({
                message: 'Parameters retrieved successfully',
                parameters: parameters
            })
        };
        return response;
    } catch (err) {
        // Handle errors
        console.log("Error:", err);
        const response = {
            statusCode: 500,
            body: JSON.stringify({
                message: 'Failed to retrieve parameters',
                error: err.message // Display the error message
            })
        };
        return response;
    }
};

// Draft 3: account for CORS
import { SSMClient, GetParametersByPathCommand } from '@aws-sdk/client-ssm';

export const handler3 = async (event) => {
    try {
        // Validate query string parameters
        const queryStringParameters = event.queryStringParameters || {};
        const regionName = queryStringParameters['region'];
        const parameterPrefix = queryStringParameters['paramName'];

        if (!regionName || !parameterPrefix) {
            return {
                statusCode: 400,
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token'
                },
                body: JSON.stringify({
                    message: 'Missing required query parameters: region and paramName'
                })
            };
        }

        // Initialize the SSM client
        const ssmClient = new SSMClient({ region: regionName });

        // Parameters for the getParametersByPath API call
        const params = {
            Path: `/${parameterPrefix}/`,
            Recursive: true,
            WithDecryption: true // Specify if the parameters are encrypted
        };

        // Call getParametersByPath directly from the client
        const data = await ssmClient.send(new GetParametersByPathCommand(params));

        // Extract parameter values from the response
        const parameters = data.Parameters.map(param => ({
            name: param.Name,
            value: param.Value
        }));

        // Return the parameter values in the response
        return {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token'
            },
            body: JSON.stringify({
                message: 'Parameters retrieved successfully',
                parameters: parameters
            })
        };
    } catch (err) {
        // Handle errors
        console.error("Error:", err);
        return {
            statusCode: 500,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token'
            },
            body: JSON.stringify({
                message: 'Failed to retrieve parameters',
                error: err.message // Display the error message
            })
        };
    }
};
