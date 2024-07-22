import axios from "axios";

export async function defaultClientRequest(method, res, header = {}, data = {}) {
    let config = {
        method: method,
        url: `${process.env.REACT_APP_PROD_ENDPOINT}${res}`,
        headers: header
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

export async function customClientRequest(method, url, header = {}, data = {}) {
    let config = {
        method: method,
        url: url,
        headers: header
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