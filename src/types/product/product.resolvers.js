import { Product } from './product.model'
import { User, roles } from '../user/user.model'
import { AuthenticationError } from 'apollo-server'
import mongoose from 'mongoose'

const productsTypeMatcher = {
  GAMING_PC: 'GamingPc',
  BIKE: 'Bike',
  DRONE: 'Drone'
}

export default {
  Query: {
    products() {
      return Product.find({}).exec()
    },
    product(_, args) {
      return Product.findById(args.id)
        .lean()
        .exec()
    }
  },
  Mutation: {
    newProduct(_, args, ctx) {
      return Product.create({ ...args.input, createdBy: ctx.user._id })
    },
    updateProduct(_, args) {
      return Product.findByIdAndUpdate(args.id, args.input, { new: true })
        .lean()
        .exec()
    },
    removeProduct(_, args) {
      return Product.findByIdAndRemove(args.id)
        .lean()
        .exec()
    }
  },
  Product: {
    __resolveType(product) {},
    createdBy(product) {
      return User.findById(product.createdBy)
        .lean()
        .exec()
    }
    // __resolveType(product) {}
  }
  // NewProductInput: {
  //   name() {
  //     return 'tiara'
  //   },
  //   price() {
  //     return 3.99
  //   },
  //   image() {
  //     return 'shiny-tiara'
  //   },
  //   type() {
  //     return productsTypeMatcher.DRONE
  //   }
  // }
}
