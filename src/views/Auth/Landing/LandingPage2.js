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

class LandingPage2 extends Component {
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

    
    

    routeLogin = () => {
        this.props.history.push({ pathname: "/landingpage" })
    };

    renderViews = () => {
        const {isComplete, loading, code, password} = this.state;
        
            if(this.state.verify == false) {
                return (<Form>
                    <h1 style={{ textAlign: 'center' , color: "white" }}>Landing -- Second Page</h1>

                   
                    <Row>
                       
                       <Col>
                          <br/>
                       </Col>
                   </Row>
                    
                    <Row style={{ textAlign: 'center' }}>
                        
                        <Col>
                            {!loading && (
                                <Button style={{ backgroundColor: "rgba(46, 53, 134, 0.9)", borderRadius: 25 }} onClick={this.routeLogin.bind(this)} block>
                                    Go to the 1st page
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
        
        }
    }

    render() {
        const { loading, error, isComplete } = this.state;
        return (

            <div className="app flex-row align-items-center companyBackgroundLinar">
                <Container>
                    <Row className="justify-content-center">
                        <Col>
                            {error && <Alert color="danger">{error}</Alert>}
                            <Card className="mx-4" style={{ backgroundColor: 'rgba(0,0,0,0', border: 'none' }}>
                                <CardBody className="p-4" style={{ backgroundColor: "rgba(49, 133, 155, 0.9)", borderRadius: 25 }}>
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

export default LandingPage2;
