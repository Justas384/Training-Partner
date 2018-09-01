import React from 'react';
import {Icon, Spin} from 'antd';

const LoadingIndicator = props => {
    const antIcon = <Icon type="loading-3-quarters" style={{fontSize: 30}} spin/>;

    return (
        <Spin indicator={antIcon} style={{display: 'block', textAlign: 'center', marginTop: 30}}/>
    );
};

export default LoadingIndicator;