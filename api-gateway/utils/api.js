const axios = require('axios');

formatUrl = ({ requestUrl, baseUrl, prefix = '' }) => {
	const path = requestUrl.replace(prefix, '')
	return `${baseUrl}${path}`
}

const errorResponse = (error) => {
	const statusCode = error.response?.status

	if (error.response?.data) {
		const res = error.response.data

		return { error: res.error ?? res.message ?? res.info ?? res, statusCode }
	} else {
		return { error: (error.message)? error.message : error, statusCode : (statusCode)? statusCode : 500}
	}
}

const get = async (req, res, baseUrl, prefix, headers = {}) => {
    try {
        const { data } = await axios.get(formatUrl({ requestUrl: req.url, baseUrl, prefix }), {
            headers: { authorization: req.headers.authorization, ...headers },
        })

        return res.status(200).json(data)
    } catch (error) {
		const err = errorResponse(error)
        return res.status(err.statusCode).json(err.error)
    }
}

const post = async (req, res, baseUrl, prefix, headers = {}, ) => {
	try {
		const { data } = await axios.post(
			formatUrl({ requestUrl: req.url, baseUrl, prefix }),
			req.body,
			{ headers: { authorization: req.headers.authorization, ...headers } },
		)

        return res.status(200).json(data)
    } catch (error) {
		const err = errorResponse(error)
        return res.status(err.statusCode).json(err.error)
    }
}

const put = async (req, res, baseUrl, prefix, headers = {}) => {
	try {
		const { data } = await axios.put(
			formatUrl({ requestUrl: req.url, baseUrl, prefix }),
			req.body,
			{ headers: { authorization: req.headers.authorization, ...headers } },
		)

        return res.status(200).json(data)
    } catch (error) {
		const err = errorResponse(error)
        return res.status(err.statusCode).json(err.error)
    }
}

const del = async (req, res, baseUrl, prefix, headers = {}) => {
	try {
		const { data } = await axios.delete(
			formatUrl({ requestUrl: req.url, baseUrl, prefix }),
			{ headers: { authorization: req.headers.authorization, ...headers }, data: req.body },
		)

        return res.status(200).json(data)
    } catch (error) {
		const err = errorResponse(error)
        return res.status(err.statusCode).json(err.error)
    }
}

module.exports = {
    get,
    post,
    put,
    del
}