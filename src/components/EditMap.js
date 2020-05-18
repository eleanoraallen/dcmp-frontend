import React, { Component } from 'react';
import { ApolloClient } from 'apollo-boost';
import { HttpLink } from 'apollo-link-http';
import { ApolloProvider, Mutation } from 'react-apollo';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { setContext } from 'apollo-link-context';
import { Token, Endpoint } from '../authorization';
import gql from "graphql-tag";
import '../css/editmap.css';

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
    this.category = "";
    this.otherText = "";
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
      mapDescription: "",
      editName: "",
      editDescription: "",
      editTag: "none",
      editOtherText: "",
      written: false,
      mapFile: 'line_map.png',
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
    if (editPinKey === '' && !(this.state.written) && mapPins.length < 51) {
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
          if (editPinKey === '' && !this.state.written) {
            editPinKey = pin.key;
            mapPins.forEach(p => {
              if (p.key === editPinKey && mapPins.length > 0 && !this.state.written) {
                this.setState({ editName: p.name, editDescription: p.description, editTag: p.category, editOtherText: p.otherText});
              }
            });
          }
        }} />
      <div className="mapPinName">{pin.name}</div>
    </div>;
  }

  handleMapNameChange(e) {
    this.setState({ mapName: e.target.value });
  }

  handleMapCreatorChange(e) {
    this.setState({ mapCreator: e.target.value });
  }

  handleMapDescriptionChange(e) {
    this.setState({ mapDescription: e.target.value });
  }

  /**
   * Handles change to the pin name input
   * @param e<event>input
   */
  handleNameChange(e) {
    this.setState({ editName: e.target.value });
  }

  /**
   * Handles change to the pin description input
   * @param e<event>input
   */
  handleDescriptionChange(e) {
    this.setState({ editDescription: e.target.value });
  }

  handleTagChange(e) {
    if (e.target.value !== 'none') {
      this.setState({ editTag: e.target.value });
    }
  }

  handleOtherTextChange(e) {
    if (e.target.value !== 'none') {
      this.setState({ editOtherText: e.target.value });
    }
  }

  handleRemovePin(e) {
    this.setState({ editName: "" });
    this.setState({ editDescription: "" });
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
          p.category = this.state.editTag;
          p.otherText = this.state.editOtherText;
        }
        return p;
      });
      this.setState({ editName: "", editDescription: "", editTag: "", editOtherText: "" })
      editPinKey = "";
    }
  }

  /**
   * Handles a map save
   * @param e<event>onClick event
   * @return <String>
   */
  handleMapSave() {
    let s = 'mutation { saveMap(';
    if (this.state.mapName !== "") {
      s = s + ` mapName: "${this.state.mapName}"`;
    }
    if (this.state.mapCreator !== "") {
      s = s + ` creatorName: "${this.state.mapCreator}"`;
    }
    if (this.state.mapDescription !== "") {
      s = s + ` description: "${this.state.mapDescription}"`;
    }
    s = s + ' points: [';
    let l = mapPins;
    let i = 0;
    while (i < l.length) {
      const p = l[i];
      if (p.name === '') {
        s = s + `{ name: "placeholder" coordinates: [${p.x}, ${p.y}]`;
      } else {
        s = s + `{ name: "${p.name}" coordinates: [${p.x}, ${p.y}]`;
      }
      if (p.description !== "") {
        s = s + ` description: "${p.description}"`;
      }
      if (p.category !== "") {
        s = s + ` category: "${p.category}"`;
      }
      if (p.otherText !== "") {
        s = s + ` otherText: "${p.otherText}"`;
      }
      if (this.state.mapCreator !== "") {
        s = s + ` creatorName: "${this.state.mapCreator}"`;
      }
      s = s + ' }';
      if (i < l.length - 1) {
        s = s + ', ';
      }
      i++;
    }
    s = s + ' ])}';
    return gql(s);
  }

  getSaveButtonClass() {
    if (this.state.written) {
      return "invisible";
    } else {
      return "saveMapButton";
    }
  }

  printSavePreface() {
    if (this.state.written) {
      return 'Your map was successfuly saved! Map ID: '
    } else {
      return '';
    }
  }

  printSaveSuffex() {
    if (this.state.written) {
      let s = '. Thank you for your contribution';
      if (this.state.mapCreator !== '') {
        s = s + " " + this.state.mapCreator;
      }
      s = s + '!';
      return s;
    } else {
      return '';
    }
  }

  getOTClass() {
    if (this.state.editTag === 'OTHER') {
      return 'show';
    } else {
      return 'invisible';
    }
  }

  toggleMapFile() {
    if (this.state.mapFile === 'line_map.png') {
      this.setState({ mapFile: 'fill_map.png' });
    } else {
      this.setState({ mapFile: 'line_map.png' });
    }

  }

  /**
   * renders the component
   */
  render() {
    return <div id="contentContainer">
      <div id="editCreator">
        <div id="mapInfoContainer">
          <div id="mapInputs">
            <input id="mapNameInput" type="text" className="topInput" autoComplete="off"
              placeholder="Name of your map (optional)" onChange={this.handleMapNameChange.bind(this)}></input>
            <input id="creatorNameInput" type="text" className="topInput" autoComplete="off"
              placeholder="Your name (optional)" onChange={this.handleMapCreatorChange.bind(this)}></input>
          </div>
          <div id="textAreaContainer">
            <textarea id="mapDescriptionField" autoComplete="off"
              placeholder="A description of your map (optional)" onChange={this.handleMapDescriptionChange.bind(this)}></textarea>
          </div>
        </div>
      </div>
      <div id="toggleButtonContainer">
        <button className={"toggleButton"} onClick={() => this.toggleMapFile()}>Toggle Informational Overlay</button>
      </div>
      <div id="editMapContainer">
        <div id="mapImageContainer">
          <img id="mapImage"
            alt="a map"
            onMouseMove={this.onMouseMove.bind(this)}
            onClick={this.onClick.bind(this)}
            src={process.env.PUBLIC_URL + this.state.mapFile} />
          {mapPins.map(pin => this.drawPin(pin))}
        </div>
      </div>
      <div id="editPin">
        <div className={getContentClassName()}>
          <div className="editPinNameContainer">
            <input className="editPinInput" type="text" required autoComplete="off" placeholder="Name of this point" value={this.state.editName} onChange={this.handleNameChange.bind(this)} />
          </div>
          <div className="editPinDescriptionContainer">
            <textarea className="editPinField" autoComplete="off" placeholder="Description of this point (optional)" type="text" value={this.state.editDescription} onChange={this.handleDescriptionChange.bind(this)} />
          </div>
          <div className="editPinTagContainer">
            <select id="pinTag" value={this.state.editTag} onChange={this.handleTagChange.bind(this)}>
              <option value="none" className="descriptionOption">Category of this point (optional)</option>
              <option value="ART">Art</option>
              <option value="BUISNESS">Buisness</option>
              <option value="LANDMARK">Landmark</option>
              <option value="MONUMENT">Monument</option>
              <option value="PUBLICSPACE">Public Space or Building</option>
              <option value="RESIDENCE">Residence</option>
              <option value="SCHOOL">School or Educational Institution</option>
              <option value="WORKPLACE">Workplace</option>
              <option value="OTHER">Other</option>
            </select>
          </div>
          <div className={this.getOTClass()}>
            <input className="editPinInput" type="text" autoComplete="off"
              placeholder="Category name (optional)" value={this.state.editOtherText} onChange={this.handleOtherTextChange.bind(this)} />
          </div>
          <div className="editPinButtonsContainer">
            <button className="removePinButton bottomButton" onClick={this.handleRemovePin.bind(this)}>Remove Pin</button>
            <button className="savePinButton bottomButton" onClick={this.handleEditSubmit.bind(this)}>Save Pin</button>
          </div>
        </div>
      </div>
      <div>{this.state.data}</div>
      <ApolloProvider client={client}>
        <Mutation mutation={this.handleMapSave()}>
          {(saveMap, { data, error }) => (
            <div id="saveMap">
              <button className={`${this.getSaveButtonClass()} bottomButton`} onClick={e => {
                if (editPinKey === "" && mapPins.length > 0) {
                  e.preventDefault();
                  this.setState({ written: true });
                  saveMap();
                }
              }}>
                Save Map</button>
              <div className="saveMessage">
                {this.printSavePreface()}
                <a className="stdLink" href={("./?page=viewmap:" + JSON.stringify(data)).replace('undefined', '').replace('{"saveMap":"', '').replace('"}', '')}> 
                {("" + JSON.stringify(data)).replace('undefined', '').replace('{"saveMap":"', '').replace('"}', '')} </a>
                {this.printSaveSuffex()}
              </div>
            </div>
          )}
        </Mutation>
      </ApolloProvider>
    </div>;
  }
}