import React, { Component } from 'react';
import '../css/editmap.css';


let editPinKey = '';
let mapPins = [];

// internal pin class
class Pin {
  constructor(x, y) {
    this.key = `pin:x${String(x)},y${String(y)}`;
    this.x = x;
    this.y = y;
    this.name = "";
    this.description = "";
  }
}

/**
 * gets class name of pin content container
 */
function getContentClassName() {
  if (editPinKey === '') {
    return "invisible";
  } else {
    return "pinContent"; 
  }
}

// Component class
export default class EditMap extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      x: 0, 
      y: 0,
      mapName: "",
      mapCreator: "",
      editName: "", 
      editDescription: "",
    };
  }

  /**
   * Sets internal x and y coordinates according to mouse position
   * @param e<event>mouseMove event
   */
  onMouseMove(e) {
    this.setState({ x: e.nativeEvent.offsetX, y: e.nativeEvent.offsetY });
    e.preventDefault();
  }

  /**
   * Adds a new pin if a user isn't already editing one
   * @param e<event>click event
   */
  onClick(e) {
    if (editPinKey === '') {
      let newPin = new Pin(this.state.x, this.state.y);
      mapPins.push(newPin);
      editPinKey = newPin.key;
    }
  }

  /**
   * Draws a given pin to the map
   * @param pin<Pin>The pin to be drawn
   */
  drawPin(pin) {
    return <div key={pin.key}
        className="mapPin" 
        style={{ left: String(pin.x - 6) + "px", top: String(pin.y - 6) + "px", }}>
        <button 
          className="mapPinMarker" 
          onClick={() => { 
            if (editPinKey === '') { 
              editPinKey = pin.key;
              mapPins.forEach(p => {
                if (p.key === editPinKey) { 
                  this.setState({editName: p.name}); 
                  this.setState({editDescription: p.description});
                }
              }); 
            }
          }} />
        <div className="mapPinName">{pin.name}</div>
      </div>;
  }

  /**
   * Handles change to the pin name input
   * @param e<event>input
   */
  handleNameChange(e) {
    this.setState({editName: e.target.value});
  }

  /**
   * Handles change to the pin description input
   * @param e<event>input
   */
  handleDescriptionChange(e) {
      this.setState({editDescription: e.target.value});
  }

  handleRemovePin(e) {
    this.setState({editName: ""});
    this.setState({editDescription: ""});
    mapPins = mapPins.filter(p => p.key !== editPinKey);
    editPinKey = "";
  }

  /**
   * Handles submition of a pin edit
   * @param e<event>onClick event
   */
  handleEditSubmit(e) {
    if (this.state.editName !== "") {
      mapPins = mapPins.map(p => {
        if (p.key === editPinKey) {
          p.name = this.state.editName;
          p.description = this.state.editDescription;
        }
        return p;
      });
      this.setState({editName: ""});
      this.setState({editDescription: ""});
      editPinKey = "";
    } 
  }

  /**
   * Handles a map save
   * @param e<event>onClick event
   */
  handleMapSave(e) {
    if (editPinKey === "") {
      const data = {
        date: Date.now(),
        mapName: this.state.mapName,
        mapCreator: this.state.mapCreator,
        pins: mapPins,
      }
      console.log("Data:")
      console.log(data);
      console.log("Pins:")
      data.pins.forEach(p => {
        console.log(p.key + " " + p.name + " " + p.description);
      })
    } 
  }

  /**
   * renders the component
   */
  render() {
    return <div id="contentContainer">
      <div id="editCreator">
        <div id="mapInfoContainer">
          <input id="mapNameInput" type="text"></input>
          <input id="creatorNameInput" type="text"></input>
        </div>
      </div>
      <div id="editMapContainer">
      <div id="mapImageContainer">
        <img id="mapImage"
          alt="a map"
          onMouseMove={this.onMouseMove.bind(this)}
          onClick={this.onClick.bind(this)}
          src={process.env.PUBLIC_URL + '/collegeHillMap2.png'} />
        {mapPins.map(pin => this.drawPin(pin))}
      </div>
      </div>
      <div id="editPin">
        <div className={getContentClassName()}>
          <div className="editPinNameContainer">
            <input className="editPinName" type="text" value={this.state.editName} onChange={this.handleNameChange.bind(this)} />
          </div>
          <div className="editPinDescriptionContainer">
            <textarea className="editPinDescription" type="text" value={this.state.editDescription} onChange={this.handleDescriptionChange.bind(this)} />
          </div>
          <div className="editPinButtonsContainer">
            <button className="removePinButton" onClick={this.handleRemovePin.bind(this)}>Remove Pin</button>
            <button className="savePinButton" onClick={this.handleEditSubmit.bind(this)}>Save Pin</button>
          </div>
        </div>
      </div>
      <div id="saveMap">
        <button className="saveMapButton" onClick={this.handleMapSave.bind(this)}>Save Map</button>
      </div>
    </div>;
  }
}