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
  constructor(x, y, name, description, category, otherText) {
    this.key = `pin:x${String(x)},y${String(y)}`;
    this.x = x;
    this.y = y;
    this.name = name;
    this.description = description;
    this.category = category;
    this.otherText = otherText
  }
}

const id = window.location.href.split('viewmap:')[1];

// Component class
export default class ViewMap extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pinName: "",
      pinDescription: "",
      pinCategory: "",
      pinOtherText: "",
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
              this.setState({ pinName: p.name });
              this.setState({ pinDescription: p.description });
              this.setState({ pinCategory: p.category });
              this.setState({ pinOtherText: p.otherText });
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
      return "pinInfo";
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
    return(
      <ApolloProvider client={client}>
      <div id="contentContainer">
          <Query query={gql(`query { map(id: "${id}") {mapName creatorName createdAt description} }`)}>
            {({ loading, error, data }) => {
              if (loading) return "";
              if (error) return `Error! ${error.message} --- (Hi this is me. Either you're trying to query a map that doesn't exist or this is my fault. Sorry!)`;
              if (data) {
                let mapName = 'Unnamed Map';
                let creatorName = 'Anonymous Creator';
                let description = '';
                if (data.map.mapName !== null) {
                    mapName = data.map.mapName
                }
                if (data.map.creatorName !== null) {
                    creatorName = data.map.creatorName
                }
                if (data.map.description !== null) {
                    description = data.map.description
                }
                return <div className="mapInfo">
                  <div className="mapDetailsLeft">
                    <div className="mapTitle">{mapName} by {creatorName}</div>
                    <div className="mapDetails">Created at: {data.map.createdAt}</div>
                    <div className="mapDetails">Map ID: {id}</div>
                  </div>
                  <div className="mapDescriptionContainer">
                    <div className="mapDescription">{description}</div>
                  </div>
                </div>;
              }
            }}  
          </Query>
          <Query query={gql(`query {pointList(size: 50, query:{ mapId: "${id}"}) {name coordinates {x y} description category otherText} }`)}>
            {({ loading, error, data }) => {
              if (loading) return "";
              if (error) return `Error! ${error.message}`;
              if (data) {
                const pins = data.pointList.map(p => {
                  let pin = new Pin(p.coordinates.x, p.coordinates.y, p.name, p.description, p.category, p.otherText);
                  return pin;
                });
                return <div id="viewMapContainer">
                <div id="mapImageContainer">
                  <img id="mapImage"
                    alt="a map"
                    src={process.env.PUBLIC_URL + '/collegeHillMap2.png'} />
                  {pins.map(pin => this.drawPin(pin, pins))}
                </div>
                <div className={'pinInfo'}>
                  <div className="pinName">{this.state.pinName}</div>
                  <div className="pinCategory">{this.getCategory()}</div>
                  <div className="pinDescription">{this.state.pinDescription}</div>
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