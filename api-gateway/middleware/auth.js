const jwt = require("jsonwebtoken");
var assert = require("assert");

const admin = "admin"
const customer = "customer"
const housekeeper = "housekeeper"
const appointment = "appointment"
const allRoles = [admin, customer, housekeeper]

function getKey(service) {
  const makeStruct = (srv, secret) => {
    return {
      service: srv,
      secret: secret
    }
  }
  switch (service) {
    case admin: {
      return makeStruct(service, process.env.ADMIN_SECRET)
    }
    case customer: {
      return makeStruct(service, process.env.CUSTOMER_SECRET)
    }
    case housekeeper: {
      return makeStruct(service, process.env.HOUSEKEEPER_SECRET)
    }
    case appointment: {
      return makeStruct(service, process.env.APPOINTMENT_SECRET)
    }
  }
}

const protected = (...services) => {
  return (req, res, next) => {
    const authHeader = req.headers["authorization"];
    console.log("authHeader", authHeader);
    const token = authHeader && authHeader.split(" ")[1];
    console.log("token", token);
    if (token == null) {
      console.log("token is null");
      return res.sendStatus(401);
    }

    const verificationResult = [];
    const promises = services.map(getKey).map(e => {
      return new Promise((resolve, reject) => {
        jwt.verify(token, e.secret, (err, user) => {
          if (err) {
            verificationResult.push({ service: e.service, success: false, error: err });
            resolve();
          } else {
            if (user.role !== e.service) {
              verificationResult.push({
                service: e.service,
                success: false,
                error: `MISMATCH user role: ${user.role}, service:${e.service}`
              });
            } else {
              req.user = user;
              verificationResult.push({ service: e.service, success: true, user: user });
            }
            resolve();
          }
        });
      });
    });

    Promise.all(promises).then(() => {
      console.log(verificationResult);
      if (!verificationResult.some(v => v.success)) {
        console.log("Unauthenticated");
        return res.sendStatus(401);
      }
      next();
    });

  };
};

/*
allows: {
    role: stringEnum[[ admin, customer, housekeeper ]],
    idParam: string
}
*/
const authorized = (allows) => {
  return (req, res, next) => {
    // if (!req.user || req.user == []) return res.status(403).send("Unauthorized")
    // if (!roles.includes("all") && !roles.includes(req.user.role)) return res.status(403).send("Unauthorized")
    // if (selfOnly !== null && req.params[restrictedIdParam]!=req.user.uuid)

    // if (req.user.role && (roles.includes("all") || roles.includes(req.user.role))) {
    //     if (!restrictedIdParam) next()
    //     else if (req.params && req.params[restrictedIdParam] == req.user.uuid) next()
    // }
    if (req.user?.role) {
      if (allows.map((a) => a.role == "all").includes(true)) return next();
      const mapped = allows.map((a) => {
        if (a.role == req.user.role) {
          if (!a.idParam) return true;
          if (req.params[a.idParam] === req.user.uuid) {
            return true;
          }
        }
        return false;
      });
      if (mapped.includes(true)) return next();
      return res.sendStatus(403);
    }
  };
};

module.exports = { protected, authorized, admin, housekeeper, customer, appointment, allRoles };
