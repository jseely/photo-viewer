import * as React from 'react';
import * as ReactDOM from 'react-dom';
import axios from 'axios';
import { Grid, Col, Row, Modal } from 'react-bootstrap';

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
  width: number;
  height: number;
}

export class Gallery extends React.Component<GalleryProps, any>{
  curHeight: number;
  curWidth: number;

  constructor(props: GalleryProps){
    super();
    this.state = {
      showSlides: false,
      slideIndex: 0,
      slideDirection: null
    }
    this.open = this.open.bind(this);
    this.sizeDialog = this.sizeDialog.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.scaleImage = this.scaleImage.bind(this);
  }

  public componentDidUpdate() {
    var element = ReactDOM.findDOMNode(this);
    this.curHeight = element.clientHeight;
    this.curWidth = element.clientWidth;
    console.log(this.curHeight)
    console.log(this.curWidth)
  }

  private sizeDialog() {
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
    g.setState({ ...g.state, showSlides: true, slideIndex: i%this.props.images.length, slideDirection: null })
  }

  private handleSelect(selectedIndex: any, e?: any) {
    this.setState({
      ...this.state,
      slideIndex: selectedIndex%this.props.images.length,
      slideDirection: e.direction
    })
  }

  private scaleImage(height: number, width: number): [number, number] {
    if (this.curWidth*0.8 > width && this.curHeight*0.8 > height) {
      return [height, width];
    }

    var wScaleFactor = this.curWidth*0.8/width;
    var hScaleFactor = this.curHeight*0.8/height;
    if (hScaleFactor > wScaleFactor) {
      return [wScaleFactor*height, wScaleFactor*width];
    } else {
      return [hScaleFactor*height, hScaleFactor*width];
    }
  }

  private navSlide(amount: number) {
    this.setState({
      ...this.state,
      slideIndex: (this.state.slideIndex + amount + this.props.images.length)%this.props.images.length,
      slideDirection: amount > 0 ? "right" : "left"
    });
  }

  private handleKeyDown(e: any) {
    switch(e.keycode) {
    case 37:
      this.navSlide(-1);
      return;
    case 39:
      this.navSlide(1);
      return;
    }
  }

  render(){
    if (this.props.images == null){
      return <div id="Gallery" />
    }

    let rows: any[] = [];
    let carouselItems: any[] = [];
    let carouselIndicators: any[] = [];
    let carWidth: number;
    let carHeight: number;
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
          var [height, width] = this.scaleImage(this.props.images[this.state.slideIndex].height, this.props.images[this.state.slideIndex].width);
          if (this.state.slideIndex == j) {
            carHeight = height;
            carWidth = width;
          }
          carouselIndicators.push(<li className={j == this.state.slideIndex%this.props.images.length ? "active" : ""}></li>);
          carouselItems.push(<div height={height} width={width} className={j == this.state.slideIndex%this.props.images.length ? "item active" : "item"}><img height={height} width={width} alt={this.props.images[j].src} src={this.props.images[j].src} /></div>);
        }
      }
      rows.push(<Row>{cols}</Row>)
    }
    return <div>
      <input type="hidden" onKeyDown={this.handleKeyDown} />
      <Grid id="gallery">{rows}</Grid>
      <Modal show={this.state.showSlides} onHide={this.close.bind(this)} width={carWidth+40}>
        <Modal.Body>
          <div className="carousel slide">
            <ol className="carousel-indicators">
              {carouselIndicators}
            </ol>
            <div className="carousel-inner" width={carWidth} height={carHeight}>
              {carouselItems}
            </div>
            <a className="carousel-control left" role="button" href="#" onClick={(e) => {this.navSlide(-1)}}>
              <span className="glyphicon glyphicon-chevron-left"></span>
            </a>
            <a className="carousel-control right" role="button" href="#" onClick={(e) => {this.navSlide(1)}}>
              <span className="glyphicon glyphicon-chevron-right"></span>
            </a>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  }
};
