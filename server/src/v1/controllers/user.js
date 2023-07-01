const User = require('../models/user');
const JWT = require('jsonwebtoken');
const CryptoJS = require('crypto-js');
require('dotenv').config();

exports.register = async (req, res) => {

    //パスワードうけとり
    const password = req.body.password;

    try {
        //パスワードの暗号化
        req.body.password = CryptoJS.AES.encrypt(password, process.env.SECRET_KEY);
        //ユーザー登録
        const user = await User.create(req.body);
        //JWTの発行
        const token = JWT.sign({ id: user._id }, process.env.TOKEN_SECRET_KEY, {
            expiresIn: "24h",
        });
        return res.status(200).json({ user, token });
    } catch (err) {
        return res.status(500).json(err);
    }
}

//ユーザーログインAPI
exports.login = async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await User.findOne({ username: username });
        if (!user) {
            return res.status(401).json({
                errors: [{
                    param: "username",
                    msg: "ユーザー名が無効です"
                }]
            })
        }
        //パスワードの照合
        const descryptedPassword = CryptoJS.AES.decrypt(
            user.password,
            process.env.SECRET_KEY
        ).toString(CryptoJS.enc.Utf8);
        if (descryptedPassword !== password) {
            return res.status(401).json({
                errors: [{
                    param: "password",
                    msg: "パスワードが無効です"
                }]
            })
        }

        //JWTの発行
        const token = JWT.sign({ id: user._id }, process.env.TOKEN_SECRET_KEY, {
            expiresIn: "24h",
        });
        return res.status(201).json({ user, token });
    } catch (err) {
        return res.status(500).json(err);
    }
}