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
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import { Auth } from 'aws-amplify';

class ForgotPassword extends Component {
    state = {
        phoneNumber: '',
        savedphoneNumber: '',
        code: '',
        password: '',
        verify: false,
        loading: false,
        error: null,
        isComplete: false
    };

    handleSendCodeClick = (event) => {
        event.preventDefault();
        Auth.forgotPassword(this.state.phoneNumber).then(() =>
            this.setState({ verify: true, savedphoneNumber: this.state.phoneNumber, phoneNumber: '' }),
        ).catch((error) => {
            this.setState({ error: "Something went wrong, please try again later" });
        });
    };

    handleForgotPassword = () => {
        const { savedphoneNumber, code, password, } = this.state;
        this.setState({ loading: true, error: null });

        // Collect confirmation code and new password , then
        Auth.forgotPasswordSubmit(
            savedphoneNumber,
            code,
            password).then((data) => {
                this.setState({ loading: false, error: null, isComplete: true });
            })
            .catch((err) => {
                this.setState({ loading: false, error: "Something went wrong, please try again later" });
            });
    };

    routeLogin = () => {
        this.props.history.push({ pathname: "/login" })
    };

    renderViews = () => {
        const {isComplete, loading, code, password} = this.state;
        if(isComplete) {
            return (<div width={"50%"}>
                <h2 style={{color: "white", fontFamily: 'Montserrat', textAlign: "center", marginBottom: "32px"}}>Password reset completed</h2>
                <Button className="companyColour" onClick={()=> {this.props.history.push({ pathname: "/login" })}} block>
                                                                Return To Login
                                                            </Button>
            </div>)
        } else {
            if(this.state.verify == false) {
                return (<Form>
                    <h1 style={{ color: "white" }}>Verification</h1>

                    <p style={{ color: "white" }}>
                        Enter Account Phone Number Below
                    </p>
                    <InputGroup className="mb-4">
                        <PhoneInput
                            buttonStyle={{ borderRight: "none" }}
                            containerClass="companyColourSecButton"
                            inputStyle={{ width: "100%", background: "#08273B", color: 'rgba(2, 197, 255, 1)' }}
                            placeholder="Select Country"
                            autoFormat
                            value={this.state.phoneNumber}
                            onChange={phone => {
                                this.setState({ phoneNumber: `+${phone}` })
                            }}
                        />
                    </InputGroup>
                    <Row>
                        <Col>
                            {!loading && (
                                <React.Fragment>
                                    {' '}
                                    <Button className="companyColour" onClick={this.handleSendCodeClick.bind(this)} block>
                                        Change Password
                                    </Button>
                                </React.Fragment>
                            )}
                        </Col>
                        <Col>
                            {!loading && (
                                <Button onClick={this.routeLogin.bind(this)} block>
                                    Back
                                </Button>
                            )}
                        </Col>
                    </Row>
                    {loading && (
                        <div style={{ textAlign: 'center' }}>
                            {' '}
                            <Spinner color="primary" />{' '}
                        </div>
                    )}
                </Form>)
            } else {
                return (<Form>
                    <h1 style={{ color: "white" }}>Verification</h1>
                    <p style={{ color: "white" }}>
                        We sent a verification code  via SMS {this.state.phoneNumber}. Enter it Below
                    </p>
                    <InputGroup className="mb-3">
                        <InputGroupAddon addonType="prepend">
                            <InputGroupText className='companyColourSecButton' style={{ borderRight: 0 }}>
                                <i className="icon-lock" />
                            </InputGroupText>
                        </InputGroupAddon>
                        <Input
                            style={{ borderLeft: 0 }}
                            className='companyColourSecButton'
                            type="text"
                            name="Verification Code"
                            onChange={(e) => this.setState({ code: `${e.target.value}` })}
                            value={code}
                            placeholder="Verification Code"
                        />
                    </InputGroup>
                    <InputGroup className="mb-3">
                        <InputGroupAddon addonType="prepend">
                            <InputGroupText className='companyColourSecButton' style={{ borderRight: 0 }}>
                                <i className="icon-lock" />
                            </InputGroupText>
                        </InputGroupAddon>
                        <Input
                            style={{ borderLeft: 0 }}
                            className='companyColourSecButton'
                            type="password"
                            name="Password"
                            onChange={(e) => this.setState({ password: `${e.target.value}` })}
                            value={password}
                            placeholder="Password"
                            autoComplete="new-password"
                        />
                    </InputGroup>
                    <InputGroup className="mb-3">
                        <InputGroupAddon addonType="prepend">
                            <InputGroupText className='companyColourSecButton' style={{ borderRight: 0 }}>
                                <i className="icon-lock" />
                            </InputGroupText>
                        </InputGroupAddon>
                        <Input
                            className='companyColourSecButton'
                            style={{ borderLeft: 0 }}
                            type="password"
                            onChange={(e) => this.setState({ cPassword: `${e.target.value}` })}
                            placeholder="Repeat password"
                            autoComplete="new-password"
                        />
                    </InputGroup>
                    {!loading && (
                        <React.Fragment>
                            {' '}
                            <Row>
                                <Col>
                                    <Button className='companyColour' onClick={this.handleForgotPassword} block>
                                        Verify
                                    </Button>
                                </Col>
                                <Col>
                                    <Button className="companyColour" onClick={this.handleSendCodeClick} block>
                                        Resend
                                    </Button>
                                </Col>
                            </Row>
                        </React.Fragment>
                    )}
                    {loading && (
                        <div style={{ textAlign: 'center' }}>
                            {' '}
                            <Spinner color="primary" />{' '}
                        </div>
                    )}
                </Form>)
            }
        }
    }

    render() {
        const { code, password, loading, error, isComplete } = this.state;
        return (

            <div className="app flex-row align-items-center companyBackgroundLinar">
                <Container>
                    <Row className="justify-content-center">
                        <Col md="9" lg="7" xl="6">
                            {error && <Alert color="danger">{error}</Alert>}
                            <Card className="mx-4" style={{ backgroundColor: 'rgba(0,0,0,0', border: 'none' }}>
                                <CardBody className="p-4" style={{ backgroundColor: "rgba(13,13,13,0.26)", borderRadius: 25 }}>
                                    {this.renderViews()}
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>
                </Container>
            </div>
        );
    }
}

export default ForgotPassword;
