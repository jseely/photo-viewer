import * as React from 'react';
import * as ReactDOM from 'react-dom';
import axios from 'axios';
import {Grid, Col, Row, Thumbnail} from 'react-bootstrap';

export interface GalleryProps {
  images: Image[];
  cols?: number;
}

export interface Image {
  src: string;
}

export class Gallery extends React.Component<GalleryProps, any>{
  constructor(props: GalleryProps){
    super();
  }

  public shouldComponentUpdate(nextProps: GalleryProps): boolean {
    if (this.props.cols != nextProps.cols || this.props.images.length != nextProps.images.length){
      return true;
    }
    for(var i = 0; i < this.props.images.length; i++){
      if (this.props.images[i] != nextProps.images[i]){
        return true;
      }
    }
    return false;
  }
  
  public static defaultProps: Partial<GalleryProps> = {
    cols: 6
  }

  render(){
    if (this.props.images == null){
      return <div id="Gallery" />
    }

    let rows: any[] = [];
    for(var i = 0; i < this.props.images.length; i += this.props.cols) {
      let cols: any[] = [];
      for(var j = i; j < i + this.props.cols && j < this.props.images.length; j++) {
        cols.push(<Col sm={2} md={2}><Thumbnail src={this.props.images[j].src} alt={this.props.images[j].src}></Thumbnail></Col>);
      }
      rows.push(<Row>{cols}</Row>)
    }
    return <Grid id="gallery">{rows}</Grid>
  }
};
