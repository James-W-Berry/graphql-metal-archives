const fetch = require('node-fetch')
import { GraphQLSchema, GraphQLObjectType, GraphQLString } from 'graphql'
import { HomePageType, BandPageType } from './resolvers'

module.exports = new GraphQLSchema({
    query: new GraphQLObjectType({
        name: 'Query',

        fields: {
            HomePage: {
                type: HomePageType,
                resolve: () => fetch(
                    `https://www.metal-archives.com/`
                )
            },
            BandPage: {
                type: BandPageType,
                args: {
                    band: { type: GraphQLString }
                },
                resolve: () => fetch(
                    `https://www.metal-archives.com/bands/${band}`
                )
            }
        }
    }),
})