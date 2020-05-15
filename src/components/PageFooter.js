import React, { Component } from 'react';
import '../css/footer.css';


// Component class
export default class PageFooter extends Component {
  constructor(props) {
    super(props);
    };

  render() {
    return <div id="footerContainer">
        <div id="footer"></div>
    </div>;
  }
}