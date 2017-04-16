import * as React from 'react';
import * as ReactDOM from 'react-dom';
import axios from 'axios';
import {File, FileProps, Rectangle} from './File';
import {Grid, Col, Row} from 'react-bootstrap';

export interface GalleryProps {
  path: string;
  cols?: number;
  onClickPhoto?: Function;
  margin?: number;
  onNavigate: Function;
}

export interface GalleryState {
  path: string;
  onNavigate: Function;
  files?: File[];
  containerWidth: number;
}

export class Gallery extends React.Component<GalleryProps, GalleryState>{
  constructor(props: GalleryProps){
    super();
    this.state = {
      path: props.path,
      onNavigate: props.onNavigate,
      containerWidth: 0
    };
    this.handleResize = this.handleResize.bind(this);
  }

  public static defaultProps: Partial<GalleryProps> = {
    cols: 6, 
    onNavigate: function(path: string){},
    onClickPhoto: function(i: number, g: Gallery){
      console.log(i-1)
      let file: File = g.state.files[i-1]
      console.log(file)
      if (file.isDir()){
          g.state.onNavigate(file.src());
          /*
          axios.get(`${window.location.origin}${file.src()}`)
          .then(res => {
            let files: File[] = [];
            console.log(`${window.location.origin}${file.src()}`)
            console.log(res.data)
            res.data.forEach((f: any, i: number) => files.push(new File(f)))
            g.setState({
              ...this.state,
              path: file.src(),
              files: files
            })
          })
          */
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

  public componentWillReceiveProps(nextProps: GalleryProps){ 
    axios.get(`${window.location.origin}${nextProps.path}`)
    .then(res => {
      let files: File[] = [];
      res.data.forEach((f: any, i: number) => files.push(new File(f)))
      this.setState({
        ...this.state,
        files: files
      })
    })
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

    let rows: any[] = [];
    for(var i = 0; i < this.state.files.length; i += this.props.cols) {
      let cols: any[] = [];
      for(var j = i; j < i + this.props.cols && j < this.state.files.length; j++) {
        console.log(j)
        console.log(this.state.files[j])
        cols.push(<Col sm={2} md={2}><a href="#" onClick={e => this.props.onClickPhoto(j, this)}>{this.state.files[j].render()}</a></Col>);
      }
      rows.push(<Row>{cols}</Row>)
    }
    return <Grid id="gallery">{rows}</Grid>

    /*
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
    */
  }
};

// Gallery image style
const style = {
   display: 'block',
   backgroundColor:'#e3e3e3',
   float: 'left',
   margin: 0
}
