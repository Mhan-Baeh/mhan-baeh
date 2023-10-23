const api = require('../utils/api');

const baseUrl = process.env.APPOINTMENT_URI
// if a request url is http://hostname/example-api/...
// the request will be forwarded to http://{example-api_hostname}/...
// As you can see, the prefix is removed from the url

// Thus, "the predfix should match the route defined in router/router.js"
const prefix = "/appointment-api/" 

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