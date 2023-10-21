const api = require('../utils/api');

const baseUrl = process.env.EXAMPLE_URI
const prefix = "/example-api/"

const get = async (req, res, next) => {
    await api.get(req, res, baseUrl, prefix)
    next()
}

const post = async (req, res, next) => {
    await api.post(req, res, baseUrl, prefix)
    next()
}

const put = async (req, res, next) => {
    await api.put(req, res, baseUrl, prefix)
    next()
}

const del = async (req, res, next) => {
    await api.del(req, res, baseUrl, prefix)
    next()
}

module.exports =  {
    get,
    post,
    put,
    del,
}