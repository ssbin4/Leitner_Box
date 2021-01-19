import React, { Component } from 'react';
import {BrowserRouter as Router,Route,Switch,Redirect} from 'react-router-dom';
import wordCards from './wordCards.js';
import imageCards from './imageCards.js';

class Routes extends Component{
    render(){
        return(
            <Router>
                <Switch>
                    <Route exact path='/wordCards' component={wordCards}/>
                    <Route path='/imageCards' component={imageCards}/>
                    <Redirect path="*" to ="/"/>
                </Switch>
            </Router>
        )
    }
}

export default Routes;