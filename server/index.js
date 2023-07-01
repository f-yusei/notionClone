const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');



const app = express();
const PORT = 5001;
require('dotenv').config();
app.use(
    cors({
        origin: "http://localhost:3000",
    })
);

app.use(express.json());
app.use("/api/v1", require("./src/v1/routes"));

try {
    mongoose.connect(process.env.MONGODB_URL)
    console.log("DBと接続中");
} catch (error) {
    console.log(error);
}





app.listen(PORT, () => {
    console.log("ローカルサーバー起動中...");
});
