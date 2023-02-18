import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
	Col,
	Row
} from 'reactstrap';

const propTypes = {
	children: PropTypes.node,
};

const defaultProps = {};

class DefaultFooter extends Component {
	render() {

		// eslint-disable-next-line
		const { children, ...attributes } = this.props;

		return (
			<React.Fragment>
				<span><a>Copyright</a> &copy; 2022 Angel-Earth Corporation. All rights reserved.</span>
				<Row>
					<Col xs="10" className="text-right">
						<div className="mt-15">
							<a href="https://privacy-and-end-user.s3-us-west-2.amazonaws.com/Privacy+%26+End+User+Agreement/User+Agreement+%26+Privacy+Policy.pdf" target="_blank">
								Privacy
							</a>
						</div>
					</Col>
				</Row>
			</React.Fragment>
		);
	}
}

DefaultFooter.propTypes = propTypes;
DefaultFooter.defaultProps = defaultProps;

export default DefaultFooter;
