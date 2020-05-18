import React from 'react';

const FullPage = (props) => (
    <div style={{
        minHeight: window.innerHeight,
        minWidth: window.innerWidth,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    }}>
        {props.children}
    </div>
)

export default FullPage;