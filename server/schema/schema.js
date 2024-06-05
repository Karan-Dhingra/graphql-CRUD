const { GraphQLObjectType, GraphQLID, GraphQLString, GraphQLSchema, GraphQLList, GraphQLNonNull, GraphQLEnumType, graphqlSync } = require('graphql')
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

//   Mutation
const Mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        // Add Client
        addClient: {
            type: clientType,
            args: {
                name: { type: GraphQLNonNull(GraphQLString) },
                email: { type: GraphQLNonNull(GraphQLString) },
                phone: { type: GraphQLNonNull(GraphQLString) },
            },
            resolve(parent, args) {
                const client = new Client({
                    name: args.name,
                    email: args.email,
                    phone: args.phone,
                });
                // Simmilar to Client.create({...})

                return client.save();
            }
        },
        // Delete Client
        deleteClient: {
            type: clientType,
            args: {
                id: { type: GraphQLNonNull(GraphQLID) },
            },
            async resolve(parent, args) {
                console.log(args.id);
                return await Client.deleteOne({_id: args.id})
            }
        },

        // Add Project
        addProject: {
            type: projectType,
            args: {
                name: { type: GraphQLNonNull(GraphQLString) },
                description: { type: GraphQLNonNull(GraphQLString) },
                status: { type: new GraphQLEnumType({
                        name: "ProjectStatus",
                        values: {
                            'new' : { value: 'Not Started' },
                            'progress' : { value: 'In Progress' },
                            'completed' : { value: 'Completed' },
                        }
                    }),
                    defaultValue: 'Not Started'
                },
                clientId: { type: GraphQLNonNull(GraphQLID) },
            },
            async resolve(parent, args) {
                const project = await Project.create({
                    name: args.name,
                    description: args.description,
                    status: args.status,
                    clientId: args.clientId
                })
                
                await project.save();
                return project;
            }
        },
        // Delete Project
        deleteProject: {
            type: projectType,
            args: {
                id: { type: GraphQLNonNull(GraphQLID) },
            },
            async resolve(parent, args) {
                console.log(args.id);
                return await Project.deleteOne({_id: args.id})
            }
        },
        // Update Project
        updateProject: {
            type: projectType,
            args: {
                id: { type: GraphQLNonNull(GraphQLID) },
                name: { type: GraphQLString },
                description: { type: GraphQLString },
                status: { type: new GraphQLEnumType({
                        name: "ProjectStatusUpdate",
                        values: {
                            'new' : { value: 'Not Started' },
                            'progress' : { value: 'In Progress' },
                            'completed' : { value: 'Completed' },
                        }
                    }),
                    defaultValue: 'Not Started'
                },
            },
            async resolve(parent, args) {
                return await Project.findByIdAndUpdate(
                    args.id,
                    {
                        name: args.name,
                        description: args.description,
                        status: args.status,
                    },
                    { new: true }
                )
            }
        }
    }
})

module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation: Mutation
})
