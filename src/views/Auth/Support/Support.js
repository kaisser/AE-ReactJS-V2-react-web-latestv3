import React, { Component } from "react";
import { Container, Row, Col } from "reactstrap";
import { Auth } from 'aws-amplify';
import { } from "amazon-connect-chatjs"
class Support extends Component {
  constructor(props) {
    super(props);
    this.state = {
      message: "",
      isChatShowing: true
    };
  }

  componentDidMount() {
    this.buildChat()
  }

  buildChat = () => {
    window.connect.ChatInterface.init({
      containerId: 'theChat',
      headerConfig: {
        isHTML: true,
        render: () => {
          return (`
                  <div class="header-wrapper">
                      <h2 class="welcome-text" style="color:white">Live Chat Support</h2>
                      <p id="chatDescription" style="color:white">Thank you for subscribing to our service! We are here to help you with any questions.</p>
                  </div>
              `)
        }
      }
    });
    this.startChat();
  }

  startChat = async event => {
    var instanceId = "2349338b-dad2-472a-8db5-1bb9b68fd6d1";
    var contactFlowId = "6694b99a-9452-4ad4-bb82-b2179580e7cf";
    var authSession = await Auth.currentSession();
    console.log(authSession);
    window.connect.ChatInterface.initiateChat(
      {
        name: authSession.idToken.payload.name,
        username: authSession.idToken.payload.name,
        region: "us-west-2",
        apiGatewayEndpoint:
          "https://eag8urc58i.execute-api.us-west-2.amazonaws.com/Prod",
        contactAttributes: JSON.stringify({
          token: authSession.idToken.payload.sub,
          customerName: "name"
        }),
        contactFlowId: contactFlowId,
        instanceId: instanceId,
      },
      this.successHandler,
      this.failureHandler
    );
  }

  successHandler = (chatSession) => {
    window.chatSession = chatSession;
    console.log("Success handler done");
  }

  failureHandler = (error) => {
    console.log("There was an error: ", error);
    this.setState({isChatShowing: false, message: "Something went wrong, please try again"})
  }

  restart = () => {
    this.setState({isChatShowing: true});
    this.startChat();
  }

  render() {
    const { isChatShowing, message } = this.state;
    return (
      <div>
        <Container style={{height: "80%"}}>
          <Row className="justify-content-center">
            <Col xl="16" className="justify-content-center mt-5" style={{ display: "flex", justifyContent: "center",alignItem: "center", backgroundColor: "rgba(13,13,13,0.26)", alignSelf:"center", borderRadius: 8}}>
              <div id="theChat" /> 
            </Col>
          </Row>
        </Container>
      </div>
    )
  }
}

export default Support;