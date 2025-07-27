import React, { useEffect, useState } from 'react';
import { Tag } from 'antd';

function RenderTags({ config, productID, mods }) {
    const [extras, setExtras] = useState([]);

    useEffect(() => {
        const jsonData = JSON.stringify({product_id: parseInt(productID)});
        // console.log(jsonData);
        fetch(config.api + '/getProductExtras.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: jsonData,
        })
        .then(response => response.json())
        .then(responseData => {
            // console.log(responseData);
            setExtras(JSON.parse(responseData));
        });
    }, [config.api, productID]);

    return (
        <>
        <div className="order-extras-container">
            {extras && extras.map(extra => (
                mods.includes(extra.id) && (
                    <Tag key={extra.id} 
                        value={extra.mod_cost} 
                        checked={mods.includes(extra.id)}
                        style={{padding: '0', margin: '0', marginRight: '5px'}}>
                        {extra.mod_name}
                    </Tag>
                )
            ))}
        </div>
        </>
    );


}

export default RenderTags