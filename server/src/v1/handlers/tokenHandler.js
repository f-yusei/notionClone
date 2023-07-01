const JWT = require("jsonwebtoken");
const User = require("../models/user");
//JWTを検証
const tokenDecode = (req) => {
    const bearerHeader = req.headers["authorization"];
    if (bearerHeader) {
        const bearer = bearerHeader.split(" ")[1];
        try {
            const decodedToken = JWT.verify(bearer, process.env.TOKEN_SECRET_KEY);
            return decodedToken;
        } catch {
            return false;
        }
    } else {
        return false;
    }
}


//JWT認証を検証するためのミドルウェアを作成する
exports.verifyToken = async (req, res, next) => {
    const tokenDecoded = tokenDecode(req);
    if (tokenDecoded) {
        //そのJWTと一致するユーザーが存在するか確認する
        const user = await User.findById(tokenDecoded.id);
        if (!user) {
            return res.status(401).json("権限がありません");
        }
        req.user = user;
        next();
    } else {
        return res.status(401).json("権限がありません");
    }
}