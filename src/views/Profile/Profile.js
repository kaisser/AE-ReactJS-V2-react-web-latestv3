import React, { Component } from "react";
import { API, graphqlOperation } from "aws-amplify";
import { listRemotedbtables } from '../../graphql/queries';
import { getRemotedbtable } from '../../graphql/queries';

import {
    Card,
    Grid,
    Alert,
    CardContent,
    Box,
    List,
    ListItem,
    ListItemText,
    ListItemButton,
    Divider,
    ListItemIcon,
    Avatar,
    Modal,
    Typography,
    Button,
    ButtonGroup,
} from "@mui/material";
import { CardBody, CardHeader, Col, Row, Table, Spinner, Form, Input, InputGroup, ModalFooter, ModalBody, ModalHeader } from 'reactstrap';

import { deepPurple } from "@mui/material/colors";
import { Auth } from "aws-amplify";
import { AppContext } from "../../AppContext";
import "react-phone-input-2/lib/style.css";
import * as userIcon from "../../assets/img/user.png";

class Profile extends Component {
    static contextType = AppContext;
    datafromdb = [];


    state = {
        showDeleteModal: false,
        isLoading: false,
        showAlert: false,
        alertMessage: "",
        showSubModal: false,
        attemptUnsubscribe: false,
        datas: '',
    };

    async componentDidMount() {
        const { userAttributes } = this.props;
        console.log("userAtterbute", userAttributes);
        //console.log(' userAttributes custom:business_name : ',userAttributes['custom:business_name']);
        //await this.fetchDbLIST(userAttributes['custom:business_name']);
        // console.log("data from db", this.datafromdb);
    }

    componentWillMount() {
        const { userAttributes } = this.props;
        this.renderMyData(userAttributes['custom:business_name']);
        console.log("componentWillMount : data from db", this.datafromdb);
    }

    renderMyData(bussnessId) {
        console.log("renderMyData : business name", bussnessId);
        const { userAttributes } = this.props;
        if (userAttributes['custom:role'] === 'Business') {
            let filter = {
                bussnessname: {
                    eq: bussnessId //'SaadBusiness' // filter priority = 1
                }
            };

            try {
                API.graphql(graphqlOperation(listRemotedbtables, { filter: filter }))
                    // await API.graphql(graphqlOperation(getRemotedbtable, {id:'1234'}))
                    // API.graphql({ query: listRemotedbtables, variables: { filter: filter}})
                    .then((data) => { // Here, use a lambda or this will not point to your class
                        const items = data.data.listRemotedbtables.items;
                        // const items = data;
                        console.log(items);

                        this.datafromdb = items;
                        this.setState({ data: items })

                    })

                /* .then((response) => response.json())
                .then((responseJson) => {
                this.setState({ data : responseJson })
                })
                */

            } catch (error) {
                console.log(' Error : ', error)
            }
        }

    }

