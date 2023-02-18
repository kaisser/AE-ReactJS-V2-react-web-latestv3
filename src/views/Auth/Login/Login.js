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
import { Box, Alert,AlertTitle } from "@mui/material/";
import Grid from "@mui/material/Grid";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";

import { Auth } from "aws-amplify";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/material.css";
import { color } from "@mui/system";

const Login = (props) => {
  const [username, setUserName] = useState("+");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = (event) => {
    event.preventDefault();
    if (username === "+" || password === "") {
      setError("Please enter your username and password");
      return;
    }

    console.log("login", username, password);

    
    setLoading(true);
    setError("");
    Auth.signIn({
      username,
      password,
    })
      .then((user) => {
        props.history.push("/qrcode");
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        if (error && error.message) {
          console.log(error);
          setError(error.message);
          setLoading(false);
        }
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
            Sign in
          </Typography>
          <Box sx={{ mt: 1 }}>
            <PhoneInput
              inputStyle={{ flex: 1, width: "100%", height: 55 }}
              placeholder="Enter phone number"
              value={username}
              onChange={(phone) => setUserName(`+${phone}`)}
            />

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
            <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label="Remember me"
            />

            {error !== "" && (
              <Alert severity="error">

               {error}
              </Alert>
            )}

            <Button
              type="submit"
              fullWidth
              loading={loading}
              variant="contained"
              onClick={handleLogin}
              sx={{ mt: 3, mb: 2 }}
            >
              Sign In
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
            <br/>
            <Grid style={{ width: "100%"}}>
            
            <Link style={{ width: "100%"}}  to="/landingpage">
                  <UILink style={{fontSize:"60px", fontFamily:"fantasy", width: "100%" ,textAlign: "center",
                                            color: "white", backgroundColor: "rgba(46, 53, 134, 0.9)", borderRadius: 25,}} href="#" variant="body2">
                  Start Landing page
                  </UILink>
                </Link>
            </Grid>
          </Box>
        </Box>
      </Grid>
    </Grid>
  );
};

export default Login;
