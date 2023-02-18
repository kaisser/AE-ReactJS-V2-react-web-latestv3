import 'react-app-polyfill/ie9'; // For IE 9-11 support
import 'react-app-polyfill/stable';
// import 'react-app-polyfill/ie11'; // For IE 11 support
import './polyfill'
import React from 'react';
import ReactDOM from 'react-dom';

import App from './App';
import 'bootstrap/dist/css/bootstrap.min.css';
import * as serviceWorker from './serviceWorker';

import { Amplify, API,Storage } from 'aws-amplify';
import awsconfig from './aws-exports';

Amplify.configure({
    ...awsconfig,
    //region: 'ca-central-1',
   // bucket: 'sa-datasfromdb',
    API: {
        endpoints: [{
            name: "promotions",
            endpoint: "https://r1mtp5lnnf.execute-api.us-west-2.amazonaws.com/Prod",
            custom_header: async () => {
                return { Authorization: 'token' }
            }
        }]
    }
   /* Storage: {
        AWSS3: {
            bucket: 'testbucketvone', //REQUIRED -  Amazon S3 bucket name
            region: 'ca-central-1', //OPTIONAL -  Amazon service region
        }
    }*/
    
});
API.configure(awsconfig);
//Added by SAAD
//AWS.config.update({region: 'ca-central-1'});
ReactDOM.render(<App />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
