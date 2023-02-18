import React, { Component } from 'react';
import { useHistory } from 'react-router-dom';
import { Card, CardBody, CardHeader, Col, Row, Table, Spinner, Form, Input, InputGroup } from 'reactstrap';
import { Storage } from 'aws-amplify';

function FileRow(props) {
  const file = props.file
  const fileLink = `/fileviewer/${file.key}`
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

  return (
    <tr key={file.key.toString()} style={{color: "white"}} onClick={() => { history.push(fileLink)}}>
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

class PaymentHistory extends Component {
  state = {
    files: [],
    isLoading: false,
    searchText: "",
    isDropMenuOpen: false
  }

  componentDidMount() {
    this.setState({ isLoading: true });
    const { userAttributes } = this.props;
    Storage.list(`backup/${userAttributes.sub}/${userAttributes.phone_number.replace("+", "")}`, { level: "public" })
      .then(fileList => {
        let files = [];
        fileList.forEach(file => {
          const filePathArray = file.key.split('/');
          const key = filePathArray[filePathArray.lastIndex];
          if(key.includes(".") && key.includes("invoice")) {
            const fileArry = key.split('---');
            const fileName = fileArry[fileArry.length-1].split(".");
            const fileData = { name: fileArry[1], phone_number: fileArry[2], date: fileArry[0], location: fileArry[3], file_name: fileName[0].split("_")[1], key: file.key, uploadDate: file.lastModified };
            files.push(fileData);
          }
        })
        let sorted = files.sort((a,b) => { return new Date(b.uploadDate) - new Date(a.uploadDate)})
        this.setState({
          files: sorted,
          isLoading: false
        })
      }).catch((err) => {
        this.setState({ isLoading: false });
      })
  }

  filterFiles() {
    let items;
    const { files, searchText } = this.state;
    if (files === null) { return }
    if (searchText === "" || searchText === null || searchText === undefined) {
      items = files.map((file, index) => <FileRow key={index} file={file}/>)
    } else {
      items = files.map((file, index) => {
        if (file.file_name.includes(searchText)) { return <FileRow key={index} file={file}/> }
      })
    }
    return items
  }

  render() {
    const { files } = this.state;
    return (
      <div className="animated fadeIn mt-5">
        <Row>
          <Col colSpan={12}>
            <Card style={{backgroundColor: "#00000000", border: 0, alignSelf: "center"}}>
              <CardHeader style={{background: 'transparent', borderBottom: 'none'}}>
              <h5 style={{color: "white"}}>Invoices</h5>
              </CardHeader>
              <CardBody style={{backgroundColor: "rgba(13,13,13,0.26)", borderRadius: 8, textAlign: 'center'}}>
                <Table responsive hover >
                  <thead>
                    <tr>
                      <th colSpan={12}>
                        <Form>
                          <InputGroup>
                            <Input
                              type="search"
                              name="search"
                              placeholder="Search Invoice File Name"
                              onChange={(e) => {
                                this.setState({ searchText: `${e.target.value}` })
                              }}
                            />
                          </InputGroup>
                        </Form>
                      </th>
                    </tr>
                    <tr style={{color: "white"}}>
                      <th scope="col">Company Name</th>
                      <th scope="col">Phone Number</th>
                      <th scope="col">Date</th>
                      <th scope="col">Location</th>
                      <th scope="col">File Name</th>
                      <th scope="col">File Type </th>
                    </tr>
                  </thead>
                  <tbody>
                  {files.length == 0 ? <tr style={{color: "white", textAlign: "center"}}><th scope='col' colSpan={12}> No Files found </th></tr> : null}
                    {this.filterFiles()}
                  </tbody>
                </Table>
                {!files && <Spinner style={{ alignSelf: 'center' }} color="primary" />}
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
    )
  }
}

export default PaymentHistory;
