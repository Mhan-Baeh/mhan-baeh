const express = require('express');
function register(app, prefix, router) {
    app.use(prefix, router)
}