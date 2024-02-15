
const { MongoClient} = require("mongodb");

const url = process.env.DB_URL;
// db 변수는 늦게 완성이 되는 경우가 많아 잘 안될수도 잇음 그래서 이부분들만 가져오는 것
let connectDB = new MongoClient(url).connect()

module.exports = connectDB