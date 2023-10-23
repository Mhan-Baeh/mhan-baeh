const express = require('express');
const jwt = require('jsonwebtoken');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use((req,res, next) => {
    console.log(req.headers)
    next()
})

const users = ["user1"];
const secretKey = "hehe"; // Replace with your own secret key

const echo = (req, res) => {
    console.log(req.body);
    res.status(201).json(req.body);
};

const success = (req, res) => {
    res.status(502).json({
        success: true
    });
};

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (token == null) return res.sendStatus(401);

    jwt.verify(token, secretKey, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
};

const register = (req, res) => {
    const { username } = req.body;
    if (users.includes(username)) {
        res.status(400).json({ error: "User already exists" });
    } else {
        users.push(username);
        const token = jwt.sign({ username }, secretKey);
        res.status(201).json({ token: token, message: "User registered successfully" });
    }
};

const login = (req, res) => {
    const { username } = req.body;
    if (users.includes(username)) {
        const token = jwt.sign({ username }, secretKey);
        res.status(200).json({ token: token, message: "Login successful" });
    } else {
        res.status(401).json({ error: "User not found" });
    }
};

const logout = (req, res) => {
    res.clearCookie('token');
    res.status(200).json({ message: "Logout successful" });
};

const protectedRoute = (req, res) => {
    res.status(200).json({ message: "You are authorized to access this protected route" });
};

const router = express.Router();
router.get("/", success);
router.post('/a', echo);
router.put('/a/b', echo);
router.delete('/a/c', echo);
router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);
router.get('/protected', protectedRoute);

app.use(router);

app.listen(4000, () => {
    console.log("Server is up");
});
