import React, { useEffect, useState } from 'react';
import { Tag } from 'antd';

function AddExtras({ config, productID, setOrderMods, setOrderModsCost }) {
    const [extras, setExtras] = useState([]);
    const [chosenExtras, setChosenExtras] = useState([]);

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

    useEffect(() => {
        // console.log('Chosen extras:', chosenExtras);
        const calculateExtrasTotal = () => {
            const extrasSubTotal = chosenExtras.reduce((total, extraId) => {
                const extra = extras.find((item) => item.id === extraId);
                return total + extra.mod_cost;
            }, 0);
            // console.log('Extras Total:', extrasSubTotal);
            setOrderModsCost(extrasSubTotal);
            return extrasSubTotal;
        };

        const extrasTotal = calculateExtrasTotal();
    }, [chosenExtras]);

    const handleChange = (tag, checked) => {
        const nextChosenExtras = checked
          ? [...chosenExtras, tag]
          : chosenExtras.filter((t) => t !== tag);
        setChosenExtras(nextChosenExtras);
        setOrderMods(nextChosenExtras);
    };

    return (
        <>
        <div className="extras-container">
            {extras && extras.map(extra => (
                <Tag.CheckableTag key={extra.id} 
                                  value={extra.mod_cost} 
                                  checked={chosenExtras.includes(extra.id)}
                                  onChange={(checked) => handleChange(extra.id, checked)}
                                  style={{marginRight: '5px'}}>
                    {extra.mod_name} <strong>+£{extra.mod_cost.toFixed(2)}</strong>
                </Tag.CheckableTag>
            ))}
        </div>
        </>
    );
}

export default AddExtras;

