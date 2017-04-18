import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Navbar, Nav, NavItem, NavDropdown, MenuItem } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

export interface HeaderProps {
  dir: Directory;
  onNavigate: Function;
}

export interface Directory {
  path: string;
  subDirs: string[];
}

export class Header extends React.Component<HeaderProps, any> {
  constructor(){
    super();
  }

  private onClickNav(index: number) {
    
  }

  private toPath(names: string[]) {
    return "/" + names.join("/") + "/";
  }

  public shouldComponentUpdate(nextProps: HeaderProps){
    return this.props.dir.path != nextProps.dir.path || !this.subDirsEqual(this.props.dir.subDirs, nextProps.dir.subDirs);
  }

  private subDirsEqual(subdirs1: string[], subdirs2: string[]): boolean {
    if (subdirs1.length != subdirs2.length){
      return false;
    }
    for(var i = 0; i < subdirs1.length; i++){
      if (subdirs1[i] != subdirs2[i]){
        return false;
      }
    }
    return true;
  }

  public handleSelect(eventKey: any, event?: any): any{
    if (this.props.dir.path != eventKey){
      this.props.onNavigate(eventKey);
    }
  }

  private githubLogo(): any {
    return <svg aria-hidden="true" className="align-middle" height="32" version="1.1" viewBox="0 0 16 16" width="32"><path fill-rule="evenodd" d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0 0 16 8c0-4.42-3.58-8-8-8z"></path></svg>
  }

  render(){
    let navHead = <Navbar.Header><Navbar.Brand><a href="#">Photos</a></Navbar.Brand></Navbar.Header>;
    
    let dirs = this.props.dir.path.split("/").filter((s) => s.length != 0);
    if (dirs.length == 0) {
      dirs = ["/"]
    }
    let navs: any[] = [];
    for(var i = 0; i < dirs.length; i++) {
      if (i == dirs.length - 1) {
        if (this.props.dir.subDirs.length > 0) {
          let subdirs: any[] = []
          for(var j = 0; j < this.props.dir.subDirs.length; j++) {
            subdirs.push(
              <MenuItem eventKey={this.props.dir.path + this.props.dir.subDirs[j] + "/"}>
                {this.props.dir.subDirs[j]}
              </MenuItem>);
          }
          navs.push(<NavDropdown eventKey={this.props.dir.path} title={dirs[i]} id="header-subdirs">{subdirs}</NavDropdown>); 
        } else {
          navs.push(<NavItem eventKey={this.props.dir.path}>{dirs[i]}</NavItem>);
        }
      } else {
        navs.push(<NavItem eventKey={this.toPath(dirs.slice(0, i+1))}>{dirs[i]}</NavItem>);
      }
    }
    return <Navbar>{navHead}<Nav onSelect={this.handleSelect.bind(this)}>{navs}</Nav><Nav pullRight><ul className="nav navbar-nav navbar-right"><li role="presentation"><a href="https://github.com/jseely/photo-viewer" style={{height: "50px", padding: "9px"}}>{this.githubLogo()}</a></li></ul></Nav></Navbar>
  }
}
