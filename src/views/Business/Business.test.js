import React from 'react';
import ReactDOM from 'react-dom';
import { MemoryRouter } from 'react-router-dom';
import Business from './Business';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<MemoryRouter><Business /></MemoryRouter>, div);
  ReactDOM.unmountComponentAtNode(div);
});
