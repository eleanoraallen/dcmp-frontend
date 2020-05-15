const mongoose = require('mongoose');
const db = mongoose.connection;
const Map = require('./mongo-schema/map');
const Point = require('./mongo-schema/point');
const url = require('./authorization');

// bind a function to perform when the database has been opened
db.once('open', function () {
    console.log("Connected to DB!");
});

// close connection on close
process.on('SIGINT', function () {
    mongoose.connection.close(function () {
        console.log('DB connection closed by Node process ending');
        process.exit(0);
    });
});

// connect
mongoose.connect(url, { useNewUrlParser: true });

// resolvers
const resolvers = {
    Query: {
        // returns a map with given id
        map(obj, args) {
            return (
                Map.findOne({ _id: args.id }).then(
                    result => {
                        try {
                            const m = {
                                id: result._id,
                                createdAt: result.createdAt.toUTCString(),
                                mapName: result.mapName,
                                description: result.description,
                                creatorName: result.creatorName,
                            };
                            return m;
                        } catch (err) {
                            return (err);
                        }
                    }
                ));
        },
        // returns a list of maps conforming to given parameters
        mapList(obj, args) {
            let limit = 10;
            if (args.size !== undefined) {
                limit = args.size;
            }
            let skip = 0;
            if (args.page !== undefined) {
                skip = limit * args.page;
            }
            if (args.query == undefined) {
                return getMaps(skip, limit, undefined);
            } else if (args.query.random !== undefined && args.query.random) {
                return (
                    Map.aggregate([{ $sample: { size: limit } }]).then(
                        result => {
                            try {
                                const l = result.map(x => {
                                    const m = {
                                        id: x._id,
                                        createdAt: x.createdAt.toUTCString(),
                                        mapName: x.mapName,
                                        description: x.description,
                                        creatorName: x.creatorName,
                                    };
                                    return m;
                                });
                                return l;
                            } catch (err) {
                                return (err);
                            }
                        })
                );
            } else {
                let id = args.query.id;
                let mapName = args.query.mapName;
                let creatorName = args.query.creatorName;
                let startDate = args.query.startDate;
                let endDate = args.query.endDate;
                let operation = args.query.operation;
                return getMaps(skip, limit, pushMapFields(id, mapName, creatorName, startDate, endDate, operation));

            }
        },
        // returns the point with the given id
        point(obj, args) {
            return (
                Point.findOne({ _id: args.id }).then(
                    result => {
                        try {
                            const p = {
                                id: result._id,
                                mapId: result.mapId,
                                name: result.name,
                                coordinates: { x: result.x, y: result.y },
                                category: result.category,
                                otherText: result.otherText,
                                description: result.description,
                                creatorName: result.creatorName,
                            };
                            return p;
                        } catch (err) {
                            return (err);
                        }
                    }
                ));
        },
        // returns a list of maps conforming to given parameters
        pointList(obj, args) {
            let limit = 10;
            if (args.size !== undefined) {
                limit = args.size;
            }
            let skip = 0;
            if (args.page !== undefined) {
                skip = limit * args.page;
            }
            if (args.query == undefined) {
                return getPoints(skip, limit, undefined);
            } else if (args.query.random !== undefined && args.query.random) {
                return (
                    Point.aggregate([{ $sample: { size: limit } }]).then(
                        result => {
                            try {
                                const l = result.map(x => {
                                    const m = {
                                        id: x._id,
                                        mapId: x.mapId,
                                        name: x.name,
                                        coordinates: { x: x.x, y: x.y },
                                        description: x.description,
                                        category: x.category,
                                        otherText: x.otherText,
                                        creatorName: x.creatorName,
                                    };
                                    return m;
                                });
                                return l;
                            } catch (err) {
                                return (err);
                            }
                        }
                    )
                );
            } else {
                let id = args.query.id;
                let mapId = args.query.mapId;
                let coordinates = args.query.coordinates;
                let within = args.query.within;
                let creatorName = args.query.creatorName;
                let category = args.query.category;
                let otherText = args.query.otherText;
                let operation = args.query.operation;
                return getPoints(skip, limit, pushPointFields(id, mapId, coordinates, within, creatorName, category, otherText, operation));
            }
        },
    },

    Mutation: {
        // adds a map
        addMap: (obj, args, context) => {
            if (!context.editing) return `Hi! Please don't add stuff this way. Thanks!`;
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
            return (
                m.save().then(
                    result => {
                        try {
                            return result._id;
                        } catch (err) {
                            return err;
                        }
                    }
                )
            );
        },
        // adds a point
        addPoint: (obj, args, context) => {
            if (!context.editing) return `Hi! Please don't add stuff this way. Thanks!`;
            const p = new Point();
            p.mapId = args.mapId;
            p.name = args.name;
            p.x = args.coordinates[0];
            p.y = args.coordinates[1];
            if (args.description !== undefined) {
                p.description = args.description;
            }
            if (args.category !== undefined) {
                p.category = args.category;
            }
            if (args.otherText !== undefined) {
                p.otherText = args.otherText;
            }
            if (args.creatorName !== undefined) {
                p.creatorName = args.creatorName;
            }
            return (
                p.save().then(
                    result => {
                        try {
                            return result._id;
                        } catch (err) {
                            return err;
                        }
                    }
                )
            );
        },
    }
};


