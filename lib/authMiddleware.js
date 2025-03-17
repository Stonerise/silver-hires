import jwt from 'jsonwebtoken';

export const authenticateToken = (handler) => async (req, res) => {
    console.log("Incoming Auth Request...");
    const authHeader = req.headers.authorization;
    console.log("Authorization Header:", authHeader);
    if (!authHeader) {
        console.error("No token found in request");
        return res.status(401).json({ msg: "No token, authorization denied" });
    }

    const token = authHeader.split(" ")[1];
    console.log("Extracted Token:", token);
    if (!token) {
        console.error("Token is missin after split");
        return res.status(401).json({ msg: "Token format invalid" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log("Token Decoded:", decoded);
        req.user = decoded.user;
        return handler(req, res);
    }   catch (err) {
        console.error("Token verification failed:", err.message);
        return res.status(401).json({ msg: "Token is not valid" });
    }
};