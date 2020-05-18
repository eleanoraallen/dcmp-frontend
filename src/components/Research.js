import React, { Component } from 'react';
import '../css/research.css';

// Component class
export default class Research extends Component {
  constructor(props) {
    super(props);
    };

  render() {
    return <div id="researchContainer">
        <div className="researchTextContainer">One of the primary goals of the College Hill Digital Cognitive Mapping Project was to create a toolset that would be easy for researchers and developers to use. As such, this project is built on top of a publicly available <a className='stdLink' href="https://graphql.org/">GraphQL</a> which includes a number of features intended to make the dataset easily accessible to people from a wide variety of backgrounds.</div>
       <div id="tryButtonContainer">
          <a href="https://dcmp-server.herokuapp.com/"><button className="tryButton" target="_blank">Try it out in the Playground</button></a>
          <a href="http://dcmp-documentation.s3-website-us-east-1.amazonaws.com/"><button className="tryButton" target="_blank">API Documentation</button></a>
       </div>
    </div>;
  }
}