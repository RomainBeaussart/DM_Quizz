import bcrypt from 'bcryptjs'

export default {
  Query: {
    login: async (parent, args, context, info) => {
      const user = await context.prisma.player({ name: args.data.username })
      if (!user) {
        throw new Error(`No such user found for username: ${args.data.username}`)
      }

      const valid = await bcrypt.compare(args.data.password, user.password)
      if (!valid) {
        throw new Error('Invalid password')
      }

      return {
        id: user.id,
        name: user.name
      }
    }
  },
  Mutation: {

  }
}
