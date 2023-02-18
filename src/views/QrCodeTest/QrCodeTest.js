import React, { Component } from "react";
import { Card, CardBody, Col, Row, Container, Button } from "reactstrap";
import QRCode from "react-qr-code";
import { AppContext } from "../../AppContext";
import { Auth, API, graphqlOperation } from "aws-amplify";
import { listRemotedbtables } from '../../graphql/queries';
import { getRemotedbtable } from '../../graphql/queries';
import { useEffect } from "react";
import QrReader from 'react-qr-reader';
import { makeStyles, Grid } from '@material-ui/core';

const restAPI = "apirestforbusdb"
const pathAPI = '/customers';

class QrCodeTest extends Component {
  static contextType = AppContext;
  datasfrommysql = [];

  //urlqr = "17802975709";

  constructor(props) {
    super(props);

    this.state = {
      type: null,
      url: null,
      isActive: false,
      phone_number: '17809957801',
      scanResultWebCam: '',
      imageUrl: false,
      UplodingData: false,
    };

    console.log('******************** CONSTRUCTEUR  -- imageUrl', this.state.imageUrl);
    this.fetchDbLIST('SaadBusiness');
  }

  createconnectiondb = async (scanResult) => {
    const { userAttributes } = this.props;

    // var session = await Auth.currentSession();
    // var IdToken = await session.getIdToken();
    // var jwtToken = await IdToken.getJwtToken();
    //console.log('session : ',session);
    //console.log('IdToken : ',IdToken);
    //console.log('jwtToken : ',jwtToken);
    const myInit = {
      headers: {}, // OPTIONAL
      response: true, // OPTIONAL (return the entire Axios response object instead of only response.data)
      queryStringParameters: {
        bussnessname: userAttributes['custom:business_name'],
        bussnesslocation: userAttributes['custom:city'], // 'Calgary', //
      }
    };



    //console.log('***************phone ID  : ', phone);



    API.get(restAPI, pathAPI + "/" + scanResult, myInit)
      .then(response => {
        console.log(response.data)
        this.state.UplodingData = true;
        console.log('***************UplodingData  : ', this.state.UplodingData);
        this.forceUpdate();
        /* let newCustomers = [...datasfrommysql]
         newCustomers.push(response)
         setdatasfrommysql(newCustomers)
         */

      })
      .catch(error => {
        console.log(error)
      })

    if (this.state.UplodingData) {
      this.forceUpdate();
    }
  }

  fetchDbLIST(bussnessId) {
    console.log('function from fetchDb : ')

    try {
      API.graphql(graphqlOperation(getRemotedbtable, { id: bussnessId }))
        .then(function (data) {
          const items = data.data.getRemotedbtable;
          // const items = data;
          console.log(items)
        })
    } catch (error) {
      console.log(' Error : ', error)
    }
  }

  handleErrorWebCam = (error) => {
    console.log(error);
  }
  handleScanWebCam = (result) => {
    // console.log('************** SCANNING RESULT : ******************', result);
    if (result) {
      const answer_array = result.split('/');
      this.state.imageUrl = true;
      console.log('******************** SCAN  -- imageUrl', this.state.imageUrl);
      //console.log('**************IF SCANNING RESULT 1: *****************', answer_array[0]);
      //console.log('**************IF SCANNING RESULT 2: *****************', answer_array[1]);
      this.state.phone_number = answer_array[1];

      this.someMethod();
      this.createconnectiondb(result);
    }
  }

  someMethod() {
    // Force a render without state change...
    this.forceUpdate();
  }



  render() {

    /* useEffect(() =>
     {
       fetchDb()
     }
     )*/
    //const fetchDb = async() => {

    const { userAttributes } = this.props;
    console.log(' userAttributes custom:business_name : ', userAttributes['custom:business_name']);
    //this.fetchDbLIST(userAttributes['custom:business_name']);
    const url = "www.angel-earth.com";

    return (
      <Container className="animated fadeIn" fluid>
        <Row>
          <Col lg={12}>
            <Card style={{ backgroundColor: "#00000000", border: 0 }}>
              <CardBody
                className="text-center justify-content-center"
                style={{ alignItem: "center" }}
              >
                {/* <div
                  style={{
                    background: "white",
                    width: "300px",
                    marginLeft: "auto",
                    marginRight: "auto",
                    borderRadius: 50,
                  }}
                  className="p-4"
                >
                  {<a href={`https://oanh9u8jd6.execute-api.us-west-2.amazonaws.com/Production/invokedatabase?message={{${userAttributes.phone_number}}}`}>
                    {/* <QRCode value={`https://oanh9u8jd6.execute-api.us-west-2.amazonaws.com/Production/invokedatabase?message={{${userAttributes.phone_number}}}`}/> */}
                {/* <QRCode value={this.state.phone_number} />
                  </a>}

                  <Button className="companyColour" onClick={this.createconnectiondb} block >
                    Test QRCODE
                  </Button>
                </div>
                
                <h3 className="mt-4 companyColourSecText">Qr Code Test</h3>
                <p className="companyColourSecText pt-2">Coming Soon</p>
                */}

                <h3>Qr Code Scanning </h3>
                {
                  this.state.imageUrl ?
                    (
                      (
                        this.state.Uploading ? (<h3>Retur Data ... </h3>) : (<h3>Uploading Data ... </h3>)
                      )
                    ) :
                    <QrReader
                      delay={300}
                      style={{ width: '80%' }}
                      onError={this.handleErrorWebCam}
                      onScan={this.handleScanWebCam}
                    />
                }
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    );
  }
}

const useStyles = makeStyles((theme) => ({
  conatiner: {
    marginTop: 10
  },
  title: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    background: '#3f51b5',
    color: '#fff',
    padding: 20
  },
  btn: {
    marginTop: 10,
    marginBottom: 20
  }
}));

export default QrCodeTest;
