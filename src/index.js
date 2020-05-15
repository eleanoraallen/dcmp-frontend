import React from 'react';
import ReactDOM from 'react-dom';
import PageHeader from './components/PageHeader';
import EditMap from './components/EditMap';
import ViewMap from './components/ViewMap';
import About from './components/About';
import Archive from './components/Archive';
import Home from './components/Home';
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
    pageContent = <ViewMap />;
  }
  if (pageText.includes('editmap')) {
    pageContent = <EditMap />;
  }
  if (pageText.includes('archive')) {
    pageContent = <Archive />;
  }
  if (pageText.includes('about')) {
    pageContent = <About />;
  }
  if (!pageContent) {
    pageContent = <Home />;
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