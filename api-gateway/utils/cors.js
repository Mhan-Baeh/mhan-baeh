function getCORSOption (origin) {
    return {
        origin: origin,
        credentials: true,
    }
}

module.exports = { getCORSOption }