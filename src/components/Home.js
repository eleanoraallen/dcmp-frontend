import React, { Component } from 'react';
import { ApolloClient } from 'apollo-boost';
import { HttpLink } from 'apollo-link-http';
import { ApolloProvider, Query } from 'react-apollo';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { setContext } from 'apollo-link-context';
import { Token, Endpoint } from '../authorization';
import gql from "graphql-tag";
import '../css/viewmap.css';

// Setup Client
const authLink = setContext((_, { headers }) => {
    return {
        headers: {
            ...headers,
            authorization: Token ? `${Token}` : ''
        },
    };
});
const clientCache = new InMemoryCache();
const clientLink = new HttpLink({
    uri: Endpoint,
});
const client = new ApolloClient({
    cache: clientCache,
    link: authLink.concat(clientLink),
});

// internal pin class
class Pin {
    constructor(x, y, name, creator, description, category, otherText, mapId) {
        this.key = `pin:x${String(x)},y${String(y)}map:${mapId}`;
        this.x = x;
        this.y = y;
        this.name = name;
        this.creator = creator;
        this.description = description;
        this.category = category;
        this.otherText = otherText;
        this.mapId = mapId;
    }
}

// Component class
export default class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
            pinName: "",
            pinCreator: "",
            pinCategory: "",
            pinOtherText: "",
            pinDescription: "",
            pinMapId: "",
        };
    }

    /**
     * Draws a given pin to the map
     * @param pin<Pin>The pin to be drawn
     * @param pins<[Pin]>all of the pins!
     */
    drawPin(pin, pins) {
        return <div key={pin.key}
            className="mapPin"
            style={{ left: String(pin.x - 6) + "px", top: String(pin.y - 6) + "px", }}>
            <button className="mapPinMarker"
                onClick={() => {
                    pins.forEach(p => {
                        if (p.key === pin.key) {
                            this.setState({
                                pinName: p.name, pinCreator: p.creator,
                                pinDescription: p.description, pinCategory: p.category,
                                pinOtherText: p.otherText, pinMapId: p.mapId
                            });
                        }
                    });
                }} />
            <div className="mapPinName">{pin.name}</div>
        </div>;
    }

    getPinInfoClassName() {
        if (this.state.pinName === "") {
            return "invisible";
        } else {
            return "pinLinkContainer";
        }
    }

    getCategory() {
        if (this.state.pinOtherText !== '' && this.state.pinCategory === 'OTHER') {
            return this.state.pinOtherText;
        } else {
            return this.state.pinCategory;
        }
    }

    /**
     * renders the component
     */
    render() {
        return (
            <ApolloProvider client={client}>
                <div id="contentContainer">
                    <div id="prompt">Click on a pin to view it's data...</div>
                    <Query query={gql(`query {pointList(size: 50, query:{ random: true}) {name creatorName coordinates {x y} description category otherText mapId} }`)}>
                        {({ loading, error, data }) => {
                            if (loading) return "Loading...";
                            if (error) return `Error! ${error.message}`;
                            if (data) {
                                var pins = new Set();
                                data.pointList.forEach(p => {
                                    let pin = new Pin(p.coordinates.x, p.coordinates.y, p.name, p.creatorName, p.description, p.category, p.otherText, p.mapId);
                                    pins.add(pin);
                                });
                                let pinArray = Array.from(pins);
                                return <div id="viewMapContainer">
                                    <div id="mapImageContainer">
                                        <img id="mapImage"
                                            alt="a map"
                                            src={process.env.PUBLIC_URL + '/collegeHillMap2.png'} />
                                        {pinArray.map(pin => this.drawPin(pin, pinArray))}
                                    </div>
                                    <div className={'pinInfo'}>
                                        <div className="pinName">{this.state.pinName}</div>
                                        <div className="pinCreator">{this.state.pinCreator}</div>
                                        <div className="pinCategory">{this.getCategory()}</div>
                                        <div className="pinDescription">{this.state.pinDescription}</div>
                                        <div className={this.getPinInfoClassName()}>
                                            Original Map: <a className="stdLink" href={`./page=viewmap:${this.state.pinMapId}`}>{`id:${this.state.pinMapId}`}</a>
                                        </div>
                                    </div>
                                </div>;
                            }
                        }}
                    </Query>
                </div>
            </ApolloProvider>
        );
    }
}