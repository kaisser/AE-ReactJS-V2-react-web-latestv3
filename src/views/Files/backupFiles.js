import React, { Component } from "react";
import { useHistory } from "react-router-dom";
import {
  Card,
  CardBody,
  CardHeader,
  Col,
  Row,
  Table,
  Spinner,
  Form,
  InputGroup,
  Input,
  ModalFooter,
  Modal,
  ModalBody,
  ModalHeader,
  Button,
} from "reactstrap";
import { Storage } from "aws-amplify";

function FileRow(props) {
  const file = props.file;
  const fileLink = `/fileviewer/${file.key}`;
  //const fileLink = `/${file.key}`;
  const history = useHistory();
  // const isInvoice = file.file_name.includes("invoice");
  const isInvoice = false; //file.includes("invoice");
  console.log('IN FILEROW :', file);
  const getFileTypeIcon = () => {
    const type = file.key.split(".").pop();
    console.log('IN FILEROW TYPE:', type);
    switch (type.toLowerCase()) {
      case "jpg":
      case "jpeg":
      case "png":
      case "gif":
        return "fa fa-file-image-o";

      case "pdf":
        return "fa fa-file-pdf-o";

      case "xlsx":
        return "fa fa-file-excel-o";
      case "mp4":
        return "fa fa-file-video-o";
      case "doc":
      case "json":
      case "docx":
        return "fa fa-file-word-o";
    }
  };

  if (!isInvoice) {
    return (
      <tr key={file.key.toString()} style={{ color: "white" }}>
        <th
          scope="row"
          onClick={() => {
            history.push(fileLink);
          }}
        >
          {file.name}
        </th>
        <td scope="row">{file.phone_number}</td>
        <td>{file.date}</td>
        <td>{file.location}</td>
        <td>{file.file_name}</td>
        <td
          onClick={() => {
            history.push(fileLink);
          }}
        >
          <i
            className={`${getFileTypeIcon()} fa-sm`}
            style={{ fontSize: "30px" }}

          />
          {getFileTypeIcon()}

        </td>
        <td onClick={props.showDeleteModal}>
          <i className="fa fa-trash-o" style={{ fontSize: "30px" }} />
        </td>
      </tr>
    );
  } else {
    return (
      <tr key={file.key.toString()} style={{ color: "white" }}>
        <th
          scope="row"
          onClick={() => {
            history.push(fileLink);
          }}
        >
          {file.name}
        </th>
        <td scope="row">{file.phone_number}</td>
        <td>{file.date}</td>
        <td>{file.location}</td>
        <td>{file.file_name}</td>
        <td
          onClick={() => {
            history.push(fileLink);
          }}
        >
          <i
            className={`${getFileTypeIcon()} fa-sm`}
            style={{ fontSize: "30px" }}
          />
        </td>
        <td></td>
      </tr>
    );
  }
}

class Business extends Component {
  state = {
    files: null,
    isLoading: true,
    error: null,
    isDropMenuOpen: false,
    searchText: "",
    searchCategory: "Business",
    showDeleteModal: false,
    deleteKey: null,
  };

  componentDidMount() {
    this.getBucket();
  }

  getBucket() {
    this.setState({ isLoading: true });
    const { userAttributes } = this.props;
    console.log({ Storage });
    let phoneNumber = userAttributes["phone_number"].replace("+", "");
    /*Storage.list(`backup/${userAttributes["sub"]}/${phoneNumber}`, {
      level: "public",      
    })
    */
    Storage.list(`folderone/${userAttributes["sub"]}/${phoneNumber}/`, {
      level: "public",
    })
      .then((fileList) => {
        let files = [];
        console.log('RETURN S3 ', fileList.results);
        fileList.results.forEach((file) => {
          console.log('RETURN S3 FILE ', file);
          const arrayPaths = file.key.split("/");
          const key = arrayPaths[arrayPaths.lastIndex];
          if (key.includes(".")) {
            const fileArry = key.split("---");
            console.log('RETURN S3 FILE KEY ', fileArry);
            const fileName = fileArry[fileArry.length - 1].split(".")[0];
            console.log('RETURN S3 FILE fileName ', fileName);
            const userFileName = fileName.split("_")[1];
            console.log('RETURN S3 FILE userFileName ', userFileName);
            const fileData = {
              name: fileArry[1],
              phone_number: fileArry[2],
              date: fileArry[0],
              location: fileArry[3],
              file_name: userFileName,
              key: file.key,
              uploadedData: file.lastModified,
            };
            files.push(fileData);
          }
        });
        let sorted = files.sort((a, b) => {
          return new Date(b.uploadDate) - new Date(a.uploadDate);
        });
        this.setState({ files: sorted });
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        this.setState({ isLoading: false });
      });
  }

