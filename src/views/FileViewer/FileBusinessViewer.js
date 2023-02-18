import React, { Component } from 'react';
import { Card, CardBody, CardHeader, Col, Row } from 'reactstrap';
import FileViewer from 'react-file-viewer';
import { Storage } from 'aws-amplify';
import Img from 'react-medium-image-zoom'
class User extends Component {
  state = {
    type: null,
    url: null,
    isActive: false,
  }
  componentDidMount() {
    const base = this.props.match.params.basePath;
    const plan = this.props.match.params.productPlan;
    const key = this.props.match.params.key;
    const type = key.split('.')[1];
    const imagePath = `${base}/${plan}/${key}`
    Storage.get(`${base}/${plan}/${key}`).then((url) => {
      this.setState({ url, type: type.toLowerCase() });
    }).catch((err) => {
      console.log(err);
    });
  }

  render() {
    const { type, url, isActive } = this.state;
    console.log('************************************* RENDER FILEBUSINESSVIEWER : ', type)
    return (
      <div className="animated fadeIn">
        <Row>
          <Col lg={12}>
            <Card style={{ margin: "1.5rem", backgroundColor: "#00000000", border: 0 }}>
              <CardHeader style={{ backgroundColor: "#00000000", border: 0 }}>
                <strong style={{ color: "white" }}><i className="icon-info pr-1"></i>File</strong>
              </CardHeader>
              <CardBody className="text-center">
                {url && type.match(/pdf|doc|docx|xlsx|txt|mp4/) ?
                  <FileViewer
                    fileType={type}
                    filePath={url}
                    onError={(err) => {
                      console.log(err);
                    }}
                  /> : (
                    <Img
                      image={{
                        src: url,
                        className: 'img',
                        style: { width: '50em' }
                      }}
                      zoomImage={{
                        src: url
                      }}
                      handleClose={() => this.setState({ isActive: false })}
                      handleOpen={() => this.setState({ isActive: true })}
                      isActive={isActive}
                    />
                  )
                }
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
    )
  }
}

export default User;
