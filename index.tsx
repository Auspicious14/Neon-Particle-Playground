
import React from 'react';
import ReactDOM from 'react-dom/client';
import RootLayout from './app/layout';
import Page from './app/page';
import './app/globals.css';

const rootElement = document.getElementById('root');
if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <RootLayout>
        <Page />
      </RootLayout>
    </React.StrictMode>
  );
}
