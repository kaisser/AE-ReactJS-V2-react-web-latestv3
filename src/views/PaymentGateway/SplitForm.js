import React, { useMemo, useState } from "react";

import {
  useStripe,
  useElements,
  CardNumberElement,
  CardCvcElement,
  CardExpiryElement
} from "@stripe/react-stripe-js";
import {
  FormGroup,
  Button,
  Form,
  Spinner,
  ToastHeader,
  ToastBody,
  Toast
} from 'reactstrap';
import './styles.css';

const useOptions = () => {
  const fontSize = "16px";
  const options = useMemo(
    () => ({
      style: {
        base: {
          fontSize,
          color: "white",
          letterSpacing: "0.025em",
          fontFamily: "Source Code Pro, monospace",
          "::placeholder": {
            color: "#BBC5CF"
          }
        },
        invalid: {
          color: "#c72051"
        }
      }
    }),
    [fontSize]
  );

  return options;
};

const SplitForm = (props) => {
  const { planNumber, checkUserAttributes, userAttributes} = props;
  const stripe = useStripe();
  const elements = useElements();
  const options = useOptions();
  const [loading, setLoading] = useState(false);
  const [paymentMade, setPaymentMade] = useState(false);
  const [paymentError, setPaymentError] = useState(false)

  const createCustomer = (paymentMethod) => {
    var companyName = userAttributes['custom:business_name']
    const params = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: userAttributes.email,
        name: companyName,
        sub: userAttributes.sub,  
        subType: planNumber,
        paymentMethodId: paymentMethod.id,
        userName: userAttributes.phone_number
      }),
    };
    fetch('https://r1mtp5lnnf.execute-api.us-west-2.amazonaws.com/Prod/stripesubscriptions', params).then((result) => {
    }).then((result) => {
      setLoading(false);
      setPaymentMade(true);
    }).catch((error) => {
      console.log("Payment gateway failed with: ", error)
    }).finally(() => {
      checkUserAttributes();
    })
  }

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js has not loaded yet. Make sure to disable
      // form submission until Stripe.js has loaded.
      return;
    }
    setLoading(true);
    await stripe.createPaymentMethod({
      type: "card",
      card: elements.getElement(CardNumberElement)
    }).then((result) => {
      if (result.error) {
        setPaymentError(result.error)
      } else {
        createCustomer(
          result.paymentMethod
        );
      };
    });
  };
  
  return (
      <div className="stripContianer">
        <div className="col-md-12" style={{color: "white"}}>
          <h5 style={{paddingLeft: "10px"}}>Name: {props.userAttributes.name} </h5>
          <h5 style={{paddingLeft: "10px"}}>Business Name: {props.userAttributes['custom:business_name']} </h5>
          <h5 style={{paddingLeft: "10px"}}>Phone Number: {props.userAttributes.phone_number} </h5>
    <Form onSubmit={handleSubmit} >
      <FormGroup className="StripeElement commmonFont">
        <CardNumberElement
          options={options}
       />
      </FormGroup>
      <FormGroup className="StripeElement commmonFont">
        <CardExpiryElement
          options={options}
        />
      </FormGroup>
      <FormGroup className="StripeElement commmonFont" style={{paddingBottom: "20px"}}>
        <CardCvcElement
          options={options}
        />
      </FormGroup>
      { (paymentMade || loading) ? null : <Button className="commmonFont greenBackgroundLinar" type="submit" disabled={!stripe || loading} size="lg" block>
        Subscribe
      </Button> }
        </Form>
        </div>
         {loading ? <Spinner color="primary" style={{margin: "0 35% 0 45%"}} />  : ""}
                {paymentMade ? <Toast style={{margin: "auto", marginTop: 8}}>
          <ToastHeader className='commmonFont'>
            Payment Made
          </ToastHeader>
          <ToastBody className='commmonFont'>
            Thank You, You Have Subscribed!
          </ToastBody>
        </Toast> : ""}
                {paymentError ? <Toast style={{margin: "auto", marginTop: 8}}>
          <ToastHeader className='commmonFont'>
            Payment Error
          </ToastHeader>
          <ToastBody className='commmonFont'>
            Please Try Again
          </ToastBody>
        </Toast> : ""}
    </div>
  );
};

export default SplitForm;
