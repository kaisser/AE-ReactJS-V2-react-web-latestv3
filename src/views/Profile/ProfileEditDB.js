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

import {

    FormControl,
    InputLabel,
    Select,
    MenuItem,

} from "@mui/material/";

import { Auth } from 'aws-amplify';
import { AppContext } from '../../AppContext';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import { API, graphqlOperation } from "aws-amplify";
import { listRemotedbtables } from '../../graphql/queries';
import { getRemotedbtable } from '../../graphql/queries';
import { createRemotedbtable } from '../../graphql/mutations';
import { v4 as uuid } from 'uuid';
class ProfileEditDB extends Component {
    datafromdb = [];
    datafromdynamo = {};

    //const [datasfrommysql, setdatasfrommysql] = useState([]);

    state = {
        /* phone_number: '',
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
         showSuccessText: false,*/
        id: '',
        dbname: '',
        hostname: '',
        username: '',
        userpassword: '',
        bussnessname: '',
        bussnessId: '',
        dbport: 0,
        bussnessLocation: '',
        bussnessAdress: '',
        bussnessCountry: '',
        bussnessNbLocation: 1,
        dbtype: '',
        // createdAt:'',
        // updatedAt:'',
    };

    db = {
        dbname: '',
        hostname: '',
        username: '',
        userpassword: '',
        bussnessname: '',
        bussnessId: '',
        dbport: 0,
        bussnessLocation: '',
        bussnessAdress: '',
        bussnessCountry: '',
        bussnessNbLocation: 1,
        dbtype: '',
    };

    componentWillMount() {
        const { userAttributes } = this.props;
        console.log("componentWillMount : this.props", this.props);
    }

    async fetchDbLIST(bussnessId) {
        console.log('function from fetchDb in Profile DB : ');
        let itemdetail;
        let filter = {
            bussnessname: {
                eq: 'SaadBusiness' // filter priority = 1
            }
        };

        let _bussnessId = {
            id: {
                eq: '1234' // filter priority = 1
            }
        };

        try {

            await API.graphql(graphqlOperation(listRemotedbtables, { filter: filter }))
                // await API.graphql(graphqlOperation(getRemotedbtable, {id:'1234'}))
                // API.graphql({ query: listRemotedbtables, variables: { filter: filter}})
                .then((data) => { // Here, use a lambda or this will not point to your class
                    const items = data.data.listRemotedbtables.items;
                    // const items = data;
                    console.log(items);

                    this.datafromdb = items;

                })

        } catch (error) {
            console.log(' Error : ', error)
        }
    }

    static contextType = AppContext;

    validateEmail(email) {
        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }

