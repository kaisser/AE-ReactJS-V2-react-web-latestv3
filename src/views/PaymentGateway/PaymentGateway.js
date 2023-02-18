import React, { Component } from "react";
import SplitForm from './SplitForm'
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { Card, CardBody, CardTitle, ListGroup, ListGroupItem, Row, Col } from "reactstrap";
const stripePromise = loadStripe(process.env.STRIPE_KEY)
class PaymentGateway extends Component {
  constructor(props) {
    super(props);
    this.state = {
      subscriptionNo: 0,
      isLoading: false,
      isPaymentMade: false,
      paymentError: null,
    }
  }

  setPlan(number) {
    this.setState({ subscriptionNo: number })
  }

  renderDescription() {
    const { subscriptionNo } = this.state;
    let text;
    switch( subscriptionNo ) {
      case 1:
        text = "7 Days: Run a Flyer Campaign! for your business at $200.00/per location, and $2.00/per click.";
        break;
      case 2:
        text = "14 Days: Run a Flyer Campaign! for your business at $400.00/per location, and $2.00/per click.";
        break;
      case 3:
        text = "21 Days: Run a Flyer Campaign! for your business at $600.00/per location, and $2.00/per click.";
        break;
      case 4:
        text = "30 Days: Run a Flyer Campaign! for your business at $800.00/per location, and $2.00/per click.";
        break;
      default:
        text = "Select a plan above";
    }

    return (
      <div>
        <p>{text}</p>
        <p>All subscriptions include live Chat from 8am - 8pm Mountain Time (UTC-7)</p>
        <p style={{display: "inline"}}>For National Accounts, please </p><a style={{display: "inline"}} href="https://www.angel-earth.ca/#footer" target={"_blank"}>Contact us</a>
      </div>
    )
  }

  render() { // Selection and have a next button on the first page
    let { subscriptionNo } = this.state;
    return (
      <div style={{ alignSelf: "center", alignItems: "center" }} className="mt-5">
        <Row>
          <Col md={4}>
            <Row>
              <Card style={{ flexDirection: "row", flex: 1, borderRadius: 16, backgroundColor: "transparent", border: 0 }}>
                <CardBody style={{ backgroundColor: "rgba(13,13,13,0.26)", borderRadius: 16 }}>
                  <CardTitle style={{ color: "white", fontSize: 24 }} className={"commonFont"}>Select a Plan Selection</CardTitle>
                  <ListGroup>
                    <ListGroupItem
                      style={{ borderRadius: 16, marginBottom: "8px", backgroundColor: "transparent", color: "white", border: 0, marginRight: "8px" }}
                      className={subscriptionNo == 1 ? "greenBackgroundLinar" : ""}
                      action
                      active={subscriptionNo == 1}
                      onClick={() => {
                        this.setPlan(1)
                      }}>
                      7 days Flyer + Per Click
                    </ListGroupItem>
                    <ListGroupItem
                      style={{ borderRadius: 16, marginBottom: "8px", backgroundColor: "transparent", color: "white", border: 0 }}
                      className={subscriptionNo == 2 ? "greenBackgroundLinar" : ""}
                      action
                      active={subscriptionNo == 2}
                      onClick={() => {
                        this.setPlan(2)
                      }}>
                      14 days Flyer + Per Click
                    </ListGroupItem>
                    <ListGroupItem
                      style={{ borderRadius: 16, marginBottom: "8px", backgroundColor: "transparent", color: "white", border: 0 }}
                      className={subscriptionNo == 3 ? "greenBackgroundLinar" : ""}
                      action
                      active={subscriptionNo == 3}
                      onClick={() => {
                        this.setPlan(3)
                      }}>
                      21 days Flyer + Per Click
                    </ListGroupItem>
                    <ListGroupItem
                      style={{ borderRadius: 16, backgroundColor: "transparent", color: "white", border: 0 }}
                      className={subscriptionNo == 4 ? "greenBackgroundLinar" : ""}
                      action
                      active={subscriptionNo == 4}
                      onClick={() => {
                        this.setPlan(4)
                      }}>
                      30 days Flyer + Per Click
                    </ListGroupItem>
                  </ListGroup>
                </CardBody>
              </Card>
            </Row>
            { subscriptionNo !== 0 ? <Row>
              <Card style={{ flexDirection: "row", flex: 1, borderRadius: 16, backgroundColor: "transparent", border: 0 }}>
                <CardBody style={{ backgroundColor: "rgba(13,13,13,0.26)", borderRadius: 16, color: "white" }}>
                  <CardTitle className="commonFont">Plan Details</CardTitle>
                  <CardBody className="commonFont">
                    {this.renderDescription()}
                  </CardBody>
                </CardBody>
              </Card>
            </Row> : null}
          </Col>
          <Col md={6}>
            {subscriptionNo != 0 ? <Card style={{ borderRadius: 16, backgroundColor: "transparent", border: 0 }}>
              <CardBody style={{ backgroundColor: "rgba(13,13,13,0.26)", borderRadius: 16 }}>
                <CardTitle style={{ color: "white", fontSize: 32 }}>Payment</CardTitle>
                <Elements stripe={stripePromise}>
                  <SplitForm
                    userAttributes={this.props.userAttributes}
                    checkUserAttributes={() => this.props.checkUserAttributes()}
                    planNumber={subscriptionNo} />
                </Elements>
              </CardBody>
            </Card> : null}
          </Col>
        </Row>
      </div>
    );
  }
}

export default PaymentGateway;