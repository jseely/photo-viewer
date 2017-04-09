import * as React from 'react';
import * as ReactDOM from 'react-dom';
import axios from 'axios';
import {File, FileProps, Rectangle} from './File';

export interface GalleryProps {
  path: string;
  cols?: number;
  onClickPhoto?: Function;
  margin?: number;
}

export interface GalleryState {
  path: string;
  files?: File[];
  containerWidth: number;
}

export class Gallery extends React.Component<GalleryProps, GalleryState>{
  constructor(props: GalleryProps){
    super();
    this.state = {
      path: props.path,
      containerWidth: 0
    };
    this.handleResize = this.handleResize.bind(this);
  }

  public static defaultProps: Partial<GalleryProps> = {
    cols: 3, 
    onClickPhoto: function(file: File, g: Gallery){
      if (file.isDir()){
          axios.get(`${window.location.origin}${file.src()}`)
          .then(res => {
            let files: File[] = [];
            res.data.forEach((f: any, i: number) => files.push(new File(f)))
            g.setState({
              ...this.state,
              path: file.src(),
              files: files
            })
          })
      }
    },
    margin: 2
  }

  public componentDidMount(){
    this.setState({
      ...this.state,
      containerWidth: Math.floor(ReactDOM.findDOMNode(this).getBoundingClientRect().width)
    });
    axios.get(`${window.location.origin}${this.state.path}`)
    .then(res => {
      let files: File[] = [];
      res.data.forEach((f: any, i: number) => files.push(new File(f)))
      this.setState({
        ...this.state,
        files: files
      })
    })
    window.addEventListener('resize', this.handleResize);
  }

  public componentDidUpdate(){
    var clientWidth = ReactDOM.findDOMNode(this).getBoundingClientRect().width
    if (clientWidth !== this.state.containerWidth){
      this.setState({...this.state, containerWidth: Math.floor(clientWidth)});
    }
  }

  public componentWillUnmount(){
    window.removeEventListener('resize', this.handleResize, false);
  }

  public handleResize(e: any){
    this.setState({
      ...this.state,
      containerWidth: Math.floor(ReactDOM.findDOMNode(this).getBoundingClientRect().width)
    });
  }

  render(){
    if (this.state.files == null){
      return <div id="Gallery" />
    }

    let maxImgSize = {width: this.state.containerWidth/this.props.cols, height: 99999999};

    let photoPreviewNodes: any[] = [];
    let maxHeight = 0;
    this.state.files.forEach((file, index) => {
      if (file.props.imgSize.height > maxHeight){
        maxHeight = file.props.imgSize.height;
      }
      photoPreviewNodes.push(
        <div key={index} style={style} height={maxHeight}>
          <a href="#" onClick={e => this.props.onClickPhoto(this.state.files[index], this)}>
            {this.state.files[index].render(maxImgSize)}
          </a>
        </div>
      )
    })
    return <div id="Gallery" className="clearfix">{photoPreviewNodes}</div>;
  }
};

// Gallery image style
const style = {
   display: 'block',
   backgroundColor:'#e3e3e3',
   float: 'left',
   margin: 0
}
