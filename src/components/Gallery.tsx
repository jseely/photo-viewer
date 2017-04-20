import * as React from 'react';
import * as ReactDOM from 'react-dom';
import axios from 'axios';
import { Grid, Col, Row, Thumbnail, Modal, Carousel } from 'react-bootstrap';

export interface GalleryProps {
  images: Image[];
  cols?: number;
}

interface GalleryState {
  showSlides: boolean;
  slideIndex: number;
  slideDirection: any;
}

export interface Image {
  src: string;
}

export class Gallery extends React.Component<GalleryProps, any>{
  constructor(props: GalleryProps){
    super();
    this.state = {
      showSlides: false,
      slideIndex: 0,
      slideDirection: null
    }
    this.open = this.open.bind(this);
  }

  public shouldComponentUpdate(nextProps: GalleryProps, nextState: GalleryState): boolean {
    if (this.props.cols != nextProps.cols 
        || this.props.images.length != nextProps.images.length 
        || this.state.showSlides != nextState.showSlides
        || this.state.slideIndex != nextState.slideIndex){
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

  private close() {
    this.setState({ ...this.state, showSlides: false })
  }

  private open(g: Gallery, i: number) {
    g.setState({ ...g.state, showSlides: true, slideIndex: i, slideDirection: null })
  }

  private handleSelect(selectedIndex: any, e?: any) {
    this.setState({
      ...this.state,
      slideIndex: selectedIndex,
      slideDirection: e.direction
    })
  }

  render(){
    if (this.props.images == null){
      return <div id="Gallery" />
    }

    let rows: any[] = [];
    let carouselItems: any[] = [];
    for(var i = 0; i < this.props.images.length; i += this.props.cols) {
      let cols: any[] = [];
      for(var j = i; j < i + this.props.cols && j < this.props.images.length; j++) {
        cols.push(<Col sm={2} md={2}>
          <div className="thumbnail">
            <a href="#" onClick={ () => this.open(this, j) } >
              <img src={ this.props.images[j].src } alt={ this.props.images[j].src } />
            </a>
          </div>
        </Col>);
        if (this.state.showSlides) {
          carouselItems.push(<Carousel.Item><img width={900} height={500} alt="900x500" src={this.props.images[j].src} /></Carousel.Item>)
        }
      }
      rows.push(<Row>{cols}</Row>)
    }
    return <div>
      <Grid id="gallery">{rows}</Grid>
      <Modal show={this.state.showSlides} onHide={this.close.bind(this)}>
        <Modal.Body>
          <Carousel activeIndex={this.state.slideIndex} direction={this.state.slideDirection} onSelect={this.handleSelect.bind(this)}>
            { carouselItems }
          </Carousel>
        </Modal.Body>
      </Modal>
    </div>
  }
};
