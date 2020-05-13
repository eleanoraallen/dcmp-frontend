const { gql } = require('apollo-server');

const typeDefs = gql`
    #A map
    type Map {
        #the ID of this map
        id: ID!
        #The date on which this map was created
        createdAt: String!
        #The name of this map
        mapName: String
        #The description for this map
        description: String
        #The creator of this map
        creatorName: String
    }

    #Filter which can be applyed to mapList
    input MapListQuery {
        #name of the map
        mapName: String
        #name of the creator of the map
        creatorName: String
        #The date of the map's creaton
        date: String
    }

     #A point on a map
     type Point {
        #the ID of this point
        id: ID!
        #The ID of the map with which the point is associated
        mapId: ID!
        #The name of this point
        name: String!
        #An array of ints of length 2 giving the [x, y] coordinates of the point
        coordinates: [Int!]!
        #The description for this point
        description: String
        #The category of this point
        category: Categry
        #string to describe categories filled in as "other"
        otherText: String
        #The creator of this point
        creatorName: String
    }

    #Filter which can be applyed pointList
    input PointListQuery {
        #The ID of the point's map
        mapID: ID
        #name of the creator of the map
        creatorName: String
        #the category of the point
        category: Categry
    }

    # Categry of points
    enum Categry {
        ART
        BUSINESS
        PUBLICSPACE
        RESIDENCE
        SCHOOL
        WORKPLACE
        OTHER
    }

    type Query {
        #Given a map's id, returns that map
        map(id: ID!): Map

        #Get the list maps of a given size starting at a given page
        mapList(
            #query object for more specific searches
            query: MapListQuery
            #The number of maps to return (default 10)
            size: Int
            #The index of the page to return (default 0)
            page: Int
        ): [Map]

        #Given a points's id, returns that point
        point(id: ID!): Point

        #Get the list maps of a given size starting at a given page
        pointList(
            #query object for more specific searches
            query: PointListQuery
            #The number of points to return (default 10)
            size: Int
            #The index of the page to return (default 0)
            page: Int
        ): [Point]
    }

    type Mutation {
        #Used to add a map. Returns the ID of the added map
        addMap(
            #The name of this map
            mapName: String
            #The description for this map
            description: String           
            #The creator of this map
            creatorName: String
        ): ID

        # used to add a point. Returns the ID of the added point
        addPoint(
            #The ID of the point's map
            mapId: ID!
            #the name of this point
            name: String!
            #An array of ints of length 2 giving the [x, y] coordinates of the point
            coordinates: [Int!]!
            #The description for this point
            description: String
            #The category of this point
            category: String
            #The creator of this point
            creatorName: String

        ): ID
    }
`;

module.exports = typeDefs;