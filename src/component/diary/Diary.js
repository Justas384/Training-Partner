import React, {Component} from 'react';
import {Calendar} from 'antd';

import './Diary.css';

export default class Diary extends Component {
    constructor(props) {
        super(props);
    }

    dateCellRender = value => {
        console.log(value.format("YYYY-MM-DD"));
    };

    render() {
        return (
            <div className="diary-container">
                <h1 className="page-title">Diary</h1>

                <div className="program-edit-content">
                    <Calendar dateCellRender={this.dateCellRender}/>
                </div>
            </div>
        );
    }
}