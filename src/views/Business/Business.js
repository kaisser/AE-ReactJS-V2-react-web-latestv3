import React, { Component } from "react";
import {
    Card,
    Grid,
    Button,
    CircularProgress,
    Alert,
    CardContent,
    Box,
    TextField,
    InputAdornment
} from "@mui/material";
import {PinDrop} from '@mui/icons-material';
//import { Picker } from "aws-amplify-react"; // Attempt replacement of picker for PhotoPicker
//import { Picker } from "@aws-amplify/ui-react";
//import { Picker } from "@react-native-picker/picker";
import { Storage, Geo } from "aws-amplify";

class Business extends Component {
    state = {
        file: null,
        previewSrc: null,
        userFileName: "",
        location: "",
        loading: false,
        error: null,
        address: null,
        predictedAddress: [],
        category: "Flyers",
        isComplete: false,
    };

    planFinder(planNumber) {
        switch (planNumber) {
            case "1":
                return "7day/";
            case "2":
                return "14day/";
            case "3":
                return "21day/";
            case "4":
                return "30day/";
            case "5":
                return "premium/";
            default:
                return;
        }
    }

    onUploadImage = () => {
        this.setState({ loading: true });
        const { file, address, predictedAddress, category } = this.state;
        const { userAttributes } = this.props;
        const addressObject = predictedAddress.find(
            (addressItem) => address === addressItem.label
        );
        let planType = this.planFinder(
            userAttributes["custom:subscription_type"]
        );
        if (file && userAttributes) {
            let current_datetime = new Date();
            let formatted_date =
                current_datetime.getDate() +
                "-" +
                (current_datetime.getMonth() + 1) +
                "-" +
                current_datetime.getFullYear();

            const { name, type, file: uploadFile } = file;
            let phoneNumberString = userAttributes.phone_number.replace(
                "+",
                ""
            );
            const fileName = `${formatted_date}---${userAttributes["custom:business_name"]}---${phoneNumberString}---${userAttributes.sub}---${userAttributes["custom:city"]}---${name}`;
            if (/[*+?^${}()|[\]\\'!&$@=%`~\/\"]/.test(name)) {
                this.setState({
                    error: "Please rename the file without any special characters. E.g approstophies, question marks or exclemation marks",
                    loading: false,
                });
                return;
            }
            if (
                type
                    .split("/")
                    .pop()
                    .toLowerCase()
                    .match(/png|jpg|jpeg|pdf/)
                // .match(
                //   /mp4|png|gif|jpg|jpeg|bmp|pdf|vnd.openxmlformats-officedocument.wordprocessingml.document|vnd.openxmlformats-officedocument.spreadsheetml.sheet/
                // )
            ) {
                let points =
                    addressObject !== undefined
                        ? `${addressObject.geometry.point[1]}, ${addressObject.geometry.point[0]}`
                        : "NA";
                Storage.put("business/" + planType + fileName, uploadFile, {
                    //This needs to add subscriptionType into the name
                    contentType: type,
                    metadata: {
                        address:
                            addressObject != undefined
                                ? addressObject.label
                                : address,
                        neighbourhood:
                            addressObject != undefined
                                ? addressObject.neighborhood
                                : "NA",
                        latAndLong: points,
                        category: category,
                    },
                })
                    .then((result) => {
                        console.log(result);
                        this.setState({
                            loading: false,
                            file: null,
                            error: null,
                            isComplete: true,
                        });
                    })
                    .catch((err) => {
                        console.log(err);
                        this.setState({
                            loading: false,
                            file: null,
                            error: err,
                            isComplete: false,
                        });
                    });
            } else {
                this.setState({
                    file: null,
                    loading: false,
                    error: ` File Type ('${type}') is not supported`,
                    isComplete: false,
                });
            }
        }
    };

    imageSetter = (file) => {
        this.setState({
            file: file,
            previewSrc: URL.createObjectURL(file.file),
            isComplete: false,
        });
    };

    addressSearch = (e) => {
        this.setState({ address: e.target.value });
        Geo.searchByText(e.target.value)
            .then((result) => {
                this.setState({ predictedAddress: result });
            })
            .catch((err) => {
                console.log(err);
            });
    };

    render() {
        const {
            file,
            loading,
            error,
            previewSrc,
            predictedAddress,
            category,
            address,
            isComplete,
        } = this.state;
        console.log(predictedAddress);
        return (
            <Box  sx={{ maxWidth: 400 }} container justify = "center">
                <Grid container justify = "center">
                    <Grid lg={12}>
                        <Card
                            style={{ backgroundColor: "#00000000", border: 0 }}
                        >
                            <CardContent
                               
                            >
                                {error && (
                                    <Alert
                                        color="error"
                                        style={{
                                            textAlign: "center",
                                            color: "white",
                                        }}
                                    >
                                        {error}
                                    </Alert>
                                )}

                                {!file && !loading && (
                                    <React.Fragment>
                                        <Box
                                            component="form"
                                            sx={{
                                                "& .MuiTextField-root": {
                                                    m: 1,
                                                    width: "25ch",
                                                },
                                            }}
                                            noValidate
                                            autoComplete="off"
                                        >
                                           

                                            <TextField
                                                id="input-with-icon-textfield"
                                                type="text"
                                                onChange={(e) =>
                                                    this.setState({
                                                        location: `${e.target.value}`,
                                                    })
                                                }
                                                label="Supporting types: jpeg, png, pdf, jpg"
                                                InputProps={{
                                                    startAdornment: (
                                                        <InputAdornment position="start">
                                                            <PinDrop />
                                                        </InputAdornment>
                                                    ),
                                                }}
                                                variant="standard"
                                            />
                                        </Box>
                                        <div className="uploadButton">
                                            {/* <Picker
                                                headerHint={
                                                    "Upload Documents as Image"
                                                }
                                                headerText={"Documents"}
                                                title={"Select Document"}
                                                onPick={(file) => {
                                                    this.imageSetter(file);
                                                    this.setState({
                                                        error: null,
                                                    });
                                                }} //Figuere how to filter the file name
                                                className="companyColourSecButton"
                                            /> */}


                                        </div>
                                        <div className="App">
                                            <h2>S3 Upload example...</h2>
                                            <input
                                            type="file"
                                            accept="image/png, image/jpeg"
                                            style={{ display: "none" }}
                                            ref={ref => (this.upload = ref)}
                                            onChange={e => 
                                                {
                                                    this.imageSetter(this.upload.files[0]);
                                                    this.setState({
                                                        error: null,
                                                        userFileName: this.upload.files[0].name,
                                                    })
                                                }
                                                
                                            }
                                            />
                                            <input value={this.state.userFileName} placeholder="Select file" />
                                            <button
                                            onClick={e => {
                                                this.upload.value = null;
                                                this.upload.click();
                                            }}
                                            //loading={this.state.uploading}
                                            >
                                            Browse
                                            </button>

                                            {/* <button onClick={this.uploadImage}> Upload File </button>

                                            {!!this.state.response && <div>{this.state.response}</div>} */}
                                        </div>
                                        {isComplete ? (
                                            <Alert
                                                color="success"
                                                style={{
                                                    textAlign: "center",
                                                    marginTop: 16,
                                                }}
                                            >
                                                Your file has been uploaded
                                            </Alert>
                                        ) : null}
                                    </React.Fragment>
                                )}

                                {file && !loading && (
                                    <div
                                        style={{
                                            width: "100%",
                                            justifyItems: "center",
                                        }}
                                    >
                                        <img
                                            src={previewSrc}
                                            alt="PreviewdImage"
                                            style={{
                                                alignSelf: "center",
                                                width: "100%",
                                                maxWidth: "600px",
                                                display: "block",
                                                justifySelf: "center",
                                            }}
                                        />
                                        <label style={{ width: "100%" }}>
                                            Upload File Type
                                            <select
                                                value={category}
                                                onChange={(event) =>
                                                    this.setState({
                                                        category:
                                                            event.target.value,
                                                    })
                                                }
                                                style={{ width: "100%" }}
                                            >
                                                <option value="Flyers">
                                                    Flyers
                                                </option>
                                                <option value="Coupons">
                                                    Coupons
                                                </option>
                                            </select>
                                        </label>
                                        <input
                                            placeholder="Buisiness Address"
                                            list="searchResult"
                                            type={"text"}
                                            value={this.state.address}
                                            onChange={this.addressSearch}
                                            style={{
                                                width: "100%",
                                                marginTop: 16,
                                            }}
                                        />
                                        <datalist id="searchResult">
                                            {predictedAddress.map(
                                                (address, index) => {
                                                    return (
                                                        <option
                                                            key={index}
                                                            value={
                                                                address.label
                                                            }
                                                        />
                                                    );
                                                }
                                            )}
                                        </datalist>
                                        <Button
                                            style={{
                                                width: "100%",
                                                marginTop: 16,
                                                marginBottom: 16,
                                            }}
                                            className="center text-center companyColour"
                                            onClick={() =>
                                                this.setState({ file: null })
                                            }
                                        >
                                            Discard
                                        </Button>
                                        <Button
                                            style={{ width: "100%" }}
                                            className="fa fa-file center text-center companyColour"
                                            onClick={this.onUploadImage}
                                            disabled={
                                                address === "" ||
                                                address === null
                                            }
                                        >
                                            {" "}
                                            Upload Document
                                        </Button>
                                    </div>
                                )}
                                {loading && (
                                    <CircularProgress color="primary" />
                                )}
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            </Box>
        );
    }
}

export default Business;
