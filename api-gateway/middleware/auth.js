const jwt = require('jsonwebtoken');
var assert = require('assert');

const protected = (secretKey) => {
    return (req, res, next) => {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];
        if (token == null) return res.sendStatus(401);
    
        jwt.verify(token, secretKey, (err, user) => {
            if (err) return res.sendStatus(401);
            req.user = user;
            next();
        });
    };
}

/*
allows: {
    role: stringEnum[[ admin, customer, housekeeper ]],
    idParam: string
}
*/ 
const authorized = (allows, restrictedIdParam=null) => {
    return (req, res, next) => {
        // if (!req.user || req.user == []) return res.status(403).send("Unauthorized")
        // if (!roles.includes("all") && !roles.includes(req.user.role)) return res.status(403).send("Unauthorized")
        // if (selfOnly !== null && req.params[restrictedIdParam]!=req.user.uuid)

        // if (req.user.role && (roles.includes("all") || roles.includes(req.user.role))) {
        //     if (!restrictedIdParam) next()
        //     else if (req.params && req.params[restrictedIdParam] == req.user.uuid) next()
        // }
        if (req.user?.role) {
            if (allows.map(a => a.role == "all").includes(true)) next()
            const mapped = allows.map(a => {
            if (a.role == req.user.role) {
                if (!a.idParam) return true
                if (req.params.idParam === req.user.uuid) {
                    return true
                }
            }
            return false
        })
        if (mapped.includes(true)) next()
        return res.sendStatus(403)
}

    }
}

module.exports = { protected, authorized }