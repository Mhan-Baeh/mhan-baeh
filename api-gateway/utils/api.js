const axios = require('axios');
const { response } = require('express');
const { Kafka } = require('kafkajs');
const kafka = new Kafka({
    clientId: 'my-app',
    brokers: [process.env.KAFKA_HOST], // Replace with your Kafka brokers
});


const formatUrl = ({ requestUrl, baseUrl, prefix = '' }) => {
    const path = requestUrl.replace(prefix, '')
    return `${baseUrl}${path}`
}

const setResponse = (res, { data, headers, status }) => {
    // Forward all headers from the response
    Object.keys(headers).forEach(header => {
        res.setHeader(header, headers[header]);
    });

    // Set status and send the response data
    res.status(status).send(data);
}

const errorResponse = (error) => {
    const statusCode = error.response?.status

    if (error.response?.data) {
        const res = error.response.data

        return { error: res.error ?? res.message ?? res.info ?? res, statusCode }
    } else {
        return { error: (error.message) ? error.message : error, statusCode: (statusCode) ? statusCode : 500 }
    }
}

const get = async (req, res, baseUrl, prefix, headers = {}) => {
    try {
        const response = await axios.get(formatUrl({ requestUrl: req.url, baseUrl, prefix }), {
            headers: { authorization: req.headers.authorization, claims: JSON.stringify(req.user), ...headers },
        })

        setResponse(res, response)
    } catch (error) {
        const err = errorResponse(error)
        return res.status(err.statusCode).json(err.error)
    }
}

const post = async (req, res, baseUrl, prefix, headers = {},) => {
    try {
        const response = await axios.post(
            formatUrl({ requestUrl: req.url, baseUrl, prefix }),
            req.body,
            { headers: { authorization: req.headers.authorization, claims: JSON.stringify(req.user), ...headers }, },
        )

        setResponse(res, response)
    } catch (error) {
        const err = errorResponse(error)
        return res.status(err.statusCode).json(err.error)
    }
}

const put = async (req, res, baseUrl, prefix, headers = {}) => {
    try {
        const response = await axios.put(
            formatUrl({ requestUrl: req.url, baseUrl, prefix }),
            req.body,
            { headers: { authorization: req.headers.authorization, claims: JSON.stringify(req.user), ...headers }, },
        )

        setResponse(res, response)
    } catch (error) {
        const err = errorResponse(error)
        return res.status(err.statusCode).json(err.error)
    }
}

const del = async (req, res, baseUrl, prefix, headers = {}) => {
    try {
        const response = await axios.delete(
            formatUrl({ requestUrl: req.url, baseUrl, prefix }),
            { headers: { authorization: req.headers.authorization, claims: JSON.stringify(req.user), ...headers }, data: req.body },
        )

        setResponse(res, response)
    } catch (error) {
        const err = errorResponse(error)
        return res.status(err.statusCode).json(err.error)
    }
}

const patch = async (req, res, baseUrl, prefix, headers) => {
    try {
        const response = await axios.patch(
            formatUrl({ requestUrl: req.url, baseUrl, prefix }),
            req.body,
            { headers: { authorization: req.headers.authorization, claims: JSON.stringify(req.user), ...headers }, },
        )

        setResponse(res, response)
    } catch (error) {
        const err = errorResponse(error)
        return res.status(err.statusCode).json(err.error)
    }
}

const pushKafka = async (req, res, topic) => {
    try {
        const data = req.body

        const producer = kafka.producer()
        await producer.connect()

        const jsonData = JSON.stringify(data)

        await producer.send({
            topic: topic,
            messages: [{ value: jsonData }],
        })

        await producer.disconnect()
        res.status(200).json({ message: 'OK', data: data });
    } catch (error) {
        console.error('Error pushing data:', error);
        if (error instanceof SyntaxError) {
            res.status(400).json({ error: 'Invalid JSON' });
        } else {
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }

}

module.exports = {
    get,
    post,
    put,
    del,
    patch,
    pushKafka,
}