/**
 * Gets maps
 * @param {*} skip 
 * @param {*} limit 
 * @param {*} query 
 */
function getMaps(skip, limit, query) {
    if (query == undefined) {
        return (
            Map.find().skip(skip).limit(limit).then(
                result => {
                    try {
                        const l = result.map(x => {
                            const m = {
                                id: x._id,
                                createdAt: x.createdAt.toUTCString(),
                                mapName: x.mapName,
                                description: x.description,
                                creatorName: x.creatorName,
                            };
                            return m;
                        });
                        return l;
                    } catch (err) {
                        return (err);
                    }
                }
            ));
    } else {
        return (
            Map.find(query).skip(skip).limit(limit).then(
                result => {
                    try {
                        const l = result.map(x => {
                            const m = {
                                id: x._id,
                                createdAt: x.createdAt.toUTCString(),
                                mapName: x.mapName,
                                description: x.description,
                                creatorName: x.creatorName,
                            };
                            return m;
                        });
                        return l;
                    } catch (err) {
                        return (err);
                    }
                }
            )
        );
    }
}

/**
 * 
 * @param {*} id 
 * @param {*} mapName 
 * @param {*} creatorName 
 * @param {*} startDate 
 * @param {*} endDate 
 * @param {*} operation
 */
function pushMapFields(id, mapName, creatorName, startDate, endDate, operation) {
    operation = String(operation);
    let query;
    if (operation == "OR") {
        query = { $or: [] }
        if (id !== undefined) {
            query.$or.push({ _id: id });
        }
        if (mapName !== undefined) {
            query.$or.push({ mapName: mapName });
        }
        if (creatorName !== undefined) {
            query.$or.push({ creatorName: creatorName });
        }
        if (startDate !== undefined) {
            query.$or.push({ createdAt: { $gt: new Date(startDate) } });
        }
        if (endDate !== undefined) {
            query.$or.push({ createdAt: { $lt: new Date(endDate) } });
        }
        return query;
    } else if (operation == "NOR") {
        query = { $nor: [] }
        if (id !== undefined) {
            query.$nor.push({ _id: id });
        }
        if (mapName !== undefined) {
            query.$nor.push({ mapName: mapName });
        }
        if (creatorName !== undefined) {
            query.$nor.push({ creatorName: creatorName });
        }
        if (startDate !== undefined) {
            query.$nor.push({ createdAt: { $gt: new Date(startDate) } });
        }
        if (endDate !== undefined) {
            query.$nor.push({ createdAt: { $lt: new Date(endDate) } });
        }
        return query;
    } else {
        query = { $and: [] }
        if (id !== undefined) {
            query.$and.push({ _id: id });
        }
        if (mapName !== undefined) {
            query.$and.push({ mapName: mapName });
        }
        if (creatorName !== undefined) {
            query.$and.push({ creatorName: creatorName });
        }
        if (startDate !== undefined) {
            query.$and.push({ createdAt: { $gt: new Date(startDate) } });
        }
        if (endDate !== undefined) {
            query.$and.push({ createdAt: { $lt: new Date(endDate) } });
        }
        return query;
    }
}

/**
 * Gets points
 * @param {*} skip 
 * @param {*} limit 
 * @param {*} query 
 */
