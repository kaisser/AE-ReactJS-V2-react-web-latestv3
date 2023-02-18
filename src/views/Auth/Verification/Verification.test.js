import React from 'react';
import ReactDOM from 'react-dom';
import Verification from './Verification';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<Verification />, div);
  ReactDOM.unmountComponentAtNode(div);
});
