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
  contentHeight: number;
}

export interface Image {
  src: string;
}

export class Gallery extends React.Component<GalleryProps, any>{
  modalRef: any = {};

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
  }

  public componentDidUpdate() {
    if (window.requestAnimationFrame) {
      window.requestAnimationFrame(this.sizeDialog);
    } else {
      window.setTimeout(this.sizeDialog, 50);
    }
  }

  private sizeDialog() {
    if (!this.refs.content) return;
    let contentHeight = this.modalRef.getBoundingClientRect().height;
    console.log(contentHeight)
    this.setState({
      ...this.state,
      contentHeight: contentHeight
    });
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

  private getModalStyle(): any {
    const padding: number = 20
    let height = (this.state.contentHeight + padding);
    let heightPx = height + "px";
    let heightOffset = height/2;
    let offsetPx = heightOffset + "px";

    return {
      content: {
        border: '0',
        borderRadius: '4px',
        bottom: 'auto',
        height: heightPx,
        left: '50%',
        padding: '2rem',
        position: 'fixed',
        right: 'auto',
        top: '50%',
        transform: 'translate(-50%,-' + offsetPx + ')',
        width: '40%',
        maxWidth: '40rem'
      }
    };
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
          carouselIndicators.push(<li className={j == this.state.slideIndex%this.props.images.length ? "active" : ""}></li>);
          carouselItems.push(<div className={j == this.state.slideIndex%this.props.images.length ? "item active" : "item"}><img alt={this.props.images[j].src} src={this.props.images[j].src} /></div>);
        }
      }
      rows.push(<Row>{cols}</Row>)
    }
    return <div>
      <input type="hidden" onKeyDown={this.handleKeyDown} />
      <Grid id="gallery">{rows}</Grid>
      <Modal show={this.state.showSlides} ref={(input: any) => { this.modalRef = input; }} onHide={this.close.bind(this)} style={this.getModalStyle}>
        <Modal.Body>
          <div className="carousel slide">
            <ol className="carousel-indicators">
              {carouselIndicators}
            </ol>
            <div className="carousel-inner">
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
