import React from 'react';
import ReactDOM from 'react-dom';
import { MemoryRouter } from 'react-router-dom';
import FileViewer from './FileViewer';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<MemoryRouter><FileViewer /></MemoryRouter>, div);
  ReactDOM.unmountComponentAtNode(div);
});
