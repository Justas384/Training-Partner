import React from 'react';
import {Button} from 'antd';

import './ButtonPrimary.css';

const ButtonPrimary = ({isValid, children}) =>
    <Button type="primary"
            htmlType="submit"
            size="large"
            className="button-primary-button"
            {...(isValid ? {disabled: !isValid()} : {})}
    >
        {children}
    </Button>;

export default ButtonPrimary;