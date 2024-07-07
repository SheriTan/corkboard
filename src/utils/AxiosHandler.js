import axios from "axios";

export default async function authaccRequest(method, res, header = {}, data = {}) {
    let config = {
        method: method,
        url: `${process.env.REACT_APP_PROD_ENDPOINT}${res}`,
        headers: {
            ...header,
            'Content-type': 'application/json',
        }
    }

    if (method !== 'GET') {
        config = {
            ...config,
            data: data
        }
    }

    try {
        const response = await axios.request(config);
        return response.data;
    } catch (err) {
        return err;
    }
}