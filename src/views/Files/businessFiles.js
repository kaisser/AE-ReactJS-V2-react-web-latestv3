import React, { Component } from 'react';
import { useHistory } from 'react-router-dom';
import { Card, CardBody, CardHeader, Col, Row, Table, Button, Spinner, Form, Input, InputGroup, ModalFooter, Modal, ModalBody, ModalHeader } from 'reactstrap';
import { Storage, Auth, API } from 'aws-amplify';

function FileRow(props) {
  const file = props.file
  const fileLink = `/fileviewer/${file.key}`.replace("public/", "")
  const history = useHistory();

  const getFileTypeIcon = () => {
    const type = file.key.split('.').pop();
    switch (type.toLowerCase()) {
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif':
        return "fa fa-file-image-o";
      case 'pdf':
        return 'fa fa-file-pdf-o';
      case 'xlsx':
        return 'fa fa-file-excel-o';
      case 'mp4':
        return 'fa fa-file-video-o';
      case 'doc':
      case 'docx':
        return 'fa fa-file-word-o';
      default:
    }
  }
  if (`+${props.file.phone_number}` == props.usersPhoneNumber) {
    return (
      <tr key={file.key.toString()} style={{ color: "white" }}>
        <th scope="row" onClick={() => { history.push(fileLink) }}>{file.name}</th>
        <td scope="row">{file.phone_number}</td>
        <td>{file.date}</td>
        <td>{file.location}</td>
        <td>{file.file_name}</td>
        <td onClick={() => { history.push(fileLink) }}>
          <i className={`${getFileTypeIcon()}`} style={{ fontSize: '30px' }}></i>
        </td>
        <td onClick={props.showDeleteModal}>
          <i className="fa fa-trash-o" style={{ fontSize: "30px" }} />
        </td>
      </tr>
    )
  } else {
    return (
      <tr key={file.key.toString()} style={{ color: "white" }} onClick={() => { history.push(fileLink) }}>
        <th scope="row">{file.name}</th>
        <td scope="row">{file.phone_number}</td>
        <td>{file.date}</td>
        <td>{file.location}</td>
        <td>{file.file_name}</td>
        <td>
          <i className={`${getFileTypeIcon()}`} style={{ fontSize: '30px' }}></i>
        </td>
      </tr>
    )
  }
}


class BusinessFiles extends Component {
  state = {
    files: [],
    isLoading: false,
    searchText: "",
    searchCategory: "Business",
    isDropMenuOpen: false,
    showDeleteModal: false,
    deleteKey: null
  }

  componentDidMount() {
    this.getBucket();
  }

  async getBucket() {
    this.setState({ isLoading: true })
    let type = this.props.match.path == "/flyers" ? "Flyers" : "Coupons";
    try {
      let results = await API.get("promotions", '/promotions', {
        headers: {
          Authorization: `Bearer ${(await Auth.currentSession()).getIdToken().getJwtToken()}`,
        },
        queryStringParameters: {
          "type": type
        }
      })
      let files = [];
      results.forEach(file => {
        const arrayPaths = file.key.split('/');
        const key = arrayPaths[arrayPaths.lastIndex];
        if (key.includes(".")) {
          const fileArry = key.split('---');
          const fileName = fileArry[fileArry.length - 1].split(".");
          const fileData = { name: fileArry[1], phone_number: fileArry[2], date: fileArry[0], location: fileArry[4], file_name: fileName[0], key: file.key, uploadDate: file.lastModified };
          files.push(fileData);
        }
      })
      let sorted = files.sort((a, b) => { return new Date(b.uploadDate) - new Date(a.uploadDate) })
      this.setState({ files: sorted })
    }
    catch (err) {
      console.log(err);
    } finally {
      this.setState({ isLoading: false });
    }
  }

  filterFiles() {
    let items;
    const { files, searchText } = this.state;
    if (files === null) { return }
    if (searchText === "" || searchText === null || searchText === undefined) {
      items = files.map((file, index) => <FileRow key={index} file={file} usersPhoneNumber={this.props.userAttributes.phone_number} showDeleteModal={() => this.deleteConfirmation(file.key)} />)
    } else {
      items = files.map((file, index) => {
        if (file.name.includes(searchText)) { return <FileRow key={index} file={file} usersPhoneNumber={this.props.userAttributes.phone_number} showDeleteModal={() => this.deleteConfirmation(file.key)} /> }
      })
    }
    return items
  }

  deleteConfirmation = (key) => {
    const { showDeleteModal } = this.state;
    this.setState({
      showDeleteModal: !showDeleteModal,
      deleteKey: key
    })
  }

  deleteFile = () => {
    const { deleteKey } = this.state;
    let keyPath = deleteKey.replace("public/", "");
    Storage.remove(keyPath, { level: "public" }).then(() => {
      this.getBucket();
      this.setState({
        showDeleteModal: false,
        deleteKey: null
      });
    }).catch((error) => {
      this.setState({ error: "Something went wrong with deleting" })
    })
  }

  render() {
    const { files, searchText, isDropMenuOpen, searchCategory, showDeleteModal, isLoading } = this.state;
    console.log(this.state.deleteKey);
    return (
      <div className="animated fadeIn mt-5">
        <Row>
          <Col colSpan={12}>
            <Modal isOpen={showDeleteModal}>
              <ModalHeader style={{ textAlign: "center" }} className="commmonFont">Delete File</ModalHeader>
              <ModalBody style={{ textAlign: "center" }} className="commmonFont">Are you sure you want to delete the file?</ModalBody>
              <ModalFooter>
                <Row style={{ flex: 1 }}>
                  <Col style={{ textAlign: 'center' }}>
                    <Button onClick={() => this.deleteFile()} className="commmonFont">Confirm</Button>
                  </Col>
                  <Col style={{ textAlign: 'center' }}>
                    <Button onClick={() => {
                      this.setState({
                        deleteKey: null,
                        showDeleteModal: false
                      })
                    }} className="commmonFont">Cancel</Button>
                  </Col>
                </Row>
              </ModalFooter>
            </Modal>
            <Card style={{ backgroundColor: "#00000000", border: 0, alignSelf: "center" }}>
              <CardHeader style={{ background: 'transparent', borderBottom: 'none' }}>
                <h5 style={{ color: "white" }}>Flyers</h5>
              </CardHeader>
              <CardBody style={{ backgroundColor: "rgba(13,13,13,0.26)", borderRadius: 8, textAlign: 'center' }}>
                <Table responsive hover >
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
                                this.setState({ searchText: `${e.target.value}` })
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
                      <th scope="col">File Type </th>
                      <th scope="col">Delete</th>
                    </tr>
                  </thead>
                  <tbody>
                    {isLoading ? <tr><th colSpan={12}><Spinner color="primary" /></th></tr> : null}
                    {files.length === 0 && isLoading === false ? <tr style={{ color: "white", textAlign: "center" }}><th scope='col' colSpan={12}> No Files found </th></tr> : null}
                    {this.filterFiles()}
                  </tbody>
                </Table>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
    )
  }
}
export default BusinessFiles;