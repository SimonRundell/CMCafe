import React, { useEffect, useState } from 'react';
import { Tag } from 'antd';

function RenderTags({ config, productID, mods }) {
    const [extras, setExtras] = useState([]);

    // console.log("RenderTags received: ProductID:", productID, " Mods:", mods);

    const modsArray = mods ? mods.split('|') : [];

    useEffect(() => {
        if (productID) {
            const jsonData = JSON.stringify({ product_id: parseInt(productID) });
            // console.log("RenderTags sending: ", jsonData);
            fetch(config.api + '/getProductExtras.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: jsonData,
            })
                .then(response => response.json())
                .then(responseData => {
                    // console.log("Response data received:", responseData);
                    try {
                        const parsedData = JSON.parse(responseData);
                        setExtras(parsedData);
                    } catch (error) {
                        console.error('Error parsing response data:', error);
                    }
                })
                .catch(error => {
                    console.error('Error fetching product extras:', error);
                });
        } else {
            console.error('ProductID is undefined');
        }
    }, [config.api, productID]);

    return (
        <div className="order-extras-container">
            {extras && extras.map(extra => (
                modsArray.includes(extra.id.toString()) && (
                    <Tag key={extra.id}
                        value={extra.mod_cost}
                        checked={modsArray.includes(extra.id.toString())}
                        style={{ padding: '3px', margin: '0', marginRight: '5px', backgroundColor: '#ccc', border: '1px solid black' }}>
                        {extra.mod_name}
                    </Tag>
                )
            ))}
        </div>
    );
}

export default RenderTags;