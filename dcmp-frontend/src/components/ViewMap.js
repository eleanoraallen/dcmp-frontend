import React, { Component } from 'react';
import '../css/viewmap.css';

// internal pin class
class Pin {
  constructor(x, y, name, description, creator, date, mapID) {
    this.key = `pin:x${String(x)},y${String(y)}`;
    this.x = x;
    this.y = y;
    this.name = name;
    this.description = description;
    this.creator = creator;
    this.date = date;
    this.mapID = mapID;
  }
}

const p1 = new Pin(700, 300, "Pin1", "This is a test description test test test!", "nunya business", '4/17/1995', "000001");
const p2 = new Pin(200, 300, "Pin2", "In hindsight I should have made these more helpfull...", "nunya business", '4/17/1995', "000001");
const p3 = new Pin(700, 400, "Pin3", "ABC easy as 123", "an entierly different person", '4/17/2075', "000002");
const p4 = new Pin(800, 800, "Pin4", "This is also a test description test test test!", "nunya business", '4/17/1995', "000001");
const p5 = new Pin(300, 500, "Pin5", "Simple as doe re me, ABC, 123 baby you and me!", "an entierly different person", '4/17/2075', "000002");

let mapPins = [p1, p2, p3, p4, p5];

// Component class
export default class ViewMap extends Component {
  constructor(props) {
    super(props);
    this.state = {
        pinName: "",
        pinDescription: "",
        pinCreator: "",
        pinDate: "",
        pinMapID: "",
    };
  }

  /**
   * Draws a given pin to the map
   * @param pin<Pin>The pin to be drawn
   */
  drawPin(pin) {
    return <div key={pin.key}
        className="mapPin" 
        style={{ left: String(pin.x - 6) + "px", top: String(pin.y - 6) + "px", }}>
            <button className="mapPinMarker" 
            onClick={() => { 
                mapPins.forEach(p => {
                    if (p.key === pin.key) { 
                        this.setState({pinName: p.name}); 
                        this.setState({pinDescription: p.description});
                        this.setState({pinCreator: "By: " + p.creator}); 
                        this.setState({pinDate: "Created On: " + p.date.toString()});
                        this.setState({pinMapID: p.mapID});
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

  /**
   * renders the component
   */
  render() {
    return <div id="viewMapContainer">
      <div id="mapImageContainer">
        <img id="mapImage"
          alt="a map"
          src={process.env.PUBLIC_URL + '/collegeHillMap2.png'} />
        {mapPins.map(pin => this.drawPin(pin))}
      </div>
      <div className={this.getPinInfoClassName()}>
        <div className="pinName">{this.state.pinName}</div>
        <div className="pinCreator">{this.state.pinCreator}</div>
        <div className="pinDate">{this.state.pinDate}</div>
        <div className="pinMapID"><a id="mapLink" href={`./viewmap:${this.state.pinMapID}`}>Original Map: {this.state.pinMapID}</a></div>
        <div className="pinDescription">{this.state.pinDescription}</div>
      </div>
    </div>;
  }
}