import axios from "axios";
import api from "../utils/api";

const baseUrl = process.env.HOUSEKEEPER_SERVICE_URI
const prefix = "/admin/"

const get = (ctx) => {
    return api.get(ctx, baseUrl, prefix)
}

const post = (ctx) => {
    return api.post(ctx, baseUrl, prefix)
}

const put = (ctx) => {
    return api.put(ctx, baseUrl, prefix)
}

const del = (ctx) => {
    return api.del(ctx, baseUrl, prefix)
}

export default {
    get,
    post,
    put,
    del,
}