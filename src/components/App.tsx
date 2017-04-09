import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Gallery } from './Gallery';
import { Treebeard, decorators } from 'react-treebeard';


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

    private onToggle(){}

    render(){
        return <main>
            <nav>
                <Treebeard data={this.state.data} onToggle={this.onToggle} decorators={decorators} />
            </nav>
            <section>
                <Gallery path={this.state.galleryPath} />
            </section>
        </main>
    }
}