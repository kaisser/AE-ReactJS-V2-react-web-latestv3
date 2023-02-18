import React from 'react';
import ReactDOM from 'react-dom';
import { MemoryRouter } from 'react-router-dom';
import QrCodeTest from './QrCodeTest';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<MemoryRouter><QrCodeTest /></MemoryRouter>, div);
  ReactDOM.unmountComponentAtNode(div);
});
