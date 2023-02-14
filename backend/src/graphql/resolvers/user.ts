import { CreateUsernameResponse, GraphQLContext } from '../../util/types'

const resolvers = {
	Query: {
		searchUsers: () => {},
	},
	Mutation: {
		createUsername: async (
			_: any,
			args: { username: string },
			context: GraphQLContext
		): Promise<CreateUsernameResponse> => {
			const { username } = args
			const { session, prisma } = context

			if (!session?.user) {
				return {
					error: 'not authoried',
				}
			}
			const { id: userId } = session.user

			try {
				const existingUser = await prisma.user.findUnique({
					where: {
						username,
					},
				})
				if (existingUser) {
					return {
						error: 'User already taken. Try another',
					}
				}
				await prisma.user.update({
					where: {
						id: userId,
					},
					data: {
						username,
					},
				})

				return { succes: true }
			} catch (error: any) {
				console.log('createUsername Error', error)
				return {
					error: error?.message,
				}
			}
		},
	},
}

export default resolvers
