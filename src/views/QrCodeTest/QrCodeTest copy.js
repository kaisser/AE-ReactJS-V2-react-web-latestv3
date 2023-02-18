import React, { Component, useState, useRef } from "react";
import { Card, CardBody, Col, Row, Container, Button } from "reactstrap";
import { makeStyles, Grid } from '@material-ui/core';

//import QRCode from "react-qr-code";
import { AppContext } from "../../AppContext";
import { Auth, API, graphqlOperation } from "aws-amplify";
import { listRemotedbtables } from '../../graphql/queries';
import { getRemotedbtable } from '../../graphql/queries';
import { useEffect } from "react";
import QRCode from 'qrcode';
import QrReader from 'react-qr-reader';


const mysqlAPI = "apirestforbusdb";
const pathmysql = '/customers';

class QrCodeTestCopy extends Component {
  static contextType = AppContext;
  datasfrommysql = [];
  //urlqr = "17802975709";

  /*const [text, setText] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [scanResultFile, setScanResultFile] = useState('');
  */
  //[scanResultWebCam, setScanResultWebCam]: useState,
  classes = useStyles();
  qrRef = useRef(null);
  url = "www.angel-earth.com";


  constructor(props) {
    this.super(props);
    //propsnew = props;
    this.state = {
      type: null,
      url: null,
      isActive: false,
      phone_number: '17809957801',
      scanResultWebCam: '',
    };
    //this.fetchDbLIST('SaadBusiness');
  }

  /*generateQrCode = async () => {
    try {
      const response = await QRCode.toDataURL(text);
      setImageUrl(response);
    } catch (error) {
      console.log(error);
    }
  }
  handleErrorFile = (error) => {
    console.log(error);
  }
  handleScanFile = (result) => {
    if (result) {
      setScanResultFile(result);
    }
  }
  onScanFile = () => {
    qrRef.current.openImageDialog();
  }*/
  handleErrorWebCam = (error) => {
    console.log(error);
  }
  handleScanWebCam = (result) => {
    if (result) {
      this.state.scanResultWebCam = result;
    }
  }

  createconnectiondb = async () => {
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
        bussnessname: 'SaadBusiness',//userAttributes['custom:business_name'],
        bussnesslocation: 'Edmonton', //userAttributes['custom:city'], // 'Calgary', //
      }
    };


    //console.log('Component QRCODE TEST createconnectiondb : ', userAttributes);

    //API.get(mysqlAPI, pathmysql + "/" + this.state.phone_number, myInit)
    API.get(mysqlAPI, pathmysql + "/" + '17802975709', myInit)
      .then(response => {
        console.log(response.data)
        /* let newCustomers = [...datasfrommysql]
         newCustomers.push(response)
         setdatasfrommysql(newCustomers)
         */

      })
      .catch(error => {
        console.log(error)
      })
  }

  /*fetchDbLIST(bussnessId) {
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
  }*/



  // render() {

  /* useEffect(() =>
   {
     fetchDb()
   }
   )*/
  //const fetchDb = async() => {

  /*const { userAttributes } = this.props;
  console.log(' userAttributes custom:business_name : ', userAttributes['custom:business_name']);
  this.fetchDbLIST(userAttributes['custom:business_name']);
  */


  /*return(
    <Container className = { classes.conatiner } >
      <Card>
        <h2 className={classes.title}>Scan QR Code</h2>
        <CardContent>
          <Grid container >
            {/* <Grid item xl={4} lg={4} md={6} sm={12} xs={12}>
              <TextField label="Enter Text Here" onChange={(e) => setText(e.target.value)} />
              <Button className={classes.btn} variant="contained"
                color="primary" onClick={() => generateQrCode()}>Generate</Button>
              <br />
              <br />
              <br />
              {imageUrl ? (
                <a href={imageUrl} download>
                  <img src={imageUrl} alt="img" />
                </a>) : null}
            </Grid>
            <Grid item xl={4} lg={4} md={6} sm={12} xs={12}>
              <Button className={classes.btn} variant="contained" color="secondary" onClick={onScanFile}>Scan Qr Code</Button>
              <QrReader
                ref={qrRef}
                delay={300}
                style={{ width: '100%' }}
                onError={handleErrorFile}
                onScan={handleScanFile}
                legacyMode
              />
              <h3>Scanned Code: {scanResultFile}</h3>
            </Grid> *///}
  /* <Grid item xl={6} lg={6} md={8} sm={12} xs={12}>
     <h3>Qr Code Scanning </h3>
     <QrReader
       delay={300}
       style={{ width: '100%' }}
       onError={handleErrorWebCam}
       onScan={handleScanWebCam}
     />
     <h3>QR CODE data: {scanResultWebCam}</h3>
     <Button className={classes.btn} variant="contained" color="secondary" onClick={createconnectiondb} >
       Test QRCODE
     </Button>
   </Grid>
  </Grid>
  </CardContent>
  </Card>
  </Container>
  );*/


  render() {
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
                <div
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
                    <QRCode value={this.state.phone_number} />
                  </a>}

                  <Button className="companyColour" onClick={this.createconnectiondb} block >
                    Test QRCODE
                  </Button>
                </div>
                <h3 className="mt-4 companyColourSecText">Qr Code Test</h3>
                <p className="companyColourSecText pt-2">Coming Soon</p>
                {/* <Grid item xl={6} lg={6} md={8} sm={12} xs={12}>
                  <h3>Qr Code Scanning </h3>
                  <QrReader
                    delay={300}
                    style={{ width: '100%' }}
                    onError={this.handleErrorWebCam}
                    onScan={this.handleScanWebCam}
                  />
                  <h3>QR CODE data: {this.state.scanResultWebCam}</h3>
                </Grid> */}
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container >
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
export default QrCodeTestCopy;
