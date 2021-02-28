import { ApolloServer } from 'apollo-server'
import { loadTypeSchema } from './utils/schema'
import { merge } from 'lodash'
import config from './config'
import { connect } from './db'
import product from './types/product/product.resolvers'
import coupon from './types/coupon/coupon.resolvers'
import user from './types/user/user.resolvers'

const types = ['product', 'coupon', 'user']

export const start = async () => {
  const rootSchema = `
    type Cat {
      name: String,
      age: Int,
      owner: Owner!
    }

    type Owner {
      name: String,
      cat: Cat!
    }

    type Query {
      cat(name: String!): Cat!
      owner(name: String!): Owner!
    }

    schema {
      query: Query
    }
  `
  const schemaTypes = await Promise.all(types.map(loadTypeSchema))

  const server = new ApolloServer({
    typeDefs: [rootSchema],
    resolvers: {
      Query: {
        cat(_, args) {
          console.log('in cat query resolver')
          return {}
        },
        owner(_, args) {
          console.log('in owner query resolver')
          return {}
        }
      },
      Cat: {
        name() {
          console.log('in cat name')
          return 'Daryl'
        },
        age() {
          return 2
        },
        owner() {
          return {}
        }
      },
      Owner: {
        name() {
          console.log('in owner name')
          return 'Scott'
        },
        cat() {
          return {}
        }
      }
    },
    context({ req }) {
      // use the authenticate function from utils to auth req, its Async!
      return { user: null }
    }
  })

  await connect(config.dbUrl)
  const { url } = await server.listen({ port: config.port })

  console.log(`GQL server ready at ${url}`)
}
