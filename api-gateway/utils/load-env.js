function loadEnv() {
    console.log(`running on ENV=${process.env.ENV}`)
    require("dotenv").config({path: `./config/.env${"."+process.env.ENV}`})
}

module.exports = loadEnv