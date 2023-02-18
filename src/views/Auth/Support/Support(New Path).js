import React, { Component } from "react";
import { Container, Row, Col } from "reactstrap";
import { Auth } from 'aws-amplify';
import "amazon-connect-streams";
import "amazon-connect-chatjs";
class Support extends Component {
  constructor(props) {
    super(props)
    this.state = {
      userDetails: null,
      error: null
    }
  }
  componentDidMount() {
    this.getUserDetails()
    this.initiateAmazonConnect()
    this.chatSetup()
  }

  getUserDetails = () => {
    Auth.currentUserInfo().then((info) => {
      this.setState({userDetails: info.attributes})
    }).catch((error) => {
      this.setState({error: error})
    })
  }

  initiateAmazonConnect = () => {
    // eslint-disable-next-line no-undef
    connect.core.initCCP(document.getElementById("theChat"), {
      ccpUrl: "https://angel-earth-com.awsapps.com/connect/ccp-v2/chat",
      region: "us-west-2"
    })
  }

  chatSetup = () => {
    // eslint-disable-next-line no-undef
    connect.ChatSession.setGlobalConfig({
      loggerConfig: {
        logger: {
          debug: (msg) => console.debug(msg), // REQUIRED, can be any function
          info: (msg) => console.info(msg), // REQUIRED, can be any function
          warn: (msg) => console.warn(msg), // REQUIRED, can be any function
          error: (msg) => console.error(msg) // REQUIRED, can be any function
        }
      }
    });
  }

  chatSessionCreate = () => {
    // eslint-disable-next-line no-undef
    connect.ChatSession.create({
      chatDetails: { // REQUIRED
        contactId: "...", // REQUIRED
        participantId: "...", // REQUIRED
        participantToken: "...", // REQUIRED
      },
      options: { // optional
        region: "us-east-1", // optional, defaults to `region` set in `connect.ChatSession.setGlobalConfig()`
      },
      // eslint-disable-next-line no-undef
      type: connect.ChatSession.SessionTypes.CUSTOMER, // REQUIRED
    });
  }

  render() {
    return (
      <div>
        <Container style={{height: "80%"}}>
          <Row className="justify-content-center">
            <Col xl="16" className="justify-content-center" style={{ display: "flex", justifyContent: "center" }}>
                <div id="theChat"/>
            </Col>
          </Row>
        </Container>
      </div>
    )
  }
}

export default Support;