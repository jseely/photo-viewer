import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Gallery } from './Gallery';
import { Header } from './Header';

export interface AppState {
    galleryPath: string;
    data: any;
}

export class App extends React.Component<any, AppState> {
    constructor(){
        super();
        this.state = {
            galleryPath: "/photos/",
            data: {
                name: 'treebeard',
                toggled: true,
                children: [
                    {
                        name: 'example',
                        children: [
                            { name: 'app.js' },
                            { name: 'data.js' },
                            { name: 'index.html' },
                            { name: 'styles.js' },
                            { name: 'webpack.config.js' }
                        ]
                    },
                    {
                        name: 'node_modules',
                        loading: true,
                        children: []
                    },
                    {
                        name: 'src',
                        children: [
                            {
                                name: 'components',
                                children: [
                                    { name: 'decorators.js' },
                                    { name: 'treebeard.js' }
                                ]
                            },
                            { name: 'index.js' }
                        ]
                    },
                    {
                        name: 'themes',
                        children: [
                            { name: 'animations.js' },
                            { name: 'default.js' }
                        ]
                    },
                    { name: 'Gulpfile.js' },
                    { name: 'index.js' },
                    { name: 'package.json' }
                ]
            }
        }
    }

    public onGalleryNavigate(path: string) {
      this.setState({ 
        ...this.state,
        galleryPath: path
      });
    }

    render(){
      return <div><Header path={this.state.galleryPath} /><Gallery path={this.state.galleryPath} onNavigate={this.onGalleryNavigate.bind(this)} /></div>
    }
}
