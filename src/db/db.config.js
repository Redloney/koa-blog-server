const user = 'redloney'
const pwd = '715life'
const db = 'redloney'
const DB_URL = `mongodb://${user}:${pwd}@localhost:27017/${db}?authSource=admin&readPreference=primary&appname=MongoDB%20Compass&ssl=false`

module.exports = DB_URL