  filterFiles() {
    let items;
    const { files, searchText, searchCategory } = this.state;
    if (files === null) {
      return;
    }
    console.log(files);
    if (searchText === "" || searchText === null || searchText === undefined) {
      items = files.map((file, index) => (
        <FileRow
          key={index}
          file={file}
          showDeleteModal={() => this.deleteConfirmation(file.key)}
        />
      ));
    } else {
      items = files.map((file, index) => {
        if (file.name.includes(searchText)) {
          return (
            <FileRow
              key={index}
              file={file}
              showDeleteModal={() => this.deleteConfirmation(file.key)}
            />
          );
        }
      });
    }
    return items;
  }

  planFinder(planNumber) {
    let planString;
    switch (planNumber) {
      case 1:
        planString = "7day/";
        break;
      case 2:
        planString = "14day/";
        break;
      case 3:
        planString = "21day/";
        break;
      case 4:
        planString = "30day/";
        break;
      case 5:
        planString = "premium/";
        break;
      default:
        return null;
    }
    return planString;
  }

  deleteConfirmation = (key) => {
    const { showDeleteModal } = this.state;
    this.setState({ showDeleteModal: !showDeleteModal, deleteKey: key });
  };

  deleteFile = () => {
    const { deleteKey } = this.state;
    Storage.remove(deleteKey, { level: "public" })
      .then(() => {
        this.getBucket();
        this.setState({ showDeleteModal: false, deleteKey: null });
      })
      .catch((error) => {
        this.setState({ error: "Something went wrong with deleting" });
      });
  };

  render() {
    const {
      files,
      isLoading,
      isDropMenuOpen,
      searchCategory,
      searchText,
      showDeleteModal,
    } = this.state;
    return (
      <div className="animated fadeIn mt-5">
        <Row>
          <Col xl={12}>
            <Modal isOpen={showDeleteModal}>
              <ModalHeader
                style={{ textAlign: "center" }}
                className="commmonFont"
              >
                Delete File
              </ModalHeader>
              <ModalBody
                style={{ textAlign: "center" }}
                className="commmonFont"
              >
                Are you sure you want to delete the file?
              </ModalBody>
              <ModalFooter>
                <Row style={{ flex: 1 }}>
                  <Col style={{ textAlign: "center" }}>
                    <Button
                      onClick={() => this.deleteFile()}
                      className="commmonFont"
                    >
                      Confirm
                    </Button>
                  </Col>
                  <Col style={{ textAlign: "center" }}>
                    <Button
                      onClick={() => {
                        this.setState({
                          deleteKey: null,
                          showDeleteModal: false,
                        });
                      }}
                      className="commmonFont"
                    >
                      Cancel
                    </Button>
                  </Col>
                </Row>
              </ModalFooter>
            </Modal>
            <Card
              style={{
                backgroundColor: "#00000000",
                border: 0,
                alignSelf: "center",
              }}
            >
              <CardHeader
                style={{ backgroundColor: "transparent", borderBottom: "none" }}
              >
                <h5 style={{ color: "white" }}>Documents & receipts</h5>
              </CardHeader>
              <CardBody
                style={{
                  backgroundColor: "rgba(13,13,13,0.26)",
                  borderRadius: 8,
                  textAlign: "center",
                }}
              >
                <Table responsive hover>
                  <thead>
                    <tr>
                      <th colSpan={12}>
                        <Form>
                          <InputGroup>
                            <Input
                              type="search"
                              name="search"
                              placeholder="Search Business Name"
                              onChange={(e) => {
                                this.setState({
                                  searchText: `${e.target.value}`,
                                });
                              }}
                            />
                          </InputGroup>
                        </Form>
                      </th>
                    </tr>
                    <tr style={{ color: "white" }}>
                      <th scope="col">Company Name</th>
                      <th scope="col">Phone Number</th>
                      <th scope="col">Date</th>
                      <th scope="col">Location</th>
                      <th scope="col">File Name</th>
                      <th scope="col">File Type</th>
                      <th scope="col">Delete</th>
                    </tr>
                  </thead>
                  <tbody>
                    {isLoading ? (
                      <tr>
                        <th colSpan={12}>
                          <Spinner color="primary" />
                        </th>
                      </tr>
                    ) : null}
                    {(files == null || files.length == 0) &&
                      isLoading === false ? (
                      <tr style={{ color: "white", textAlign: "center" }}>
                        <th scope="col" colSpan={12}>
                          {" "}
                          No Files found{" "}
                        </th>
                      </tr>
                    ) : null}
                    {this.filterFiles()}
                  </tbody>
                </Table>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
    );
  }
}

export default Business;
