import React, { Component } from 'react';
import { HashRouter, Route, Switch } from 'react-router-dom';
// import { renderRoutes } from 'react-router-config';

import PrivateRoute from './privateRoutes';
import  AppContextClass  from './AppContext';

const loading = () => <div className="animated fadeIn pt-3 text-center">Loading...</div>;

// Containers


const DefaultLayout = React.lazy(() => import('./containers/DefaultLayout'));

// Pages
const Login = React.lazy(() => import('./views/Auth/Login'));
const Register = React.lazy(() => import('./views/Auth/Register'));
const ForgotPassword = React.lazy(() => import('./views/Auth/ForgotPassword')); 
const Page404 = React.lazy(() => import('./views/Auth/Page404'));
const Page500 = React.lazy(() => import('./views/Auth/Page500'));
const Verify = React.lazy(()=> import('./views/Auth/Verification'));

//Added by Saad
const Landing = React.lazy(()=> import('./views/Auth/Login'));
const LandingPage = React.lazy(() => import('./views/Auth/Landing/LandingPage')); 
const LandingPage2 = React.lazy(() => import('./views/Auth/Landing/LandingPage2')); 

class App extends Component {
  render() {
    return (
      <AppContextClass>
      <HashRouter>
          <React.Suspense fallback={loading()}>
            <Switch>
              <Route exact path="/landing" name="Landing Page" render={props => <Landing {...props}/>} />
              <Route exact path="/landingpage" name="Landing Page" render={props => <LandingPage {...props}/>} />
              <Route exact path="/landingpage2" name="Landing Page 2" render={props => <LandingPage2 {...props}/>} />
              <Route exact path="/login" name="Login Page" render={props => <Login {...props}/>} />
              <Route exact path="/forgotpassword" name="ForgotPassword Page" render={props => <ForgotPassword {...props}/>} />
              <Route exact path="/register" name="Register Page" render={props => <Register {...props}/>} />
              <Route exact path="/verify/:email/:phone" name="Verify Page" render={props => <Verify {...props}/>} />
              <Route exact path="/404" name="Page 404" render={props => <Page404 {...props}/>} />
              <Route exact path="/500" name="Page 500" render={props => <Page500 {...props}/>} />
              <PrivateRoute path="/" component={DefaultLayout} />
            </Switch>
          </React.Suspense>
      </HashRouter>
      </AppContextClass>
    );
  }
}

export default App;
