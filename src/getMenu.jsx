import React, { useState, useEffect } from 'react';
import { Checkbox, notification, Input, Drawer } from 'antd';
import TableSelect from './getTable';
import LightBox from './lightBox';
import AddExtras from './addExtras';
import RenderTags from './renderTags';

const { TextArea } = Input;

function Menu({ config }) {
    const [menu, setMenu] = useState(null);
    const [showOrder, setShowOrder] = useState(false);
    const [tableNumber, setTableNumber] = useState("");
    const [order, setOrder] = useState([]);
    const [api, contextHolder] = notification.useNotification();
    const [currentTotal, setCurrentTotal] = useState(0);
    const [allergyAlert, setAllergyAlert] = useState(0);
    const [orderNotes, setOrderNotes] = useState("");
    const [orderMods, setOrderMods] = useState([]);
    const [orderModsCost, setOrderModsCost] = useState(0);

    const zero = 0;

    useEffect(() => {
    
        fetch( config.api +'/getProducts.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({}),
           
        })
        .then(response => response.json()) 
        .then(responseData => {

        // console.log(responseData);
        setMenu(JSON.parse(responseData));
        })
    }, [config.api]);
    
    useEffect(() => {
        let tempTotal = 0;
        order.forEach(item => {
            tempTotal += parseFloat(item.productCost) + parseFloat(item.orderModsCost);
        });
        setCurrentTotal(parseFloat(tempTotal).toFixed(2));
    }, [order]);

    const placeOrder = async ({ tableNumber, order, orderNotes, allergyAlert }) => {
      // Convert orderMods array to string for each item in the order array
      const updatedOrder = order.map(item => ({
          ...item,
          orderMods: item.orderMods && item.orderMods.map(mod => mod.toString()).join('|') || ""
      }));
  
      const jsonData = JSON.stringify({ tableNumber, order: updatedOrder, orderNotes, allergyAlert });
  
      // console.log("Placing order", jsonData);
      
      try {
        const response = await fetch(config.api + '/placeOrder.php', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: jsonData,
        });
              
        if (response.status === 200) {
          const result = await response.json(); // Wait for the promise to resolve
          // console.log(result); 
          api.open({
            message: 'Your order has been placed',
            description: `${result.outcome}.
                    Your Order Number is ${result.orderid}
                    Order Cost: £${parseFloat(result.totalCost).toFixed(2)}
                    Payment will be taken when your order is delivered to your table.`,
            duration: 10,
          });
          setShowOrder(false);
        }
      } catch (error) {
        console.error("Error placing order:", error);
      }
    };

    const submitOrder = () => {
        // console.log("Order submitted by table", tableNumber, order);
        placeOrder({tableNumber, order, orderNotes, allergyAlert});
    }

    const addToOrder = (productID, productName, productCost, productAvailable, orderMods, orderModsCost) => {
        if (productAvailable === '1') {
          // console.log("Adding to order product", {productID, productName, productCost, orderMods, orderModsCost});
          setOrder([...order, {productID, productName, productCost, orderMods, orderModsCost}]);
          setShowOrder(true);
        } else{
          api.open({
            message: 'Apologies, this item is not available',
            description:
              'Please choose another item.',
            duration: 5,
          });
        }
    }

    const handleDelete = (indexToDelete) => {
        const updatedItems = order.filter((_, index) => index !== indexToDelete);
        setOrder(updatedItems);
    };

    const handleOrderNotes = (e) => {
        setOrderNotes(e.target.value);
    }

    const handleSetOrderMods = (itemId, mods) => {
      setOrderMods((prev) => ({ ...prev, [itemId]: mods }));
    };
  
    const handleSetOrderModsCost = (itemId, cost) => {
      setOrderModsCost((prev) => ({ ...prev, [itemId]: cost }));
    };

    const resetTable = () => {
        setTableNumber("");
        setOrder([]);
        setShowOrder(false);
        setOrderNotes("");
        setOrderModsCost(0);
        setAllergyAlert(0);

        menu.forEach(item => {
          handleSetOrderMods(item.id, "");
        });

        api.open({
          message: 'Order Reset',
          description:
            'Your previous order has been cleared.',
          duration: 5,
        });
    }

    let previousCategory = "";
 
    return (
      <>
        {menu && (
          <div className="app-menu">
            {contextHolder}
            <div className="table-number">
              <div className="click-me" onClick={resetTable}>New Order:</div>
              <TableSelect config={config} tableNumber={tableNumber} setTableNumber={setTableNumber} />
              <div className="order-button" onClick={() => setShowOrder(true)}>Your Order £{currentTotal}</div>
            </div>
            {Array.isArray(menu) ? (
              <>
                {menu.reduce((acc, item) => {
                  const categoryChanged = item.product_category !== acc.previousCategory;
                  if (categoryChanged) {
                    acc.previousCategory = item.product_category;
                    acc.elements.push(
                      <div className="menu-category-title" key={item.product_category}>
                        {item.product_category}
                      </div>
                    );
                  }
                  if (item.product_available === '0') {
                    acc.elements.push(
                      <div className="menu-item" key={item.id} style={{ color: 'lightgrey', backgroundColor: 'grey' }}>
                        <div className="menu-item-title" style={{ color: 'lightgrey' }}>{item.product_name}</div>
                        <div className="menu-item-description" style={{ color: 'lightgrey' }}>{item.product_description}</div>
                        <div className="menu-item-price" style={{ color: 'lightgrey' }}>
                          £ Not available
                        </div>
                      </div>
                    );
                  } else {
                    acc.elements.push(
                      
                      <div className="menu-item" key={item.id}>
                        <div className="menu-item-title">{item.product_name}</div>
                        <div className="mobile-title-image">
                          <div>
                              <LightBox image_url={item.image_url} />
                          </div>
                          <div className="menu-item-description-container">
                              <div className="menu-item-description">{item.product_description}</div>
                              <div><AddExtras config={config} 
                                              productID={item.id} 
                                              setOrderMods={(mods)=>handleSetOrderMods(item.id, mods)} 
                                              setOrderModsCost={(mods)=> handleSetOrderModsCost(item.id, mods)}/>
                              </div>
                          </div>
                        </div>
                        <div className="menu-item-price">
                          £{!isNaN(parseFloat(item.product_cost)) ? parseFloat(item.product_cost).toFixed(2) : parseFloat(zero).toFixed(2)}
                          <div className="extras">
                            + £{!isNaN(parseFloat(orderModsCost[item.id])) ? parseFloat(orderModsCost[item.id]).toFixed(2) : parseFloat(zero).toFixed(2)}  
                        </div>
                          <div style={{borderTop: '1px solid black', marginTop: '5px', marginRight: '8px'}}>
                          £{(parseFloat(item.product_cost) + parseFloat(orderModsCost[item.id] || zero)).toFixed(2)}
                          </div>
                        </div>
                        
                        <button className="menu-order-button"
                          onClick={() =>
                            addToOrder(item.id, item.product_name, item.product_cost, item.product_available, orderMods[item.id], orderModsCost[item.id])
                          }>Add</button>
                      </div>
                    );
                  }
                  return acc;
                }, { previousCategory: '', elements: [] }).elements}
              </>
            ) : (
              <div className="menu-item">Apologies, our menu is not available at the moment.</div>
            )}
            <Drawer
              title="Your Order"
              open={showOrder}
              onClose={() => setShowOrder(false)}
            >
              {!tableNumber ? (
                <div className="show-tablenumber">Table Number: NO TABLE SELECTED</div>
              ) : (
                <div className="show-tablenumber">Table Number: {tableNumber}</div>
              )}
              <div className="show-order">
                {order.map((item, index) => (
                  <div key={index}>
                    {item["productName"]} £
                    {(!isNaN(parseFloat(item["productCost"])) && !isNaN(parseFloat(item["orderModsCost"])))
                      ? (parseFloat(item["productCost"]) + parseFloat(item["orderModsCost"])).toFixed(2)
                      : parseFloat(item["productCost"]).toFixed(2)}
                    <button
                      onClick={() => handleDelete(index)}
                      className="remove-item"
                    >
                      X
                    </button>
                    {item["orderMods"] && (
                      <div>
                        <RenderTags config={config} productID={item["productID"]} mods={item["orderMods"]} />
                      </div>
                    )}
                  </div>
                ))}
                <div>
                  <div className="total-cost">Total: £{parseFloat(currentTotal).toFixed(2)}</div>
                </div>
                <div>
                  <TextArea rows={4} value={orderNotes} onChange={(e) => handleOrderNotes(e)} placeholder="Any notes or requests"/>
                </div>
                <div>
                  <Checkbox checked={allergyAlert} onChange={(e) => setAllergyAlert(e.target.checked)} style={{'color': 'red'}}>Alert staff to allergies</Checkbox>
                </div>
                {tableNumber && (
                <button className="menu-order-button" onClick={submitOrder}>Submit Order</button>
                )}
              </div>
            </Drawer>
          </div>
        )}
      </>
    )
}

export default Menu;