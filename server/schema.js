const fetch = require('node-fetch')
import { GraphQLSchema, GraphQLObjectType, GraphQLString } from 'graphql'
import { HomePageType, BandPageType, ReviewPageType } from './resolvers'

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
                resolve: async (res, args, context) => {
                    return fetch(
                       `https://www.metal-archives.com/bands/${args.band}`
                    )  
                }
            },
            ReviewPage: {
                type: ReviewPageType,
                args: {
                    url: { type: GraphQLString }
                },
                resolve: async (res, args, context) => {
                    return fetch(args.url)
                }
            }
        }
    }),
})