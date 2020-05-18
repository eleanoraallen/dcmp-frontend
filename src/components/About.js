import React, { Component } from 'react';
import '../css/about.css';

// Component class
export default class About extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  /**
   * renders the component
   */
  render() {
    return <div id="aboutContainer">
      <div id="aboutTitle">About</div>
      <div id="aboutContents">
        <div className='aboutParagraph'>In <i>The Image of the City</i>, Kevin Lynch used cognitive mapping to study how a city’s residents engaged with and experienced the urban environment. By studying the maps people produce, what they include, prioritize, and neglect, it is possible to gain some understanding into how those people perceive and experience their shared environment.</div>
        <div className='aboutParagraph'>Despite the fact that all of a city’s residents occupy the same physical space, each person’s experience of the city is different, each an invaluable piece of a city’s heritage. The College Hill Digital Cognitive Mapping Project is an attempt to record and preserve that heritage. It’s aim is to create a toolset for people to document and share and collate their experiences of College Hill and for researchers to study that data.</div>
        <div className='aboutParagraph'>This project draws heavily on the work of many other people. This project is particularly indebted to the exhibit <a className="aboutLink" href="https://www.districtsix.co.za/permanent-exhibition-digging-deeper/">Digging Deeper</a> at the <a className="aboutLink" href="http://cargocollective.com/MacGregorRechicoProjects/Map-It-Out">District Six Museum</a> in Cape Town, South Africa, and the exhibition <a className="aboutLink" href="http://cargocollective.com/MacGregorRechicoProjects/Map-It-Out">Map It Out - Providence</a> by <a className="aboutLink" href="http://www.gwenmacgregor.com/">Gwen MacGregor</a> and <a className="aboutLink" href="http://www.sandrarechico.com/index.html">Sandra Rechico</a>. This project would also not have been possible without the help of my teachers Dr. Lauran Yapp and Emily Booker.</div>
      </div>
    </div>;
  }
}