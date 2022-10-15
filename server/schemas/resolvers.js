const { User, Book } = require('../models');
const { AuthenticationError } = require('apollo-server-express');
const { signToken } = require('../utils/auth');

const resolvers = {
    Query: {
        //get user by username
        me: async (parent, args, context) => {
            if (context.user) {
                const userData = await User.findOne({})
                    .select('-__v -password')
                    .populate('books')
                return userData;
            }
            throw new AuthenticationError('Not logged in!')
        },
    },

    Mutation: {
        //create user
        addUser: async (parent, args) => {
            const user = await User.create(args);
            const token = signToken(user);
            return { token, user };
        },
        //login by using email and password
        login: async (parent, { email, password }) => {
            const user = await User.findOne({ email });
            //if email enter incorrectly, response with a string
            if (!user) {
                throw new AuthenticationError('Your email or password is incorrect!');
            };
            const correctPW = await user.isCorrectPassword(password);
            //if password enter incorrectly, response with a string
            if (!correctPW) {
                throw new AuthenticationError('Your email or password is incorrect!');
            };
        },
        //save book with user
        saveBook: async (parent, args, context) => {
            if (context.user) {
                const updatedUser = await User.findByIdAndUpdate(
                    { _id: context.user._id },
                    { $addToSet: { savedBooks: args.input } },
                    { new: true }
                );
                return updatedUser;
            };
            throw new AuthenticationError('Please logging in!')
        },
        //remove book from user
        removeBook: async (parent, args, context) => {
            if (context.user) {
                const updateUser = await User.findByIdAndUpdate(
                    { _id: context.user._id },
                    { $pull: { savedBooks: { bookId: args.bookId } } },
                    { new: true }
                );
                return updateUser;
            }
            throw new AuthenticationError('Please logging in!')
        }
    }
};

module.exports = resolvers;