import React from 'react';
import ReactDOM from 'react-dom';
import PageHeader from './components/PageHeader';
import EditMap from './components/EditMap';
import ViewMap from './components/ViewMap';
import About from './components/About';
import './css/index.css';
import './css/webfonts/ingram-mono-regular.css';

function App() {
  // Get Page Text (used to determine which page to rener)
  const splited = window.location.href.split('page=');
  let pageText;
  if (splited.length === 2) {
    pageText = splited[1];
  } else {
    pageText = '';
  }
  // determine what to render
  let pageContent;
  if (pageText.includes('viewmap:')) {
    let input = '';
    if (pageText.split('viewmap:')[1].length > 1) {
      input = pageText.split('viewmap:')[1];
    }
    pageContent = <ViewMap id={input} />;
  }
  if (pageText.includes('editmap')) {
    pageContent = <EditMap />;
  }
  if (pageText.includes('archive')) {
    pageContent = <div>ARCHIVE</div>;
  }
  if (pageText.includes('about')) {
    pageContent = <About />;
  }
  if (!pageContent) {
    pageContent = <ViewMap id="rand"/>;
  }

  return (
    <div className="App">
      <PageHeader />
      {pageContent}
    </div>
  );
}

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);