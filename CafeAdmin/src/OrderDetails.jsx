import React, { useEffect, useState } from 'react';
import RenderTags from './renderTags'; 

function OrderDetails({ config, orderid }) {
    const [orderDetails, setOrderDetails] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            const jsonData = JSON.stringify({orderid: orderid});
            // console.log('Order Details sending:', jsonData);
            try {
                const response = await fetch(config.api + '/getOrderDetails.php', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: jsonData,
                });
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                // console.log('Order details receiving:', data);
                

                if (Array.isArray(data)) {
                    // console.log('Data is an array:', data);
                    setOrderDetails(data);
                } else {
                    // console.error('Fetched data is not an array:', data);
                    try {
                        const parsedData = JSON.parse(data);
                        // console.log('Parsed data:', parsedData);
                        setOrderDetails(parsedData);
                    } catch (parseError) {
                        console.error('Error parsing data:', parseError);
                        setOrderDetails([]);
                    }
                }
            } catch (error) {
                console.error('Error fetching order details:', error);
                setOrderDetails([]);
            }
        };
        if (config) {
            fetchData();
        }
    }, [config.api]);

    const markComplete = async (id) => {
        // console.log('Marking order detail complete:', id);
        const element = document.getElementById(id);
        if (element) {
            element.style.backgroundColor = 'grey';
        }

        const jsonData = JSON.stringify({id: id});
        // console.log('Order detail ID to be completed:', jsonData);

        try {
            const response = await fetch(config.api + '/setItemComplete.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: jsonData,
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            // console.log('Order detail marked complete:', data.outcome);
        } catch (error) {
            console.error('Error marking order detail complete:', error);
        }
    }

    return (
        <>
            {orderDetails.length > 0 && orderDetails.map(orderDetail => {
                // console.log('Order detail before render:', orderDetail);
                return (
                    <div className="complete-me" onClick={() => markComplete(orderDetail.itemorderID)} id={orderDetail.itemorderID} key={orderDetail.itemorderID}>
                        {orderDetail.product_name}
                        <RenderTags mods={orderDetail.order_mods} config={config} productID={orderDetail.productItemID} />
                    </div>
                );
            })}
        </>
    );
}

export default OrderDetails;