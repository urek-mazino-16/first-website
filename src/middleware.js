const jwt = require('jsonwebtoken');
const secret="209513c1e17a8318c25987557f00f149d133ae0ad6a607db953400c861fc4907";

function authenticateToken(req, res, next) {
    const token = req.cookies.token;
    if (!token) {
        return res.status(401).send(`
            <script>
                alert("Access denied. Token missing.");
                window.location.href = "/";
            </script>
        `);
    }

    try {
        const user = jwt.verify(token, secret);
        req.user = user;
        next();
    } catch (error) {
        return res.status(403).send(`
            <script>
                alert("Access denied. Invalid token.");
                window.location.href = "/";
            </script>
        `);
    }
}

module.exports = authenticateToken;
