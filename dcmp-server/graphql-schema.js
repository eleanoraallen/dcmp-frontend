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
        #returns all maps with a 
        id: ID
        #returns all maps with a given map name
        mapName: String
        #Returns all maps with a given creator name
        creatorName: String
        #Returns all maps created after the given date
        startDate: String
        #Returns all maps created before the given date
        endDate: String
        #search operation to preform w/ fields (default AND)
        operation: Operation
        # set true to retrieve a psuedo-random selection of map (note: overides all other params except size, may return duplicate maps)
        random: Boolean
    }

     #A point on a map
     type Point {
        #the ID of this point
        id: ID!
        #The ID of the map with which the point is associated
        mapId: ID!
        #The name of this point
        name: String!
        #the coordinates of the point
        coordinates: Coordinates!
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
        # the ID of a point
        id: ID
        #The ID of the point's map
        mapID: ID
        # coordinates of the point
        coordinates: [Int!]
        # set to retrieve all points within this distance of a given set of cordinates exclusive
        within: Int
        #name of the creator of the map
        creatorName: String
        #the category of the point
        category: Categry
        #search operation to preform w/ fields (default AND)
        operation: Operation
        # set true to retrieve a psuedo-random selection of points (note: overides all other params except size, may return duplicate points)
        random: Boolean
    }

    # stores the coordinates of a point
    type Coordinates {
        # the x coordinate of the point
        x: Int!
        # the y coordinate of the point
        y: Int!
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

    # Search operations
    enum Operation {
        AND
        OR
        NOR
    }

    type Query {
        #Given a map's id, returns that map
        map(id: ID!): Map

        #Get the list maps of a given size starting at a given page conforming to a given filter
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

        #Get the list points of a given size starting at a given page conforming to a given filter
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
            category: Categry
            # text to describe the category if it isn't one of the enumerated categories
            otherText: String
            #The creator of this point
            creatorName: String
        ): ID
    }
`;

module.exports = typeDefs;