function getPoints(skip, limit, query) {
    if (query == undefined) {
        return (
            Point.find().skip(skip).limit(limit).then(
                result => {
                    try {
                        const l = result.map(x => {
                            const m = {
                                id: x._id,
                                mapId: x.mapId,
                                name: x.name,
                                coordinates: { x: x.x, y: x.y },
                                description: x.description,
                                category: x.category,
                                otherText: x.otherText,
                                creatorName: x.creatorName,
                            };
                            return m;
                        });
                        return l;
                    } catch (err) {
                        return (err);
                    }
                }
            )
        );
    } else {
        return (
            Point.find(query).skip(skip).limit(limit).then(
                result => {
                    try {
                        const l = result.map(x => {
                            const m = {
                                id: x._id,
                                mapId: x.mapId,
                                name: x.name,
                                coordinates: { x: x.x, y: x.y },
                                description: x.description,
                                category: x.category,
                                otherText: x.otherText,
                                creatorName: x.creatorName,
                            };
                            return m;
                        });
                        return l;
                    } catch (err) {
                        return (err);
                    }
                }
            )
        );
    }
}

/**
 * pushes point fields
 * @param {*} id 
 * @param {*} mapId 
 * @param {*} coordinates
 * @param {*} within 
 * @param {*} creatorName 
 * @param {*} category 
 * @param {*} operation 
 */
function pushPointFields(id, mapId, coordinates, within, creatorName, category, otherText, operation) {
    operation = String(operation);
    let query;
    if (operation == "OR") {
        query = { $or: [] }
        if (id !== undefined) {
            query.$or.push({ _id: id });
        }
        if (mapId !== undefined) {
            query.$or.push({ mapId: mapId });
        }
        if (within !== undefined) {
            const minX = coordinates[0] - within;
            const maxX = coordinates[0] + within;
            const minY = coordinates[1] - within;
            const maxY = coordinates[1] + within
            query.$or.push({
                $and: [{ x: { $gt: minX, $lt: maxX } },
                { y: { $gt: minY, $lt: maxY } }]
            });

        } else if (coordinates !== undefined) {
            query.$or.push({ $and: [{ x: coordinates[0] }, { y: coordinates[1] }] });
        }
        if (creatorName !== undefined) {
            query.$or.push({ creatorName: creatorName });
        }
        if (category !== undefined) {
            query.$or.push({ category: category });
        }
        if (otherText !== undefined) {
            query.$or.push({ otherText: otherText });
        }
        return query;
    } else if (operation == "NOR") {
        query = { $nor: [] }
        if (id !== undefined) {
            query.$nor.push({ _id: id });
        }
        if (mapId !== undefined) {
            query.$nor.push({ mapId: mapId });
        }
        if (within !== undefined) {
            const minX = coordinates[0] - within;
            const maxX = coordinates[0] + within;
            const minY = coordinates[1] - within;
            const maxY = coordinates[1] + within
            let x = minX;
            let y = minY;
            query.$nor.push({
                $and: [{ x: { $gt: minX, $lt: maxX } },
                { y: { $gt: minY, $lt: maxY } }]
            });

        } else if (coordinates !== undefined) {
            query.$nor.push({ $and: [{ x: coordinates[0] }, { y: coordinates[1] }] });
        }
        if (creatorName !== undefined) {
            query.$nor.push({ creatorName: creatorName });
        }
        if (category !== undefined) {
            query.$nor.push({ category: category });
        }
        if (otherText !== undefined) {
            query.$nor.push({ otherText: otherText });
        }
        return query;
    } else {
        query = { $and: [] }
        if (id !== undefined) {
            query.$and.push({ _id: id });
        }
        if (mapId !== undefined) {
            query.$and.push({ mapId: mapId });
        }
        if (within !== undefined) {
            const minX = coordinates[0] - within;
            const maxX = coordinates[0] + within;
            const minY = coordinates[1] - within;
            const maxY = coordinates[1] + within;
            query.$and.push({
                $and: [{ x: { $gt: minX, $lt: maxX } },
                { y: { $gt: minY, $lt: maxY } }]
            });

        } else if (coordinates !== undefined) {
            query.$and.push({ $and: [{ x: coordinates[0] }, { y: coordinates[1] }] });
        }
        if (creatorName !== undefined) {
            query.$and.push({ creatorName: creatorName });
        }
        if (category !== undefined) {
            query.$and.push({ category: category });
        }
        if (otherText !== undefined) {
            query.$and.push({ otherText: otherText });
        }
        return query;
    }
}

module.exports = resolvers;