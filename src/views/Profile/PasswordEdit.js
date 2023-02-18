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
    Alert,
    Spinner
} from 'reactstrap';
import { Auth } from 'aws-amplify';
import { AppContext } from '../../AppContext';
import 'react-phone-input-2/lib/style.css';
class ProfileEdit extends Component {
    state = {
        password: '',
        confirmedPassword: '',
        oldPassword: '',
        error: null,
        loading: false,
        showSuccessText: false
    };

    static contextType = AppContext;

    validateEmail(email) {
        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }

    componentDidMount() {
        const { userAttributes } = this.props;
        this.setState({
            phone_number: userAttributes.phone_number,
            email: userAttributes.email,
            business_name: (userAttributes["custom:role"] === "Business" ? userAttributes["custom:business_name"] : ""),
            name: userAttributes.name,
            role: userAttributes["custom:role"],
            city: userAttributes["custom:city"],
            country: userAttributes["custom:country"],
        })
    }

    handlePassword = async() => {
        const { oldPassword, password, confirmedPassword } = this.state;
        try {
            let user = await Auth.currentAuthenticatedUser();
            let passwordResults = await Auth.changePassword(user, oldPassword, password);
            if(passwordResults == "SUCCESS") {
                this.setState({ 
                    oldPassword: '',
                    password: '',
                    confirmedPassword: '',
                    showSuccessText: true
                })
            };
        } catch(error) {
            console.log(error);
        }
    }

    render() {
        const { loading, error, showSuccessText } = this.state;
        return (
            <div className="app">
                <Container>
                    <Row style={{justifyContent: "center"}}>
                        <Col md="9" lg="7" xl="6">
                            {error && <Alert color="danger">{error}</Alert>}
                            <Card className="mx-4 mt-5" style={{ backgroundColor: "#00000000", border: 0 }}>
                                <CardBody className="p-4" style={{ alignItem: "center", width: "400px", backgroundColor: "rgba(13,13,13,0.26)", alignSelf: "center", borderRadius: 8 }}>
                                    <Form style={{ color: "white" }}>
                                        <h1>Password</h1>
                                        <p className="text-muted">Edit your account</p>
                                        <InputGroup className="mb-3">
                                            <InputGroupAddon addonType="prepend">
                                            <InputGroupText className='companyColourSecButton' style={{borderRight: 0}}>
                                                    <i className="icon-lock" />
                                                </InputGroupText>
                                            </InputGroupAddon>
                                            <Input
                                                style={{borderLeft: 0}}
                                                className='companyColourSecButton'
                                                type="password"
                                                value={this.state.oldPassword}
                                                onChange={(e) => this.setState({ oldPassword: `${e.target.value}` })}
                                                placeholder="Old Password"
                                                autoComplete="new-password"
                                            />
                                        </InputGroup>

                                        <InputGroup className="mb-3">
                                            <InputGroupAddon addonType="prepend">
                                            <InputGroupText className='companyColourSecButton' style={{borderRight: 0}}>
                                                    <i className="icon-lock" />
                                                </InputGroupText>
                                            </InputGroupAddon>
                                            <Input
                                                style={{borderLeft: 0}}
                                                className='companyColourSecButton'
                                                type="password"
                                                value={this.state.password}
                                                onChange={(e) => this.setState({ password: `${e.target.value}` })}
                                                placeholder="Password"
                                                autoComplete="new-password"
                                            />
                                        </InputGroup>
                                        
                                        <InputGroup className="mb-4">
                                            <InputGroupAddon addonType="prepend">
                                            <InputGroupText className='companyColourSecButton' style={{borderRight: 0}}>
                                                    <i className="icon-lock" />
                                                </InputGroupText>
                                            </InputGroupAddon>
                                            <Input
                                                invalid={this.state.password != this.state.confirmedPassword}
                                                style={{borderLeft: 0}}
                                                className='companyColourSecButton'
                                                value={this.state.confirmedPassword}
                                                type="password"
                                                onChange={(e) => this.setState({ confirmedPassword: `${e.target.value}` })}
                                                placeholder="Repeat password"
                                                autoComplete="new-password"
                                            />
                                        </InputGroup>
                                        {showSuccessText && (
                                            <div className="successText">
                                                <p style={{ textAlign: 'center', verticalAlign: "center" }}>Your update has been successful</p>
                                            </div>
                                        )}

                                        {!loading && (
                                                <Row >
                                                    <Col xs={6}>
                                                        <Button className="companyColour" onClick={this.handlePassword} block >
                                                            Update Password
                                                        </Button>
                                                    </Col>
                                                    <Col xs={6}>
                                                    <Button className="companyColour" onClick={() => {
                                                        this.props.history.push({
                                                            pathname: "/profile"
                                                        });
                                                    }} block >
                                                        Back
                                                    </Button>
                                                    </Col>
                                                </Row>
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

export default ProfileEdit;
