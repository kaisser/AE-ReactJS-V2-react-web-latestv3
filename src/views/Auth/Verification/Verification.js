import React, { Component } from 'react';
import {
	Button,
	Card,
	CardBody,
	Col,
	Container,
	Form,
	Input,
	InputGroup,
	InputGroupAddon,
	InputGroupText,
  Row,
  Spinner,
  Alert
} from 'reactstrap';
import { Auth } from 'aws-amplify';
import { useHistory } from 'react-router-dom';

class Verification extends Component {
	state = {
		phone_number: '',
		password: '',
		name: '',
		given_name: '',
		email: '',
		role: '',
		business_name: '',

		loading: false,
		error: null,
		isComplete: false,
		informOtp: null
	};

	cancelSignup = () => {
		const { location } = this.props;
		this.setState({loading: true})
		const params = {
			method: "DELETE",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
			  subId: location.state?.user.userSub
			}),
		}
  
		fetch("https://r1mtp5lnnf.execute-api.us-west-2.amazonaws.com/Prod/users", params)
			.then(() => {
				this.props.history.push("/register", { state: {}});
			}).catch((error) => {
		  		this.setState({error: "Something went wrong", loading: false})
		})
	};

	verify = () => {
		const { code } = this.state;
		const phone = this.props.match.params.phone;
		// After retrieving the confirmation code from the user

		if (phone) {
			this.setState({ loading: true, error: null });
			Auth.confirmSignUp(phone, code, {
				// Optional. Force user confirmation irrespective of existing alias. By default set to True.
				forceAliasCreation: true
			}).then((data) => {
					this.setState({ loading: false, error: null, isComplete: true, informOtp: null });
				})
				.catch((error) => {
					if (error && error.message) {
						this.setState({ loading: false, error: error.message });
					}
				});
		}
	};

	handleReroute = () => {
		this.props.history.push({
			pathname: '/login',
			state: {}
		});
	}

	handleResend = () => {
		const phone = this.props.match.params.phone;
		if (phone) {
			this.setState({ loading: true, error: null });
			Auth.resendSignUp(phone)
				.then((data) => {
					this.setState({ loading: false, error: null, informOtp: "One time password been sent" });
				})
				.catch((error) => {
					if (error && error.message) {
						this.setState({ loading: false, error: error.message });
					}
				});
		}
	};

	render() {
		console.log(this.props);
		const phone = this.props.match.params.phone;
		const { loading, error, isComplete, informOtp } = this.state;
		return (
			<div className="app flex-row align-items-center companyBackgroundLinar">
				<Container>
					<Row className="justify-content-center">
						<Col md="9" lg="7" xl="6">
            				{error && <Alert color="danger">{error}</Alert>}
							{informOtp && <Alert color="danger">{informOtp}</Alert>}
							<Card className="mx-4" style={{backgroundColor: 'rgba(0,0,0,0)', border: 'none'}}>
								<CardBody className="p-4" style={{backgroundColor: "rgba(13,13,13,0.26)", borderRadius: 25}}>
									<Form>
										{ isComplete ? <div style={{textAlign: "center"}}>
											<h1 className="mb-4" style={{color: "white"}}>Verification Complete</h1>
											<Button className='companyColour' onClick={this.handleReroute}>
															Return to Login
														</Button>
										</div> : <div>
											<h1 className="mb-4" style={{color: "white"}}>Verification</h1>
											<p className="mb-4" style={{color: "white"}}>
												We sent a verification code to {phone && phone}. Enter it Below
											</p>
											</div> }
										{ isComplete ? null :<InputGroup className="mb-4">
											<InputGroupAddon addonType="prepend">
												<InputGroupText className='companyColourSecButton' style={{borderRight: 0}}>
													<i className="icon-lock" />
												</InputGroupText>
											</InputGroupAddon>
											<Input
												className="companyColourSecButton"
												style={{borderLeft: 0 }}
												type="text"
												name="Verification Code"
												onChange={(e) => this.setState({ code: `${e.target.value}` })}
												placeholder="Verification Code"
											/>
										</InputGroup>}
										{!loading && !isComplete && (
											<React.Fragment>
												{' '}
												<Row>
													<Col>
													<Button className="companyColour mb-3"  onClick={this.verify} block>
													Verify
												</Button>
													</Col>
												<Col>
												<Button className="companyColour mb-2"  onClick={this.handleResend} block>
													Resend
												</Button>
												</Col>
												<Button className="companyColour mb-2" onClick={this.cancelSignup} style={{marginLeft: 16, marginRight: 16}}block>
													Cancel
												</Button>
												</Row>

											</React.Fragment>
										)}
										{loading && (
											<div style={{ textAlign: 'center' }}>
												{' '}
												<Spinner color="primary" />{' '}
											</div>
										)}
									</Form>
								</CardBody>
							</Card>
						</Col>
					</Row>
				</Container>
			</div>
		);
	}
}

export default Verification;
