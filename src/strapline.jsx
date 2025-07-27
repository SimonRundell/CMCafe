import React from 'react';

function Strapline({ config }) {
    return (
        <div>
            {config.address} | {config.phone} | <a href={`mailto:${config.email}`} target="_blank" rel="noopener noreferrer">{config.email} </a> |
                <a href={config.facebook} target="_blank" rel="noopener noreferrer"> Facebook </a> | 
                <a href={config.twitter} target="_blank" rel="noopener noreferrer"> Twitter </a> | 
                <a href={config.instagram} target="_blank" rel="noopener noreferrer"> Instagram</a>
        </div>
    )
}

export default Strapline;