    async fetchDbLIST(bussnessId) {
        console.log('function from fetchDb in Profile DB - busness name : ', bussnessId);
        //console.log('function from fetchDb in Profile DB - busness type: ', role);
        let itemdetail;
        const { userAttributes } = this.props;
        if (userAttributes['custom:role'] === 'Business') {
            let filter = {
                bussnessname: {
                    eq: bussnessId //'SaadBusiness' // filter priority = 1
                }
            };

            // let _bussnessId = {
            //     id: {
            //         eq: '1234' // filter priority = 1
            //     }
            // };

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

    }



    unsubscribeUser = () => {
        const userAttributes = this.props.userAttributes;
        const params = {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                businessName: userAttributes["custom:business_name"],
                subId: userAttributes.sub,
            }),
        };
        fetch(
            "https://r1mtp5lnnf.execute-api.us-west-2.amazonaws.com/Prod/stripe/subscriptions",
            params
        )
            .then((result) => { })
            .then((result) => {
                this.setState({
                    showAlert: true,
                    alertMessage:
                        "Your subscription will be cancalled in the next billing cycle",
                });
            })
            .catch((error) => {
                console.log("Unsubscribe failed with: ", error);
            })
            .finally(() => {
                this.props.checkUserAttributes();
                this.toggleModal();
            });
    };

    signOut = async (e) => {
        e.preventDefault();
        await Auth.signOut().finally(() => {
            this.setState({ userInfo: null, loading: false });
        });
        this.props.history.push("/login");
    };

    editConnector = async (e) => {
        //e.preventDefault();
        console.log('Edit Connector', e);
        //this.props = ({ datas: 'testdbConnector'});
        const params = { id: 'testId' }
        this.props.history.push("/profileEditDB/", params);
    };

    resubscribeUser = () => {
        const userAttributes = this.props.userAttributes;
        const params = {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                businessName: userAttributes["custom:business_name"],
                subId: userAttributes.sub,
            }),
        };
        fetch(
            "https://r1mtp5lnnf.execute-api.us-west-2.amazonaws.com/Prod/stripe/subscriptions",
            params
        )
            .then((result) => { })
            .then((result) => {
                this.setState({
                    showAlert: true,
                    alertMessage: "You have resubscribed to your subscription",
                });
            })
            .catch((error) => {
                console.log("Resubscription failed with: ", error);
            })
            .finally(() => {
                this.props.checkUserAttributes();
            });
    };

    toggleDismiss = () => {
        const previousState = this.state.showAlert;
        this.setState({ showAlert: !previousState });
    };

    deleteUserSelf = async () => {
        try {
            let user = await Auth.currentAuthenticatedUser();
            if (this.props.userAttributes["custom:role"] === "Personal") {
                await user.deleteUser(user.username);
                this.props.history.push("/login");
            } else {
                if (
                    this.props.userAttributes["custom:subscription_type"] !==
                    "0" ||
                    this.props.userAttributes["custom:subscription_type"] !==
                    undefined ||
                    this.props.userAttributes["custom:subscription_type"] !==
                    null
                ) {
                    const userAttributes = this.props.userAttributes;
                    const params = {
                        method: "DELETE",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            businessName:
                                userAttributes["custom:business_name"],
                            userName: userAttributes.phone_number,
                            subId: userAttributes.sub,
                        }),
                    };
                    await Promise.all([
                        fetch(
                            "https://r1mtp5lnnf.execute-api.us-west-2.amazonaws.com/Prod/stripe/subscriptions",
                            params
                        ),
                        user.deleteUser(user.username),
                    ]);
                }

                this.props.history.push("/login");
            }
        } catch (error) {
            this.setState({
                alertMessage:
                    "Something went wrong with deleting your account. Please try again later.",
                showAlert: true,
            });
        }
    };

    toggleModal = () => {
        const { showDeleteModal, showSubModal } = this.state;
        if (showDeleteModal) {
            this.setState({ showDeleteModal: !showDeleteModal });
        } else if (showSubModal) {
            this.setState({ showSubModal: !showSubModal });
        } else {
            this.setState({ showDeleteModal: false, showSubModal: false });
        }
    };
    modalStyle = {
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        width: 400,
        bgcolor: "background.paper",
        border: "2px solid #000",
        boxShadow: 24,
        p: 4,
    };
    render() {
        const { userAttributes } = this.props;

        // console.log(' userAttributes custom:business_name : ',userAttributes['custom:business_name']);
        this.fetchDbLIST(userAttributes['custom:business_name']);
        console.log("In RENDER", this.datafromdb);
        // console.log("data from db", this.datafromdb);
        const { alertMessage, showSubModal, attemptUnsubscribe } = this.state;
        return (
            <Box
                sx={{ minWidth: 400 }}
                container
                justify="center"
                alignSelf={"center"}
            >
                <Grid container justify="center">
                    <Grid lg={12} justify="center">
                        <Card
                            justify="center"
                            style={{ backgroundColor: "#00000000", border: 0 }}
                        >
                            <CardContent justify="center">
                                <Modal
                                    open={this.state.showDeleteModal}
                                    aria-labelledby="modal-modal-title"
                                    aria-describedby="modal-modal-description"
                                >
                                    <Box sx={this.modalStyle}>
                                        <Typography
                                            id="modal-modal-title"
                                            variant="h6"
                                            component="h2"
                                        >
                                            Delete Account?
                                        </Typography>
                                        <Typography
                                            id="modal-modal-description"
                                            sx={{ mt: 2 }}
                                        >
                                            {userAttributes["custom:role"] ===
                                                "Personal"
                                                ? "Are you sure you want to delete your account? This action cannot be undone."
                                                : "Are you sure you want to delete your business account and lose your subscription?"}
                                        </Typography>

                                        <ButtonGroup
                                            variant="contained"
                                            aria-label="outlined primary button group"
                                            justify={"center"}
                                        >
                                            <Button
                                                onClick={() =>
                                                    this.deleteUserSelf()
                                                }
                                                variant="outlined"
                                            >
                                                Confirm
                                            </Button>
                                            <Button
                                                onClick={() =>
                                                    this.toggleModal()
                                                }
                                                variant="contained"
                                            >
                                                Cancel
                                            </Button>
                                        </ButtonGroup>
                                    </Box>
                                </Modal>

                                <Modal
                                    open={this.state.showSubModal}
                                    aria-labelledby="modal-modal-title"
                                    aria-describedby="modal-modal-description"
                                >
                                    <Box sx={this.modalStyle}>
                                        <Typography
                                            id="modal-modal-title"
                                            variant="h6"
                                            component="h2"
                                        >
                                            Do you want to unsubscribe?
                                        </Typography>
                                        <Typography
                                            id="modal-modal-description"
                                            sx={{ mt: 2 }}
                                        >
                                            {userAttributes["custom:role"] ===
                                                "Personal"
                                                ? "Are you sure you want to delete your account? This action cannot be undone."
                                                : "Are you sure you want to delete your business account and lose your subscription?"}
                                        </Typography>

                                        <ButtonGroup
                                            variant="contained"
                                            aria-label="outlined primary button group"
                                            justify={"center"}
                                        >
                                            <Button
                                                onClick={() =>
                                                    this.deleteUserSelf()
                                                }
                                                variant="outlined"
                                            >
                                                Confirm
                                            </Button>
                                            <Button
                                                onClick={() =>
                                                    this.toggleModal()
                                                }
                                                variant="contained"
                                            >
                                                Cancel
                                            </Button>
                                        </ButtonGroup>
                                    </Box>
                                </Modal>

                                {/* <Modal isOpen={this.state.showDeleteModal}>
								<ModalHeader style={{ textAlign: "center" }} className="commmonFont">Delete Account?</ModalHeader>
								<ModalBody style={{ textAlign: "center" }} className="commmonFont">
									{ userAttributes["custom:role"] === "Personal" ? "Are you sure you want to delete your account? This action cannot be undone." : "Are you sure you want to delete your business account and lose your subscription?" }
								</ModalBody>
								<ModalFooter>
									<Row style={{ flex: 1 }}>
										<Col style={{ textAlign: 'center' }}>
											<Button onClick={()=>this.deleteUserSelf()} className="commmonFont">Confirm</Button>
										</Col>
										<Col style={{ textAlign: 'center' }}>
											<Button onClick={()=>this.toggleModal()} className="commmonFont">Cancel</Button>
										</Col>
									</Row>
								</ModalFooter>
							</Modal>
							<Modal isOpen={this.state.showSubModal}>
								<ModalHeader style={{ textAlign: "center" }} className="commmonFont">Do you want to unsubscribe?</ModalHeader>
								<ModalBody style={{ textAlign: "center" }} className="commmonFont">
								If you cancel any subscription with Angel-Earth, your subscription will continue the full course, without pro-rated refund.
								</ModalBody>
								<ModalFooter>
									<Row style={{ flex: 1 }}>
										<Col style={{ textAlign: 'center' }}>
											<Button onClick={()=> this.unsubscribeUser()} className="commmonFont">Confirm</Button>
										</Col>
										<Col style={{ textAlign: 'center' }}>
											<Button onClick={()=>this.toggleModal()} className="commmonFont">Cancel</Button>
										</Col>
									</Row>
								</ModalFooter>
							</Modal> */}

                                <Alert
                                    color="info"
                                    isOpen={this.state.showAlert}
                                    toggle={this.toggleDismiss}
                                >
                                    {alertMessage}
                                </Alert>
                                <List>
                                    <ListItem>
                                        <ListItemButton>
                                            <ListItemIcon>
                                                <Avatar
                                                    alt="Remy Sharp"
                                                    src={
                                                        "../../assets/img/user.png"
                                                    }
                                                />
                                            </ListItemIcon>
                                            <ListItemText
                                                primary={userAttributes.name}
                                                secondary={userAttributes.email}
                                            />
                                        </ListItemButton>
                                    </ListItem>
                                    <Divider />
                                    <ListItem disablePadding>
                                        <ListItemButton>
                                            <ListItemText primary="Payment (Coming Soon)" />
                                        </ListItemButton>
                                    </ListItem>
                                    {this.props.userAttributes[
                                        "custom:subscriptionStatus"
                                    ] === "subscribed" &&
                                        attemptUnsubscribe === false &&
                                        this.props.userAttributes[
                                        "custom:subType"
                                        ] !== "0" ? (
                                        <ListItem disablePadding>
                                            <ListItemButton
                                                onClick={() =>
                                                    this.setState({
                                                        showSubModal:
                                                            !showSubModal,
                                                        attemptUnsubscribe: true,
                                                    })
                                                }
                                            >
                                                <ListItemText primary="Unsubscribe" />
                                            </ListItemButton>
                                        </ListItem>
                                    ) : null}
                                    {this.props.userAttributes[
                                        "custom:subscriptionStatus"
                                    ] === "unsubscribing" ||
                                        attemptUnsubscribe === true ? (
                                        <ListItem disablePadding>
                                            <ListItemButton
                                                onClick={() => {
                                                    this.resubscribeUser();
                                                }}
                                            >
                                                <ListItemText primary="Resubscribe" />
                                            </ListItemButton>
                                        </ListItem>
                                    ) : null}
                                    <ListItem disablePadding>
                                        <ListItemButton
                                            onClick={() => {
                                                this.props.history.push(
                                                    "/profileEdit"
                                                );
                                            }}
                                        >
                                            <ListItemText primary="Edit Profile" />
                                        </ListItemButton>
                                    </ListItem>
                                    <ListItem disablePadding>
                                        <ListItemButton
                                            onClick={() => {
                                                this.props.history.push(
                                                    "/paymentHistory"
                                                );
                                            }}
                                        >
                                            <ListItemText primary="Payment History" />
                                        </ListItemButton>
                                    </ListItem>
                                    <ListItem disablePadding>
                                        <ListItemButton
                                            onClick={() => {
                                                this.props.history.push(
                                                    "/changePassword"
                                                );
                                            }}
                                        >
                                            <ListItemText primary="Change Password" />
                                        </ListItemButton>
                                    </ListItem>
                                    <ListItem disablePadding>
                                        <ListItemButton
                                            onClick={() =>
                                                this.setState({
                                                    showDeleteModal: true,
                                                })
                                            }
                                        >
                                            <ListItemText primary="Delete Account" />
                                        </ListItemButton>
                                    </ListItem>
                                    <ListItem disablePadding>
                                        <ListItemButton
                                            onClick={() => {
                                                this.props.history.push(
                                                    "/profileEditDB"
                                                );
                                            }}
                                        >
                                            <ListItemText primary="Add Database Connection" />
                                        </ListItemButton>
                                    </ListItem>
                                    <ListItem disablePadding>
                                        <ListItemButton
                                            onClick={(e) => {
                                                this.signOut(e);
                                            }}
                                        >
                                            <ListItemText primary="Logout" />
                                        </ListItemButton>
                                    </ListItem>
                                </List>
                                {this.props.userAttributes["custom:role"] === "Business" ? (
                                    <Card style={{ backgroundColor: "#00000000", border: 0, alignSelf: "center" }}>
                                        <CardHeader style={{ background: 'transparent', borderBottom: 'none' }}>
                                            <h5 style={{ color: "black" }}>List of databases connectors</h5>
                                        </CardHeader>
                                        <CardBody style={{ backgroundColor: "rgba(13,13,13,0.26)", borderRadius: 8, textAlign: 'center' }}>
                                            <Table responsive hover >
                                                <thead>

                                                    <tr style={{ color: "white" }}>
                                                        <th scope="col">Business Location</th>
                                                        <th scope="col">Database Type</th>
                                                        <th scope="col">Database Name</th>
                                                        <th scope="col">DB Port</th>
                                                        <th scope="col">Country</th>
                                                        <th scope="col">City </th>

                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {
                                                        this.datafromdb.map((thisCustomer, index) => {
                                                            return (
                                                                <tr key={thisCustomer.id}>
                                                                    {/* <td scope="col">{thisCustomer.bussnessId}</td>
                                                        <td scope="col">{thisCustomer.bussnessname}</td> */}
                                                                    <td scope="col">{thisCustomer.id}</td>
                                                                    <td scope="col">{thisCustomer.dbtype}</td>
                                                                    <td scope="col">{thisCustomer.dbname}</td>
                                                                    <td scope="col">{thisCustomer.dbport}</td>
                                                                    <td scope="col">{thisCustomer.bussnessCountry}</td>
                                                                    <td scope="col">{thisCustomer.bussnessLocation}</td>
                                                                    <td scope="col"><Button
                                                                        onClick={(e) => {
                                                                            this.editConnector(thisCustomer.id);
                                                                        }} className="commmonFont">Edit</Button></td>
                                                                </tr>)
                                                        })
                                                    }
                                                </tbody>
                                            </Table>
                                        </CardBody>
                                    </Card>

                                ) : null
                                }
                                {/* <Table style={{ color: "white" }}>
                                    <thead>
                                        <tr>
                                            <th
                                                style={{
                                                    verticalAlign: "middle",
                                                    border: "none",
                                                }}
                                                width="50px"
                                            >
              
                                            </th>
                                            <th
                                                style={{
                                                    borderTop: "none",
                                                    borderBottom: "none",
                                                    verticalAlign: "middle",
                                                    alignItems: "center",
                                                    justifyContent: "center",
                                                }}
                                            >
                                                <h5>Profile</h5>
                                                <p>{userAttributes.email}</p>
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <th
                                                colSpan={16}
                                                style={{
                                                    verticalAlign: "middle",
                                                    alignItems: "center",
                                                    height: "100%",
                                                }}
                                            >
                                                <p
                                                    style={{
                                                        color: "gray",
                                                        verticalAlign: "middle",
                                                        margin: "8px",
                                                    }}
                                                >
                                                    Payment (Coming Soon)
                                                </p>
                                            </th>
                                        </tr>
                                        {this.props.userAttributes[
                                            "custom:subscriptionStatus"
                                        ] === "subscribed" &&
                                        attemptUnsubscribe === false &&
                                        this.props.userAttributes[
                                            "custom:subType"
                                        ] != "0" ? (
                                            <tr
                                                className="disableHover"
                                                style={{
                                                    textAlign: "left",
                                                    justifyContent: "center",
                                                    alignItem: "center",
                                                    verticalAlign: "middle",
                                                }}
                                            >
                                                <th
                                                    colSpan={16}
                                                    onClick={() =>
                                                        this.setState({
                                                            showSubModal:
                                                                !showSubModal,
                                                            attemptUnsubscribe: true,
                                                        })
                                                    }
                                                >
                                                    <p
                                                        style={{
                                                            verticalAlign:
                                                                "middle",
                                                            margin: "8px",
                                                        }}
                                                    >
                                                        Unsubscribe
                                                    </p>
                                                </th>
                                            </tr>
                                        ) : null}
                                        {this.props.userAttributes[
                                            "custom:subscriptionStatus"
                                        ] === "unsubscribing" ||
                                        attemptUnsubscribe === true ? (
                                            <tr
                                                className="disableHover"
                                                style={{
                                                    textAlign: "left",
                                                    justifyContent: "center",
                                                    alignItem: "center",
                                                    verticalAlign: "middle",
                                                }}
                                            >
                                                <th
                                                    colSpan={16}
                                                    onClick={
                                                        this.resubscribeUser
                                                    }
                                                >
                                                    <p
                                                        style={{
                                                            verticalAlign:
                                                                "middle",
                                                            margin: "8px",
                                                        }}
                                                    >
                                                        Resubscribe
                                                    </p>
                                                </th>
                                            </tr>
                                        ) : null}
                                        <tr
                                            className="disableHover"
                                            style={{
                                                textAlign: "left",
                                                justifyContent: "center",
                                                alignItem: "center",
                                                verticalAlign: "middle",
                                            }}
                                        >
                                            <th
                                                colSpan={16}
                                                style={{
                                                    verticalAlign: "middle",
                                                }}
                                                onClick={() => {
                                                    this.props.history.push(
                                                        "/profileEdit"
                                                    );
                                                }}
                                            >
                                                <p
                                                    style={{
                                                        verticalAlign: "middle",
                                                        margin: "8px",
                                                    }}
                                                >
                                                    Edit Profile
                                                </p>
                                            </th>
                                        </tr>
                                        <tr
                                            className="disableHover"
                                            style={{
                                                textAlign: "left",
                                                justifyContent: "center",
                                                alignItem: "center",
                                                verticalAlign: "middle",
                                            }}
                                        >
                                            <th
                                                colSpan={16}
                                                style={{
                                                    verticalAlign: "middle",
                                                }}
                                                onClick={() => {
                                                    this.props.history.push(
                                                        "/paymentHistory"
                                                    );
                                                }}
                                            >
                                                <p
                                                    style={{
                                                        verticalAlign: "middle",
                                                        margin: "8px",
                                                    }}
                                                >
                                                    Payment History
                                                </p>
                                            </th>
                                        </tr>
                                        <tr
                                            className="disableHover"
                                            style={{
                                                textAlign: "left",
                                                justifyContent: "center",
                                                alignItem: "center",
                                                verticalAlign: "middle",
                                            }}
                                        >
                                            <th
                                                colSpan={16}
                                                style={{
                                                    verticalAlign: "middle",
                                                }}
                                                onClick={() => {
                                                    this.props.history.push(
                                                        "/changePassword"
                                                    );
                                                }}
                                            >
                                                <p
                                                    style={{
                                                        verticalAlign: "middle",
                                                        margin: "8px",
                                                    }}
                                                >
                                                    Change Password
                                                </p>
                                            </th>
                                        </tr>
                                        <tr
                                            className="disableHover"
                                            style={{
                                                textAlign: "left",
                                                justifyContent: "center",
                                                alignItem: "center",
                                                verticalAlign: "middle",
                                            }}
                                        >
                                            <th
                                                colSpan={16}
                                                style={{
                                                    verticalAlign: "middle",
                                                }}
                                                onClick={() =>
                                                    this.setState({
                                                        showDeleteModal: true,
                                                    })
                                                }
                                            >
                                                <p
                                                    style={{
                                                        verticalAlign: "middle",
                                                        margin: "8px",
                                                    }}
                                                >
                                                    Delete Account
                                                </p>
                                            </th>
                                        </tr>
                                        <tr
                                            style={{
                                                textAlign: "left",
                                                justifyContent: "center",
                                                alignItem: "center",
                                                verticalAlign: "middle",
                                            }}
                                        >
                                            <th
                                                className="disableHover"
                                                colSpan={16}
                                                style={{
                                                    verticalAlign: "middle",
                                                    margin: "8px",
                                                }}
                                                onClick={(e) => {
                                                    this.props.onLogout(e);
                                                }}
                                            >
                                                <p
                                                    style={{
                                                        verticalAlign: "middle",
                                                        margin: "8px",
                                                    }}
                                                >
                                                    Logout
                                                </p>
                                            </th>
                                        </tr>
                                    </tbody> 
                                </Table>*/}
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            </Box>
        );
    }
}

export default Profile;
