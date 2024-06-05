const { GraphQLObjectType, GraphQLID, GraphQLString, GraphQLSchema, GraphQLList } = require('graphql')
// Mongoose Models
const Client = require('../models/Client.ts')
const Project = require('../models/Project.ts')

// Client Type
const clientType = new GraphQLObjectType({
    name: 'Client',
    fields: () => ({
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        email: { type: GraphQLString },
        phone: { type: GraphQLString },
    })
});

// Project Type
const projectType = new GraphQLObjectType({
    name: 'Project',
    fields: () => ({
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        description: { type: GraphQLString },
        status: { type: GraphQLString },
        client: {
            type: clientType,
            async resolve(parent, args) {
                return await Client.findById(parent.clientId)
            }
        }
    })
});

const RootQuery = new GraphQLObjectType({
    name: "RootQueryType",
    fields: {
        projects: {
            type: new GraphQLList(projectType),
            async resolve(parent, args) {
                return await Project.find();
            }
        },
        project: {
            type: projectType,
            args: { id: { type: GraphQLID } },
            async resolve(parent, args) {
                return await Project.findById(args.id);
            }
        },
        clients: {
            type: new GraphQLList(clientType),
            async resolve(parent, args) {
                return await Client.find();
            }
        },
        client: {
            type: clientType,
            args: { id: { type: GraphQLID } },
            async resolve(parent, args) {
                return await Client.findById(args.id)
            }
        },
    }
});

module.exports = new GraphQLSchema({
    query: RootQuery,
})
