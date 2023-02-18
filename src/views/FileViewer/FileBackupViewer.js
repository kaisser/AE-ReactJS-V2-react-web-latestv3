import React, { Component, useEffect } from 'react';
import { Card, CardBody, CardHeader, Col, Row } from 'reactstrap';
import FileViewer from 'react-file-viewer';
import { Storage } from 'aws-amplify';
import Img from 'react-medium-image-zoom'
class User extends Component {

  //const [list, setList] = useState([]);
  state = {
    type: null,
    url: null,
    isActive: false,
    datafromjson: {},
  }
  componentDidMount() {
    const base = this.props.match.params.basePath;
    const sub = this.props.match.params.sub;
    const phone = this.props.match.params.phone;
    const key = this.props.match.params.key;
    const type = key.split('.')[1];
    Storage.get(`${base}/${sub}/${phone}/${key}`).then((url) => {
      this.setState({ url, type: type.toLowerCase() });
    }).catch((err) => {
      console.log(err);
    });
  }

  async getJson(url) {
    return fetch(url)
      .then(response => {
        // const items = response.json();
        //this.state.datafromjson = items;
        //this.setDatafromjson(items);
        // const items = data;
        //console.log(items);

        //this.datafromdynamo = items;

        return response;
      }

      )
      .catch(error => {
        console.error(error);
      });
  }

  async renderJson(url) {
    await this.getJson(url).then(list => this.setState({
      datafromjson: list.json()
    }));
  };

  render() {
    const { type, url, isActive } = this.state;
    //console.log('************************************* RENDER FILEBACKUPVIEWER TYPE: ', type);
    //console.log('************************************* RENDER FILEBACKUPVIEWER URL: ', url);
    // if (this.state.datafromjson === null) {
    //this.renderJson(url);
    //console.log('************************************* RENDER JSON FILE: ', this.state.datafromjson);
    //}


    // console.log('************************************* RENDER JSON FILE: ', this.datafromdynamo.datas)
    return (
      <div className="animated fadeIn">
        <Row>
          <Col lg={12}>
            <Card style={{ margin: "1.5rem", backgroundColor: "#00000000", border: 0 }}>
              <CardHeader style={{ backgroundColor: "#00000000", border: 0 }}>
                <strong style={{ color: "white" }}><i className="icon-info pr-1"></i>File</strong>
              </CardHeader>
              <CardBody className="text-center">
                {url && type.match(/pdf|doc|docx|xlsx|json|txt|mp4/) ?
                  ((type === 'json') ? (<ul>Json datas</ul>
                    // <ul> 
                    //   {this.state.datafromjson.map(item => (
                    //     <li key={item.id}></li>
                    //   ))}
                    // </ul>
                  ) :
                    <FileViewer
                      fileType={type}
                      filePath={url}
                      onError={(err) => {
                        console.log(err);
                      }}
                    />) : (
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
