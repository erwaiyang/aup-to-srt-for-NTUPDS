import React, { Component } from 'react';
import Dropzone from 'react-dropzone';
import { parseString } from 'xml2js';
import { Motion, spring } from 'react-motion';

export default class FileInput extends Component {
  constructor(props) {
    super(props);
    this.state = {
      progress: 0
    };
  }

  onDrop(files){
    let self = this;
    files.forEach((file) => {
      let reader = new FileReader();
      reader.onload = (e) => {
        self.setState({
          progress: 0
        });
        parseString(e.target.result, (err, result) => {
          if(err){
            console.error('error!');
          }else{
            self.props.loadFile(JSON.stringify(result));
          }
        });
      }
      reader.onprogress = (e) => {
        if(e.lengthComputable){
          self.setState({
            progress: Math.round( (e.loaded / e.total) * 100 )
          });
        }
      }
      reader.onloadend = (e) => {
        self.setState({
          progress: 100
        });
      }
      reader.readAsText(file);
    });
  }

  render() {
    let self = this;
    return (
      <div>
        <Dropzone id="dropzone" style={{width: '100%'}} accept="application/x-aup" multiple={false} onDrop={this.onDrop.bind(this)}>
          <div>點擊以選擇檔案或直接拖曳至此</div>
        </Dropzone>
        <Motion defaultStyle={{x: 0}} style={{x: spring(this.state.progress)}}>
        { (motionStyle) => {
            return(
              <div id="myProgress">
                <div id="progressBar" style={{width:motionStyle.x+'%'}}>
                  <div id="progressLabel">
                    {self.state.progress} %
                  </div>
                </div>
              </div>
            );
          }
        }
        </Motion>
      </div>
    );
  }
};
