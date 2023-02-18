import React, { Component } from "react";
import { Card, CardBody, Col, Row, Container } from "reactstrap";
import QRCode from "react-qr-code";
import { AppContext } from "../../AppContext";
import { Auth , API ,graphqlOperation  } from "aws-amplify";
import {listRemotedbtables} from '../../graphql/queries';
import {getRemotedbtable} from '../../graphql/queries';
import { useEffect } from "react";

class QrCode extends Component {
  static contextType = AppContext;
  constructor(props) {
    super(props);
    this.state = {
      type: null,
      url: null,
      isActive: false,
    };
    //this.fetchDbLIST('SaadBusiness');
  }

  fetchDbLIST(bussnessId){
    console.log('function from fetchDb : ')
    
    try {
      API.graphql(graphqlOperation(getRemotedbtable, {id:bussnessId}))
      .then(function(data) {
          const items = data.data.getRemotedbtable;
         // const items = data;
          console.log(items)
      })      
    } catch (error) {
      console.log(' Error : ',error)
    }
  }

  

  render() {

   /* useEffect(() =>
    {
      fetchDb()
    }
    )*/
    //const fetchDb = async() => {
     
    const { userAttributes } = this.props;
    console.log(' userAttributes custom:business_name : ',userAttributes['custom:business_name']);
    this.fetchDbLIST(userAttributes['custom:business_name']);
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
                  {/* {userAttributes && <a href={`https://oanh9u8jd6.execute-api.us-west-2.amazonaws.com/Production/invokedatabase?message={{${userAttributes.phone_number}}}`}>
                  <QRCode value={`https://oanh9u8jd6.execute-api.us-west-2.amazonaws.com/Production/invokedatabase?message={{${userAttributes.phone_number}}}`}/>
                </a>} */}
                  <QRCode value={url} />
                </div>
                <h3 className="mt-4 companyColourSecText">Qr Code</h3>
                <p className="companyColourSecText pt-2">Coming Soon</p>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    );
  }
}

export default QrCode;
