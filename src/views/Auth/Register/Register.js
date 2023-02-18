import { Link } from "react-router-dom";

import React, { useState } from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/lab/LoadingButton";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import UILink from "@mui/material/Link";
import Paper from "@mui/material/Paper";
import {
  Box,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,

} from "@mui/material/";
import Grid from "@mui/material/Grid";
import LockOutlinedIcon from "@mui/icons-material/PermIdentity";
import Typography from "@mui/material/Typography";

import { Auth } from "aws-amplify";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/material.css";
const Register = (props) => {
  const [phone_number, setphone_number] = useState("");
  const [error, setError] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  //const [country, setCountry] = useState("");
  //const [city, setCity] = useState("");
  const [privacyAgreed, setPrivicyAgreed] = useState("");
  const [termsAgreed, setTermsAgreed] = useState("");
  const [loading, setLoading] = useState("");
  const [email, setEmail] = useState("");
  const [cPassword, setCPassword] = useState("");
  const [business_name, setBusinessName] = useState("");
  const validateEmail = (email) => {
    var re =
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  };

  const checkFields = () => {
    if (role === "Business") {
      return (
        phone_number === "" ||
        password === "" ||
        name === "" ||
        business_name === "" ||
        //city === "" ||
        //country === "" ||
        privacyAgreed === false ||
        termsAgreed === false ||
        !validateEmail(email) ||
        password.length < 8 ||
        password != cPassword
      );
    } else if (role === "Personal-Account") {
      return (
        phone_number === "" ||
        password === "" ||
        name === "" ||
        //city === "" ||
        //country === "" ||
        privacyAgreed === false ||
        termsAgreed === false ||
        !validateEmail(email) ||
        password.length < 8 ||
        password != cPassword
      );
    } else {
      return true;
    }
  };

  const handleSignUP = () => {
    setLoading(true);
    setError("");
    let lowerCaseEmail = email.toLowerCase();

    Auth.signUp({
      password,
      username: phone_number,
      phone_number,
      email: lowerCaseEmail,
      attributes: {
        phone_number: phone_number,
        email: lowerCaseEmail,
        name,
        "custom:business_name": business_name,
        "custom:role": role,
       // "custom:country": country,
       // "custom:city": city,
      },
      validationData: [], //optional
    })
      .then((data) => {
        setLoading(false);
        setError("");
        props.history.push({
          pathname: `/verify/${email}/${phone_number}`,
          state: {
            user: data,
          },
        });
      })
      .catch((error) => {
        console.log(error);
        if (error && error.message) {
          setLoading(false);
          setError(error.message);
        }
      });
  };

  const routeLogin = () => {
    props.history.push({
      pathname: `/login`,
    });
  };

  return (
    <Grid container component="main" sx={{ height: "100vh" }}>
      <CssBaseline />
      <Grid
        item
        xs={false}
        sm={4}
        md={7}
        sx={{
          backgroundImage:
            "url(https://images.unsplash.com/photo-1492168732976-2676c584c675)",
          backgroundRepeat: "no-repeat",
          backgroundColor: (t) =>
            t.palette.mode === "light"
              ? t.palette.grey[50]
              : t.palette.grey[900],
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
      <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
        <Box
          sx={{
            my: 8,
            mx: 4,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign up
          </Typography>
          <Box sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              name="Name"
              label="Full Name"
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              autoComplete="name"
            />

            <TextField
              margin="normal"
              required
              fullWidth
              name="Email"
              label="Email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              autoComplete="email"
            />

            <PhoneInput
              inputStyle={{
                flex: 1,
                width: "100%",
                height: 55,
                marginTop: 5,
                marginBottom: 10,
              }}
              placeholder="Enter phone number"
              value={phone_number}
              onChange={(phone, country) => {
                setphone_number(`+${phone}`);
                //setCountry(country);
              }}
            />

            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">Role</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={role}
                label="Role"
                onChange={(event) => {
                  setRole(event.target.value);
                }}
              >
                <MenuItem value={"Business"}>Business</MenuItem>
                <MenuItem value={"Personal-Account"}>Personal-Account V2</MenuItem>
                <MenuItem value={20}>Personal-Account</MenuItem>
              </Select>
            </FormControl>

            {role === "Business" && (
              <TextField
                margin="normal"
                required
                fullWidth
                name="Business"
                label="Business Name"
                type="text"
                value={business_name}
                onChange={(event) => setBusinessName(event.target.value)}
              />
            )}
            {/* <TextField
              margin="normal"
              required
              fullWidth
              name="City"
              label="City"
              type="text"
              value={city}
              onChange={(event) => setCity(event.target.value)}
            /> */}

            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete="current-password"
            />

            <TextField
              margin="normal"
              required
              fullWidth
              name="Confrim Password"
              label="Password"
              type="password"
              value={cPassword}
              onChange={(event) => setCPassword(event.target.value)}
              autoComplete="current-password"
            />

            <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label="You agree to our Privacy Policy"
            />
            <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label="You agree to our Terms & Conditions"
            />

            {error !== "" && <Alert severity="error">{error}</Alert>}

            <Button
              type="submit"
              disabled={checkFields()}
              fullWidth
              loading={loading}
              variant="contained"
              onClick={handleSignUP}
              sx={{ mt: 3, mb: 2 }}
            >
              Sign Up
            </Button>
            <Grid container>
              <Grid item xs>
                <Link to="/ForgotPassword">
                  <UILink href="#" variant="body2">
                    Forgot password?
                  </UILink>
                </Link>
              </Grid>
              <Grid item>
                <Link to="/register">
                  <UILink href="#" variant="body2">
                    {"Don't have an account? Sign Up"}
                  </UILink>
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Grid>
    </Grid>
  );
};

export default Register;
