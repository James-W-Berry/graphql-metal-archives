const express = require('express')
const graphqlHTTP = require('express-graphql')
const cors = require('cors')
const schema = require('./schema')

const app = express()
const port = 4000

app.use(cors())
app.use('/graphql', (req, res) => {
    graphqlHTTP({
      schema: schema,
      pretty: true,
      graphiql: true,
    })(req, res)
});

app.listen(port)
console.log(`GraphQL server listening at port ${port}`)