    async componentDidMount() {
        const { userAttributes } = this.props;
        const iddb = this.props.match.params;
        console.log("*****************************************userAtterbute", userAttributes);
        console.log("*****************************************Did Mount datas :", this.props);
        console.log("*******************************************************params : ", iddb);

        // console.log(' userAttributes custom:business_name : ',userAttributes['custom:business_name']);
        // await this.fetchDbLIST(userAttributes['custom:business_name']);
        // console.log("data from db", this.datafromdb);


        try {

            //API.graphql(graphqlOperation(listRemotedbtables, { filter: filter}))
            API.graphql(graphqlOperation(getRemotedbtable, { id: iddb }))
                // API.graphql({ query: listRemotedbtables, variables: { filter: filter}})
                .then((data) => { // Here, use a lambda or this will not point to your class
                    const items = data.data.getRemotedbtable;
                    // const items = data;
                    console.log(items);
                    // this.datafromdb = items;
                    this.datafromdynamo = items;
                    console.log('********************************* items: ', items);
                    this.state = ({
                        dbname: items.dbname,

                    });
                })
        } catch (error) {
            console.log('Component mount Error : ', error)
        }

        /*this.setState({
            dbname: this.datafromdynamo,
            // username: this.datafromdynamo.username,

        })
        */


        this.setState({
            id: uuid(),
            bussnessId: userAttributes.phone_number,
            bussnessname: (userAttributes["custom:role"] === "Business" ? userAttributes["custom:business_name"] : ""),
            //bussnessphone: userAttributes.phone_number,
            // updatedAt: new Date().toISOString(),
            // createdAt : new Date().toISOString(),


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

    createconnectiondb = async () => {
        const { userAttributes } = this.props;



        console.log('Component function createconnectiondb : ', userAttributes);
        console.log(' function createconnectiondb state : ', this.state);

        try {

            await API.graphql(graphqlOperation(createRemotedbtable, { input: this.state }))
                .then((data) => { // Here, use a lambda or this will not point to your class

                    // const items = data;
                    console.log('Successful Creation Database ', data);

                    this.props.history.push("/profile");

                })

        }
        catch (error) {
            console.log('Creating new row db Error : ', error)
        }


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
        //const { name, email, password, business_name, role, loading, error, phone_number, showSuccessText, country, city } = this.state;
        const {
            dbname,
            hostname,
            username,
            userpassword,
            bussnessname,
            bussnessId,
            dbport,
            dbtype,
            bussnessLocation,
            bussnessAdress,
            bussnessCountry,
            bussnessNbLocation,
            name, email, password, business_name, role, loading, error, phone_number, showSuccessText, country, city } = this.state;
        console.log('State : ', this.state);
        return (
            <div className="app">
                {/* <h2 style={{visibility: this.datafromdb.length > 0 ? 'visible' : 'hidden' }}>Datas from Dynamo DB</h2>
                {
                this.datafromdb.map((thisCustomer, index) => {
                    return (
                    <div key={thisCustomer.id}>
                    <span><b>CustomerId:</b> {thisCustomer.id} - <b>Customer Name</b>: {thisCustomer.username} - <b>Datas</b>: {thisCustomer.dbname} </span>
                    </div>)
                })
                }  */}
                <Container>
                    <Row >
                        <Col md="12" lg="10" xl="9" style={{ margin: "auto" }}>
                            {error && <Alert color="danger">{error}</Alert>}
                            <Card className="mx-4 mt-5" style={{ backgroundColor: "#00000000", border: 0 }}>
                                <CardBody className="p-4" style={{ alignItem: "center", width: "600px", backgroundColor: "rgba(13,13,13,0.26)", alignSelf: "center", borderRadius: 8 }}>
                                    <Form style={{ color: "white" }}>
                                        <h1>Database Connector</h1>
                                        <p className="text-muted">Adding a pool connection</p>

                                        <InputGroup className="mb-3">
                                            <FormControl fullWidth>
                                                <InputLabel id="demo-simple-select-label">Database Type</InputLabel>
                                                <Select
                                                    labelId="demo-simple-select-label"
                                                    id="demo-simple-select"
                                                    value={dbtype}
                                                    label="Database Type"
                                                    onChange={(e) =>
                                                        this.setState({ dbtype: `${e.target.value}` })}
                                                >
                                                    <MenuItem value={"mysql"}>Mysql</MenuItem>
                                                    <MenuItem value={"postgres"}>Postgres</MenuItem>
                                                    <MenuItem value={"sql-server"}>Sql Server</MenuItem>
                                                </Select>
                                            </FormControl>
                                        </InputGroup>

                                        <InputGroup className="mb-3">
                                            <InputGroupAddon addonType="prepend">
                                                <InputGroupText className='companyColourSecButton' style={{ borderRight: 0 }}>
                                                    <i className="icon-user" />
                                                </InputGroupText>
                                            </InputGroupAddon>
                                            <Input
                                                className='companyColourSecButton'
                                                type="text"
                                                name="dbname"
                                                value={dbname}
                                                style={{ borderLeft: 0 }}
                                                onChange={(e) => this.setState({ dbname: `${e.target.value}` })}
                                                placeholder="Database Name"
                                                invalid={(dbname && dbname.length < 3)}
                                                valid={dbname.length > 3}
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
                                                value={username}
                                                type="text"
                                                onChange={(e) => this.setState({ username: `${e.target.value}` })}
                                                placeholder="User Name"
                                                invalid={username && username.length < 3}
                                                valid={username.length > 3}
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
                                                value={userpassword}
                                                type="password"
                                                onChange={(e) => this.setState({ userpassword: `${e.target.value}` })}
                                                placeholder="User Password"
                                                invalid={userpassword && userpassword.length < 6}
                                                valid={userpassword.length > 6}
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
                                                name="bussnessCountry"
                                                value={bussnessCountry}
                                                onChange={(e) =>
                                                    this.setState({ bussnessCountry: `${e.target.value}` })}
                                                placeholder="Country Name"
                                                valid={bussnessCountry && bussnessCountry.length >= 4}
                                                invalid={bussnessCountry && bussnessCountry.length < 4}
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
                                                name="bussnessLocation"
                                                value={bussnessLocation}
                                                onChange={(e) =>
                                                    this.setState({ bussnessLocation: `${e.target.value}` })}
                                                placeholder="Bussness Location"
                                                valid={bussnessLocation && bussnessLocation.length >= 1}
                                                invalid={bussnessLocation && bussnessLocation.length < 1}
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
                                                value={hostname}
                                                type="text"
                                                name="hostname"
                                                onChange={(e) =>
                                                    this.setState({ hostname: `${e.target.value}` })}
                                                placeholder="Host url"
                                                valid={hostname && hostname.length >= 6}
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
                                                value={bussnessAdress}
                                                type="text"
                                                name="bussnessAdress"
                                                onChange={(e) =>
                                                    this.setState({ bussnessAdress: `${e.target.value}` })}
                                                placeholder="Bussness Adress"
                                                valid={bussnessAdress && bussnessAdress.length >= 1}
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
                                                value={dbport}
                                                type="text"
                                                name="dbport"
                                                onChange={(e) =>
                                                    this.setState({ dbport: `${e.target.value}` })}
                                                placeholder="DB Port"
                                                valid={dbport && dbport.length >= 4}
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
                                                    <Button className="companyColour" onClick={this.createconnectiondb} block >
                                                        Create connection Pool
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

export default ProfileEditDB;
