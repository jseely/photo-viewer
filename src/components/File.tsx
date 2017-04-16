import * as React from 'react';
import {Thumbnail} from 'react-bootstrap';

export interface FileProps {
    src: string;
    img: string;
    imgSize: Rectangle;
    isDir: boolean;
}

export interface Rectangle {
    height: number;
    width: number;
}

export class File {
    props: FileProps;

    constructor(props: FileProps){
        this.props = props
    }

    public isDir(): boolean{
        return this.props.isDir;
    }

    public src(): string {
        return this.props.src;
    }

    public size(): Rectangle {
        return this.props.imgSize;
    }

    public render(/*maxSize: Rectangle*/){
        return <Thumbnail src={this.props.img} alt={this.props.src}></Thumbnail>;
        /*
        let renderSize: Rectangle;
        if (maxSize.height < this.props.imgSize.height || maxSize.width < this.props.imgSize.width){
            renderSize = this._scaleImage(this.props.imgSize, maxSize);
        }else {
            renderSize = this.props.imgSize;
        }
        if (this.isDir()){
            return <Thumbnail src={this.props.img} alt={this.props.src}></Thumbnail>;
        } else {
          return <Thumbnail src={this.props.img} alt="></Thumbnail>
        }
        */
    }

    private _scaleImage(imgSize: Rectangle, maxSize: Rectangle): Rectangle {
        let hScale = maxSize.height/imgSize.height;
        let wScale = maxSize.width/imgSize.width;
        if (hScale > wScale){
            return {width: imgSize.width*wScale, height: imgSize.height*wScale};
        }
        return {width: imgSize.width*hScale, height: imgSize.height*hScale};
    }
}
