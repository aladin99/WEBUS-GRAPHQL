// import { ApolloServer } from '@apollo/server';
// import { startStandaloneServer } from '@apollo/server/standalone';

const { ApolloServer } = require('@apollo/server')
const { startStandaloneServer } = require('@apollo/server/standalone')
const mongoose = require('mongoose');

const bus = require('./models/bus')

const typeDefs = `
    type Bus {
        _id: String
        name: String
        number: Int
        capacity: Int
        from: String
        to: String
        journeyDate: String
        departure: String
        arrival: String
        type: String
        price: String
        seatsBooked: [Int]
        status: String
    }

    input NewBus {
        name: String
        number: Int
        capacity: Int
        from: String
        to: String
        journeyDate: String
        departure: String
        arrival: String
        type: String
        price: String
        seatsBooked: [Int]
        status: String
    }

    type Query {
        buses: [Bus]
        bus(id: String!): Bus
    }

    type Mutation {
        createBus(newBus: NewBus): Bus
        deleteBus(id: String): Bus
        updateBus(id: String, updatedBus: NewBus): Bus
    }
`

const resolvers = {
    Query: {
        async buses() {
           return await bus.find()
        },
        async bus(parent, args, contextValue, info) {
            return await bus.findById(args.id)
        }
    },
    Mutation: {
        async createBus(parent, args, contextValue, info) {
            return await bus.create(args.newBus)
        },
        async deleteBus(parent, args, contextValue, info) {
            return await bus.findOneAndDelete({ _id: args.id })
        },
        async updateBus(parent, args, contextValue, info) {
            return await bus.findOneAndUpdate({ _id: args.id }, args.updatedBus)
        }
    }
}

const server = new ApolloServer({
    typeDefs,
    resolvers,
});


// povezana baza sa .env fajlom
mongoose.connect("mongodb+srv://adminwebus:Kjkszpj123@cluster0.kj7dvhz.mongodb.net/WEBUS");

// proveravam da li je konekcija uspela sa bazom

const db = mongoose.connection;

// proverevam da li je konektovana baza
db.on("connected", () => {
    console.log("Mongo baza je uspešno konektovana.");

    async function main() {
        const { url } = await startStandaloneServer(server, {
            listen: { port: 4000 },
        });
        console.log(`🚀  Server ready at: ${url}`);
    }
    
    main()
});

db.on("error", () => {
    console.log("Mongo baza nije povezana.");
});

