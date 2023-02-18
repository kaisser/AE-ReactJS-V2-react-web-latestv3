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
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
class ProfileEdit extends Component {
    state = {
        phone_number: '',
        password: '',
        name: '',
        email: '',
        role: '',
        business_name: '',
        country: '',
        city: '',
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

    handleUpdate = async () => {
        const { userAttributes } = this.props;
        const { email, password, name, business_name, phone_number, city, country, confirmedPassword } = this.state;
        this.setState({ loading: true, error: null });
        var cognitoObj = {};
        if (userAttributes["name"] !== name) { cognitoObj["name"] = name; }
        if (userAttributes["custom:business_name"] !== business_name) { cognitoObj["custom:business_name"] = business_name; }
        if (userAttributes["phone_number"] !== phone_number) { cognitoObj["phone_number"] = phone_number; }
        if (userAttributes["email"] !== email) { cognitoObj["email"] = email; }
        if (userAttributes["custom:city"] !== city) { cognitoObj["custom:city"] = city; }
        if (userAttributes["custom:country"] !== country) { cognitoObj["custom:country"] = country; }
        if (password.length > 0 && confirmedPassword.length > 0 && confirmedPassword == password) {
            this.handlePassword()
        }
        if (Object.entries(cognitoObj).length == 0) { return }
        try {
            let user = await Auth.currentAuthenticatedUser()
            let results = await Auth.updateUserAttributes(user, cognitoObj)
            if (cognitoObj["phone_number"] != null || cognitoObj["phone_number"] != undefined) {
                this.props.history.push({
                    pathname: `/verify/${email}/${phone_number}`
                });
            } else {
                this.setState({ showSuccessText: true })
            }
            this.setState({ loading: false, error: null });
            this.props.checkUserAttributes()
        } catch (error) {
            if (error && error.message) {
                this.setState({ loading: false, error: error.message });
            }
        };
    };

    handlePassword = async () => {
        const { oldPassword, password, confirmedPassword } = this.state;
        try {
            let user = await Auth.currentAuthenticatedUser()
            let passwordResults = await Auth.changePassword(user, oldPassword, password)
            if (passwordResults == "SUCCESS") {
                this.setState({ showSuccessText: true })
            }
        } catch (error) {
            console.log(error);
        }
    }

    render() {
        const { name, email, password, business_name, role, loading, error, phone_number, showSuccessText, country, city } = this.state;
        return (
            <div className="app">
                <Container>
                    <Row >
                        <Col md="9" lg="7" xl="6" style={{ margin: "auto" }}>
                            {error && <Alert color="danger">{error}</Alert>}
                            <Card className="mx-4 mt-5" style={{ backgroundColor: "#00000000", border: 0 }}>
                                <CardBody className="p-4" style={{ alignItem: "center", width: "400px", backgroundColor: "rgba(13,13,13,0.26)", alignSelf: "center", borderRadius: 8 }}>
                                    <Form style={{ color: "white" }}>
                                        <h1>Profile</h1>
                                        <p className="text-muted">Edit your account</p>

                                        <InputGroup className="mb-3">
                                            <InputGroupAddon addonType="prepend">
                                                <InputGroupText className='companyColourSecButton' style={{ borderRight: 0 }}>
                                                    <i className="icon-user" />
                                                </InputGroupText>
                                            </InputGroupAddon>
                                            <Input
                                                className='companyColourSecButton'
                                                type="text"
                                                name="firstName"
                                                value={name}
                                                style={{ borderLeft: 0 }}
                                                onChange={(e) => this.setState({ name: `${e.target.value}` })}
                                                placeholder="Full Name"
                                                invalid={(name && name.length < 3)}
                                                valid={name.length > 3}
                                            />
                                        </InputGroup>
                                        <InputGroup className="mb-3">
                                            <InputGroupAddon addonType="prepend">
                                                <InputGroupText className='companyColourSecButton' style={{ borderRight: 0 }}>
                                                    <i className="fa fa-at" aria-hidden="true" />
                                                </InputGroupText>
                                            </InputGroupAddon>
                                            <Input
                                                style={{ borderLeft: 0 }}
                                                className='companyColourSecButton'
                                                value={email}
                                                type="text"
                                                onChange={(e) => this.setState({ email: `${e.target.value}` })}
                                                placeholder="Email"
                                                autoComplete="email"
                                                valid={this.validateEmail(email)}
                                                invalid={email && !this.validateEmail(email)}
                                            />
                                        </InputGroup>
                                        <InputGroup className="mb-3">
                                            <PhoneInput
                                                buttonStyle={{ borderRight: "none" }}
                                                containerClass='companyColourSecButton'
                                                inputStyle={{ width: "100%", background: "#08273B" }}
                                                placeholder="Select Country"
                                                autoFormat
                                                value={phone_number}
                                                onChange={phone => {
                                                    this.setState({ phone_number: "+" + phone })
                                                }}
                                            />
                                        </InputGroup>

                                        <InputGroup className="mb-3">
                                            <InputGroupAddon addonType="prepend">
                                                <InputGroupText className='companyColourSecButton' style={{ borderRight: 0 }}>
                                                    <i className="fa fa-globe" />
                                                </InputGroupText>
                                            </InputGroupAddon>
                                            <Input
                                                style={{ borderLeft: 0 }}
                                                className='companyColourSecButton'
                                                type="text"
                                                name="Country"
                                                value={country}
                                                onChange={(e) =>
                                                    this.setState({ country: `${e.target.value}` })}
                                                placeholder="Country Name"
                                                valid={country && country.length >= 4}
                                                invalid={country && country.length < 4}
                                            />
                                        </InputGroup>
                                        <InputGroup className="mb-3">
                                            <InputGroupAddon addonType="prepend">
                                                <InputGroupText className='companyColourSecButton' style={{ borderRight: 0 }}>
                                                    <i className="fa fa-building-o" />
                                                </InputGroupText>
                                            </InputGroupAddon>
                                            <Input
                                                style={{ borderLeft: 0 }}
                                                className='companyColourSecButton'
                                                type="text"
                                                name="CityName"
                                                value={city}
                                                onChange={(e) =>
                                                    this.setState({ city: `${e.target.value}` })}
                                                placeholder="City Name"
                                                valid={city.length >= 1}
                                                invalid={city.length < 1}
                                            />
                                        </InputGroup>
                                        {role === 'Business' && (
                                            <InputGroup className="mb-3">
                                                <InputGroupAddon addonType="prepend">
                                                    <InputGroupText className='companyColourSecButton' style={{ borderRight: 0 }}>
                                                        <i className="fa fa-building-o" />
                                                    </InputGroupText>
                                                </InputGroupAddon>
                                                <Input
                                                    style={{ borderLeft: 0 }}
                                                    className='companyColourSecButton'
                                                    value={this.state.business_name}
                                                    type="text"
                                                    name="Business"
                                                    onChange={(e) =>
                                                        this.setState({ business_name: `${e.target.value}` })}
                                                    placeholder="Business Name"
                                                    valid={business_name}
                                                />
                                            </InputGroup>
                                        )}
                                        {showSuccessText && (
                                            <div className="successText">
                                                <p style={{ textAlign: 'center', verticalAlign: "center" }}>Your update has been successful</p>
                                            </div>
                                        )}

                                        {!loading && (
                                            <Row >
                                                <Col xs={6}>
                                                    <Button className="companyColour" onClick={this.handleUpdate} block >
                                                        Update Profile
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
