import React, {Component} from 'react';
import {Button} from 'antd';

import './ButtonPrimary.css';

export class ButtonPrimary extends Component {
    render() {
        const {
            isValid,
            children,
        } = this.props;

        return (
            <Button type="primary"
                    htmlType="submit"
                    size="large"
                    className="button-primary-button"
                    {...(isValid ? {disabled: !isValid()} : {})}
            >
                {children}
            </Button>
        );
    }
}