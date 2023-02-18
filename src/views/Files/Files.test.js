import React from 'react';
import ReactDOM from 'react-dom';
import { MemoryRouter } from 'react-router-dom';
import Files from './Files';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<MemoryRouter><Files /></MemoryRouter>, div);
  ReactDOM.unmountComponentAtNode(div);
});
