import React, { PureComponent } from 'react';
import { Auth } from 'aws-amplify';

export const AppContext = React.createContext({});

export default class AppContextClass extends PureComponent {
	state = {
		userInfo: null,
		isLogin: false,
		loading: true,
		paidUser: false
	};
	componentDidMount() {
		Auth.currentAuthenticatedUser()
			.then((user) => {
				this.setState({ isLogin: true, userInfo: user.attributes, loading: false });
				return;
			})
			.catch((err) => {
				this.setState({ isLogin: false, userInfo: null, loading: false });
				return;
			});
	}

	render() {
		return <AppContext.Provider value={this.state}>{this.props.children}</AppContext.Provider>;
	}
}
