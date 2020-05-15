import React, { Component } from 'react';
import '../css/header.css';


// Component class
export default class EditMap extends Component {
  constructor(props) {
    super(props);
    };

  render() {
    return <div id="headerContainer">
       <div id="headerTitle"><a href="./" id="titleLink">The College Hill Digital Cognitive Mapping Project</a></div>
      <div id="headerLinks">
        <a href="./page=editmap" className="headerLink">Create a Map</a>
        <a href="./page=archive" className="headerLink">Map Archive</a>
        <a href="./page=about" className="headerLink">About</a>
      </div>
    </div>;
  }
}