import React from "react";
import { Route, Redirect } from "react-router-dom";
import { Auth } from "aws-amplify";
import { AppContext } from './AppContext'
class PrivateRoute extends React.PureComponent {
  state = {
    isAuthenticated: null,
    loading: true
  }

  static contextType = AppContext;

  updatePaidUser = (value) => {
    this.setState({ paidUser: value, isAuthenticated: true, loading: false });
  }

  componentDidMount() {
    this.getAttributes()
  }

  getAttributes = () => {
    Auth.currentAuthenticatedUser().then((user) => {
      this.updatePaidUser(user["attributes"]["custom:paid_user"]);
      return
    }).catch((err) => {
      this.setState({ isAuthenticated: false, loading: false })
      return
    })
  }

  AuthCheck = (props) => {
    const { component: Component, ...rest } = this.props;
    return this.state.isAuthenticated ? <Component {...props}/> : <Redirect to="/login" />
  }

  loading = () => <div className="animated fadeIn pt-3 text-center">Loading...</div>;

  render() {
    const { path } = this.props;
    return this.state.loading ? this.loading() : (
      <Route
        path={path}
        render={props => this.AuthCheck(props)}
      />
    );
  }
}

export default PrivateRoute;