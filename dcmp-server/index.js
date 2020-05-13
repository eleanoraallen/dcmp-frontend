const { ApolloServer} = require('apollo-server');
const typeDefs = require('./graphql-schema');
const mongoose = require('mongoose');
const db = mongoose.connection;
const Map = require('./mongo-schema/map');
const Pin = require('./mongo-schema/pin');


// log errors
db.on('error', console.error); 

// bind a function to perform when the database has been opened
db.once('open', function() {
  // perform any queries here, more on this later
  console.log("Connected to DB!");
});

// close connection on close
process.on('SIGINT', function() {
   mongoose.connection.close(function () {
       console.log('DB connection closed by Node process ending');
       process.exit(0);
   });
});

// well this doesn't feel very secure... I mean, it's not an admin account but still... Surely there must be a better way.
const url = 'mongodb+srv://dcmpBackend:QAiONqqUeJP9maud@dcmp-dev-bgfgf.mongodb.net/test?retryWrites=true&w=majority';
mongoose.connect(url, {useNewUrlParser: true});

// resolvers
const resolvers = {
  Query: {
    map(obj, args) {
      return(
        Map.findOne({ _id: args.id }).then(
          result => {
            try {
              const m = {
                id: result._id,
                createdAt: result.createdAt,
                mapName: result.mapName,
                description: result.description,
                creatorName: result.creatorName,
              };
              return m;
            } catch(err) {
              console.log(err);
              return(null);
            }
          }
        ));
      },
  },
  Mutation: {
    addMap: (obj, args) => {
      const m = new Map();
      if (args.mapName !== undefined) {
        m.mapName = args.mapName;
      }
      if (args.description !== undefined) {
        m.description = args.description;
      }
      if (args.creatorName !== undefined) {
        m.creatorName = args.creatorName;
      }
      return(
        m.save().then(
          result => {
            try {
              return result._id;
            } catch(err) {
              console.log(err);
              return null;
            }
          }

        )
      );
    }
  }
};

// create server
const server = new ApolloServer({ typeDefs, resolvers });

// launche server.
server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});





// mapList(query, size, page) {
//   Map.find(function(err, data) {
//     if (err) {
//       console.log(err);
//       console.log("dang");
//     } else {
//       console.log(data);
//       return(data);
//     }   
//   });
// },