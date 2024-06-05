require('dotenv').config()
const colors = require('colors')
const express = require('express')
const cors = require('cors');
const connectDB = require('./config/db.ts')
const { graphqlHTTP } = require('express-graphql');
const schema = require('./schema/schema.js')
const PORT = process.env.PORT || 4000

const app = express();
connectDB()

app.use(cors())
app.use('/graphql', graphqlHTTP({
    schema: schema,
    graphiql: process.env.NODE_ENV = 'Development' ? true : false
}))

app.listen(PORT, () => {
    console.log(`Server running on ${PORT}`);
})