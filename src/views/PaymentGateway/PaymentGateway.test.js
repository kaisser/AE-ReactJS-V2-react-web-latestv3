import React from 'react';
import ReactDOM from 'react-dom';
import PaymentGateway from './PaymentGateway';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<PaymentGateway />, div);
  ReactDOM.unmountComponentAtNode(div);
});
