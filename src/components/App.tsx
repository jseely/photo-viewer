import * as React from 'react';
import * as ReactDOM from 'react-dom';
import axios, {AxiosResponse} from 'axios';
import { Gallery, Image } from './Gallery';
import { Header, Directory } from './Header';

export interface AppState {
  dir: Directory;
  images: Image[];
}

export interface DirListItem {
  path: string;
  isDir: boolean;
}

export class App extends React.Component<any, AppState> {
  readonly galleryApiPath = "/"

  constructor(){
    super();
    this.state = {
      dir: { path: this.galleryApiPath, subDirs: [] },
      images: []
    }
    this.onGalleryNavigate(this.state.dir.path);
  }

  public shouldComponentUpdate(nextProps: any, nextState: AppState){
    if (this.state.dir.path != nextState.dir.path 
    || this.state.dir.subDirs.length != nextState.dir.subDirs.length 
    || this.state.images.length != nextState.images.length){
      return true;
    }
    for(var i = 0; i < this.state.dir.subDirs.length; i++){
      if (this.state.dir.subDirs[i] != nextState.dir.subDirs[i]){
        return true;
      }
    }
    for(var i = 0; i< this.state.images.length; i++){
      if (this.state.images[i] != nextState.images[i]){
        return true;
      }
    }
    return false;
  }

  private formatDirListResponse(path: string, dirItems: any[]): [Directory, Image[]]{
    let [dirs, files]: [string[], Image[]] = [[], []];
    for (let item of dirItems){
      if (item.isDir){
        dirs.push(item.path.split("/").filter((s: string) => s.length != 0).pop());
      } else {
        files.push({src: item.path, width: item.width, height: item.height});
      }
    }
    return [{path: path, subDirs: dirs}, files];
  }

  public onGalleryNavigate(path: string) {
    axios({
      method: "VIEW",
      url: window.location.origin + path
    }).then((resp: AxiosResponse) => {
      let [dir, images] = this.formatDirListResponse(path, resp.data);
      this.setState({
        ...this.state,
        dir: dir,
        images: images
      })
    });
  }

  render(){
    return <div><Header dir={this.state.dir} onNavigate={this.onGalleryNavigate.bind(this)} /><Gallery images={this.state.images} /></div>
  }
}
