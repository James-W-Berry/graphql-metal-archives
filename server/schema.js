const fetch = require('node-fetch')
import { GraphQLSchema, GraphQLObjectType, GraphQLString } from 'graphql'
import { HomePageType } from './resolvers'

module.exports = new GraphQLSchema({
    query: new GraphQLObjectType({
        name: 'Query',
        description: '...',

        fields: () => ({
            HomePage: {
                type: HomePageType,
                resolve: () => fetch(
                    `https://www.metal-archives.com/`
                )
            }
        })
    })
})