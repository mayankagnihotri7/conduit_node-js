let jwt = require('jsonwebtoken');

// Creating JWT Tokens.
exports.generateJWT = async (user) => {
    try {
    let token = await jwt.sign({ userId: user.id }, 'thisisasecret');
    return token;
    } catch (error) {
     return error;        
    }
}

exports.verifyToken = async (req,res,next) => {
    let token = req.headers.authorization || "";
    try {
        if (token) {
            let payload = await jwt.verify(token, "thisisasecret");
            console.log(payload, 'this is payload!');
            let user = {
                userId: payload.userId,
                token
            }
            req.user = user;
            next();
        } else {
            res.status(401).json({ success: false, error: "Not authenticated" });
        }    
    } catch (error) {
        next(error);
    }
    
}