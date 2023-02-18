import React, { Component, Suspense, useState, useEffect } from "react";
import { Redirect, Route, Switch } from "react-router-dom";
import * as router from "react-router-dom";

import { styled, createTheme, ThemeProvider } from "@mui/material/styles";
import { Collapse } from "@mui/material";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import CssBaseline from "@mui/material/CssBaseline";
import MuiDrawer from "@mui/material/Drawer";
import Box from "@mui/material/Box";
import MuiAppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Badge from "@mui/material/Badge";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Link from "@mui/material/Link";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import NotificationsIcon from "@mui/icons-material/Notifications";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import {
    Dashboard,
    QrCode,
    CloudUpload,
    Newspaper,
    AccountCircle,
    ContactSupport,
    DriveFileMove,
    Discount,
    Payment,
    PictureAsPdf,
} from "@mui/icons-material";

// sidebar nav config
import navigation from "../../_nav";
// routes config
import routes from "../../routes";
import { Auth } from "aws-amplify";
import { AppContext } from "../../AppContext";
import logo from "../../assets/img/LogoIcon.png";
//import { TOTPSetupComp } from "aws-amplify-react";

const DefaultFooter = React.lazy(() => import("./DefaultFooter"));
const drawerWidth = 240;
const DefaultLayout = (props) => {
    const [nav, setNav] = useState([]);
    const [isLogin, setIsLogin] = useState(false);
    const [userInfo, setUserInfo] = useState();
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = React.useState(true);
    const toggleDrawer = () => {
        setOpen(!open);
    };

    const [FileOpen, setFileOpen] = React.useState(true);

    const handleClickFile = () => {
      setFileOpen(!FileOpen);
    };

    const renderLoading = () => (
        <div className="animated fadeIn pt-1 text-center">Loading...</div>
    );

    useEffect(() => {
        checkUserAttributes();
        return;
    }, []);

    const Icons = {
        Dashboard,
        QrCode,
        CloudUpload,
        Newspaper,
        AccountCircle,
        ContactSupport,
        DriveFileMove,
        Discount,
        Payment,
        PictureAsPdf,
    };

    const checkUserAttributes = () => {
        Auth.currentUserInfo()
            .then((user) => {
                setIsLogin(true);
                setLoading(true);
                setUserInfo(user.attributes);

                let tmp = {};
                tmp["items"] = navigation.items.filter((routes) => {
                    return routes.role.find(
                        (role) => role === user.attributes["custom:role"]
                    );
                });

                if (user.attributes["custom:paid_user"] === "true") {
                    for (var element of tmp.items) {
                        if (element.attributes !== undefined) {
                            if (user.attributes["custom:subscription_type"]) {
                                if (
                                    element.name === "Upload Flyers" &&
                                    user.attributes[
                                        "custom:subscription_type"
                                    ] !== "0"
                                ) {
                                    element.attributes.disabled = false;
                                }
                                if (
                                    element.name === "Support" &&
                                    user.attributes[
                                        "custom:subscription_type"
                                    ] !== "0"
                                ) {
                                    element.attributes.disabled = false;
                                }
                            }
                        }
                    }
                } else {
                    if (tmp.items.name === "Upload Flyers") {
                        tmp.items.attributes.disabled = true;
                    }
                    if (tmp.items.name === "Support") {
                        tmp.items.attributes.disabled = true;
                    }
                }
                console.log("nav user infos", tmp, user.attributes);
                setLoading(false);
                setUserInfo(user.attributes);
                setNav([...tmp.items]);
                return;
            })
            .catch((err) => {
                this.setState({ userInfo: null, loading: false });
                setUserInfo();
                setLoading(false);
                return;
            });
    };

    const signOut = async (e) => {
        e.preventDefault();
        await Auth.signOut().finally(() => {
            this.setState({ userInfo: null, loading: false });
        });
        this.props.history.push("/login");
    };

    const updateSideBarText = () => {
        const { nav } = this.state;
        return nav.items.map((item) => {
            if (item.attributes !== undefined) {
                if (item.attributes.disabled === true) {
                    item.badge.text = "Paid Only";
                } else {
                    if (item.name === "Upload Flyers") {
                        item.badge.text = "Upload";
                    } else {
                        item.badge.text = "";
                    }
                }
            }
            return item;
        });
    };

    const AppBar = styled(MuiAppBar, {
        shouldForwardProp: (prop) => prop !== "open",
    })(({ theme, open }) => ({
        zIndex: theme.zIndex.drawer + 1,
        transition: theme.transitions.create(["width", "margin"], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        ...(open && {
            marginLeft: drawerWidth,
            width: `calc(100% - ${drawerWidth}px)`,
            transition: theme.transitions.create(["width", "margin"], {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.enteringScreen,
            }),
        }),
    }));
    const renderCollabseNav = (item,name) => {
      
        return (
            <>
                <ListItemButton onClick={handleClickFile}>
                    <ListItemIcon>
                        <PictureAsPdf />
                    </ListItemIcon>
                    <ListItemText primary={name} />
                    {FileOpen ? <ExpandLess /> : <ExpandMore />}
                </ListItemButton>
                <Collapse in={FileOpen} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding>
                        {item.map((nav) => {
                            const IconsShow = Icons[nav.icon];
                            return (
                                <ListItemButton
                                    key={`${nav.icon + nav.name}`}
                                    component="nav"
                                    onClick={() => {
                                        props.history.push(nav.url);
                                    }}
                                    sx={{ pl: 4 }}
                                >
                                    <ListItemIcon>
                                        {IconsShow && <IconsShow />}
                                    </ListItemIcon>
                                    <ListItemText primary={nav.name} />
                                </ListItemButton>
                            );
                        })}
                    </List>
                </Collapse>
            </>
        );
    };

    const Drawer = styled(MuiDrawer, {
        shouldForwardProp: (prop) => prop !== "open",
    })(({ theme, open }) => ({
        "& .MuiDrawer-paper": {
            position: "relative",
            whiteSpace: "nowrap",
            width: drawerWidth,
            transition: theme.transitions.create("width", {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.enteringScreen,
            }),
            boxSizing: "border-box",
            ...(!open && {
                overflowX: "hidden",
                transition: theme.transitions.create("width", {
                    easing: theme.transitions.easing.sharp,
                    duration: theme.transitions.duration.leavingScreen,
                }),
                width: theme.spacing(7),
                [theme.breakpoints.up("sm")]: {
                    width: theme.spacing(9),
                },
            }),
        },
    }));

    const mdTheme = createTheme();

    return (
        <Box sx={{ display: "flex" }}>
            <CssBaseline />
            <AppBar position="absolute" open={open}>
                <Toolbar
                    sx={{
                        pr: "24px", // keep right padding when drawer closed
                    }}
                >
                    <IconButton
                        edge="start"
                        color="inherit"
                        aria-label="open drawer"
                        onClick={toggleDrawer}
                        sx={{
                            marginRight: "36px",
                            ...(open && { display: "none" }),
                        }}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography
                        component="h1"
                        variant="h6"
                        color="inherit"
                        noWrap
                        sx={{ flexGrow: 1 }}
                    >
                        Angle Earth
                    </Typography>
                    <IconButton color="inherit">
                        <Badge badgeContent={4} color="secondary">
                            <NotificationsIcon />
                        </Badge>
                    </IconButton>
                </Toolbar>
            </AppBar>
            <Drawer variant="permanent" open={open}>
                <Toolbar
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "flex-end",
                        px: [1],
                    }}
                >
                    <IconButton onClick={toggleDrawer}>
                        <ChevronLeftIcon />
                    </IconButton>
                </Toolbar>
                <Divider />
                <List component="nav">
                    {/* {mainListItems} */}

                    {nav.map((item) => {
                        const IconsShow = Icons[item.icon];
                        if (item.children) {
                            return renderCollabseNav(item.children,item.name);
                        }
                        return (
                            <ListItemButton
                                key={`${item.icon + item.name}`}
                                component="nav"
                                onClick={() => {
                                    props.history.push(item.url);
                                }}
                            >
                                <ListItemIcon>
                                    {IconsShow && <IconsShow />}
                                </ListItemIcon>
                                <ListItemText primary={item.name} />
                            </ListItemButton>
                        );
                    })}
                    <Divider sx={{ my: 1 }} />
                    {/* {secondaryListItems} */}
                </List>
            </Drawer>
            <Box
                component="main"
                sx={{
                    backgroundColor: (theme) =>
                        theme.palette.mode === "light"
                            ? theme.palette.grey[100]
                            : theme.palette.grey[900],
                    flexGrow: 1,
                    height: "100vh",
                    overflow: "auto",
                }}
            >
                <Toolbar />
                <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
                    <Grid container spacing={3}>
                        {/* Chart */}

                        {/* Recent Orders */}
                        <Grid item xs={12}>
                            <Paper
                                sx={{
                                    p: 2,
                                    display: "flex",
                                    flexDirection: "column",
                                }}
                            >
                                {!loading && userInfo && (
                                    <Suspense fallback={renderLoading}>
                                        {" "}
                                        <Switch>
                                            {routes.map((route, idx) => {
                                                return route.component &&
                                                    route.role.find(
                                                        (role) =>
                                                            role ===
                                                            userInfo[
                                                                "custom:role"
                                                            ]
                                                    ) ? (
                                                    <Route
                                                        key={idx}
                                                        path={route.path}
                                                        exact={route.exact}
                                                        name={route.name}
                                                        render={(props) => (
                                                            <route.component
                                                                {...props}
                                                                userAttributes={
                                                                    userInfo
                                                                }
                                                                checkUserAttributes={() => {
                                                                    this.checkUserAttributes();
                                                                }}
                                                                onLogout={(e) =>
                                                                    signOut(
                                                                        e
                                                                    )
                                                                }
                                                            />
                                                        )}
                                                    />
                                                ) : null;
                                            })}
                                            <Redirect from="/" to="/qrcode" />
                                        </Switch>
                                    </Suspense>
                                )}
                            </Paper>
                        </Grid>
                    </Grid>
                    {/* <Copyright sx={{ pt: 4 }} /> */}
                </Container>
            </Box>
        </Box>

        // <div className="app companyBackgroundLinar">
        //   {/* <AppHeader fixed>
        //         <DefaultHeader/>
        //     </AppHeader> */}
        //   {!loading && userInfo && (
        //     <div className="app-body">
        //       <AppSidebar
        //         fixed
        //         display="lg"
        //         style={{ background: "#011948" }}
        //         isOpen={true}
        //       >
        //         <AppSidebarHeader>
        //           <router.Link to={"/qrcode"}>
        //             <AppNavbarBrand full={{ src: logo, width: 16, alt: "Logo" }} />
        //           </router.Link>
        //         </AppSidebarHeader>
        //         <AppSidebarForm />
        //         <Suspense>
        //           <AppSidebarNav
        //             className="commonFont"
        //             navConfig={{ items: this.updateSideBarText() }}
        //             {...this.props}
        //             router={router}
        //           />
        //         </Suspense>
        //         <AppSidebarFooter />
        //       </AppSidebar>
        //       <main className="main">
        //         <Container fluid>
        //           <Suspense fallback={this.loading()}>
        //             <Switch>
        //               {routes.map((route, idx) => {
        //                 return route.component &&
        //                   route.role.find(
        //                     (role) => role === userInfo["custom:role"]
        //                   ) ? (
        //                   <Route
        //                     key={idx}
        //                     path={route.path}
        //                     exact={route.exact}
        //                     name={route.name}
        //                     render={(props) => (
        //                       <route.component
        //                         {...props}
        //                         userAttributes={userInfo}
        //                         checkUserAttributes={() => {
        //                           this.checkUserAttributes();
        //                         }}
        //                         onLogout={(e) => this.signOut(e)}
        //                       />
        //                     )}
        //                   />
        //                 ) : null;
        //               })}
        //               <Redirect from="/" to="/qrcode" />
        //             </Switch>
        //           </Suspense>
        //         </Container>
        //       </main>
        //     </div>
        //   )}
        //   <AppFooter>
        //     <Suspense
        //       fallback={this.loading()}
        //       style={{ backgroundColor: "rgb(6,87,118)" }}
        //     >
        //       <DefaultFooter />
        //     </Suspense>
        //   </AppFooter>
        // </div>
    );
};

export default DefaultLayout;
