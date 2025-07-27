import React, { useEffect, useState } from 'react';
import OrderDetails from './OrderDetails';

function OpenOrders({ config }) {
    const [orders, setOrders] = useState(null);
    const [orderCheck, setOrderCheck] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(config.api + '/getOpenOrders.php');
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                // console.log('Open orders:', data);
                setOrders(JSON.parse(data));
            } catch (error) {
                console.error('Error fetching orders:', error);
            }
        };
        if (config) {
            fetchData();
        }
    }, [config.api, orderCheck]);
   
        useEffect(() => {
            const timer = setInterval(() => {
                setOrderCheck(prevOrderCheck => prevOrderCheck + 1);
            }, 10000);
    
            return () => {
                clearInterval(timer);
            };
        }, []);

    const completeOrder = async (id) => {
        // console.log('Completing order:', id);
        const jsonData = JSON.stringify({id: id});
        // console.log('Order detail ID to be completed:', jsonData);

        try {
            const response = await fetch(config.api + '/setOrderComplete.php', {
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

        setOrderCheck(prevOrderCheck => prevOrderCheck + 1);

    }

    const markPaid = async (id) => {
        // console.log('Completing order:', id);
        const jsonData = JSON.stringify({id: id});
        // console.log('Order detail ID to be completed:', jsonData);

        try {
            const response = await fetch(config.api + '/markOrderPaid.php', {
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
            // console.log('Order Paid:', data.outcome);
        } catch (error) {
            console.error('Error marking order paid:', error);
        }

        setOrderCheck(prevOrderCheck => prevOrderCheck + 1);
    }

    const getMinutesSinceOrderPlaced = (orderPlacedTimestamp) =>{
        const orderPlacedDate = new Date(orderPlacedTimestamp);
        const currentDate = new Date();
        const differenceInMilliseconds = currentDate - orderPlacedDate;
        const differenceInMinutes = Math.floor(differenceInMilliseconds / 60000);
    
        return differenceInMinutes;
    }

    return (
        <>
            <h2>Open Orders</h2>
            {Array.isArray(orders) && orders.length > 0 ? (
                <table>
                    <thead>
                        <tr>
                            <th>Order ID</th>
                            <th>Table</th>
                            <th>Time</th>
                            <th>Notes</th>
                            <th>Order</th>
                            <th>Extras</th>
                            <th>Order Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map(order => (
                            <tr key={order.id}>
                                <td className="large-display">{order.id}</td>
                                <td>
                                    <div className="large-display" style={{paddingBottom: '0', marginBottom: '3px'}}>{order.order_table}</div>
                                </td>
                                <td><div>{new Date(order.time_placed).toLocaleString('en-GB')}</div>
                                    <div className="time-placed">{getMinutesSinceOrderPlaced(order.time_placed)} mins</div>
                                </td>
                                <td><div className="notes-border">{order.order_notes}</div>
                                    {(order.allergy_alert === '1') && <div className="notes-border" style={{color: 'red', fontStyle: 'bold'}}>ALLERGY WARNING</div>}
                                </td>
                                <td><OrderDetails config={config} orderid={order.id}/></td>
                                <td>
                                        <div style={{marginBottom: '10px'}}>{order.order_paid === '0' &&<button onClick={()=>markPaid(order.id)}>Mark Paid</button>}</div>
                                        <div><button onClick={()=>completeOrder(order.id)}>Complete & Close</button></div>
                                </td>
                                <td className="large-display"> £{parseFloat(order.order_total).toFixed(2)}
                                {order.order_paid === '0' && <div className="notes-border" style={{color: 'red', fontStyle: 'bold'}}>Not Paid</div>}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <>
                <h1>No open orders.</h1>
                <p>Go and do some cleaning</p>
                </>
            )}
        </>
    );
}

export default OpenOrders;
