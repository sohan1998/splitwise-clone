import React, { Component } from 'react';
import bg_image from '../assets/splitwise_home.png';
import bg_image1 from '../assets/splitwise_home_2.png';
import bg_image2 from '../assets/splitwise_home_3.png';

class Landing extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <div data-testid='Landing'>
                <a href='/signup'>
                    <img src={bg_image} width='1600' height='700' style={{ marginTop: 80 }}></img>
                </a>
                <img src={bg_image1} width='1600' height='700'></img>
                <img src={bg_image2} width='1600' height='400' style={{ marginTop: 80 }}></img>
            </div>
        );
    }
}
export default Landing;
