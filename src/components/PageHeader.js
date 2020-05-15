import React, { Component } from 'react';
import '../css/header.css';


// Component class
export default class PageHeader extends Component {
  constructor(props) {
    super(props);
    };

  render() {
    return <div id="headerContainer">
       <div id="headerTitle"><a href="./" id="titleLink">The College Hill Digital Cognitive Mapping Project</a></div>
      <div id="headerLinks">
      <a href="./page=about" className="headerLink">About</a>
        <a href="./page=editmap" className="headerLink">Contribute a Map</a>
        <a href="./page=archive" className="headerLink">Map Archive</a>
        <a href="./page=research" className="headerLink">Research</a>
      </div>
    </div>;
  }
}