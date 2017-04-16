import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Navbar, Nav, NavItem, NavDropdown, MenuItem } from 'react-bootstrap';

export interface HeaderProps {
  path: string
}

export class Header extends React.Component<HeaderProps, any> {
    constructor(){
        super();
    }

    render(){
      let navHead = <Navbar.Header><Navbar.Brand><a href="#">Photos</a></Navbar.Brand></Navbar.Header>;
      
      let dirs = this.props.path.split("/").filter((el) => {return el.length != 0;});
      let navs: any[] = [];
      for(var i = 0; i < dirs.length; i++) {
        navs.push(<NavItem eventKey={i+1} href="#">{dirs[i]}</NavItem>);
      }
      navs.push(<NavDropdown eventKey={dirs.length+1} title="Sub Directories" id="header-subdirs">
        <MenuItem eventKey={(dirs.length+1)+".1"}>First sub directory</MenuItem>
        <MenuItem eventKey={(dirs.length+1)+".2"}>Second sub directory</MenuItem>
        <MenuItem eventKey={(dirs.length+1)+".3"}>Third sub directory</MenuItem>
      </NavDropdown>);
      return <Navbar>{navHead}<Nav>{navs}</Nav></Navbar>
    }
}
