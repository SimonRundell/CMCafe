import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Checkbox, Input, Drawer } from 'antd';
import TableSelect from './getTable';
import LightBox from './lightBox';
import AddExtras from './addExtras';
import RenderTags from './renderTags';

const { TextArea } = Input;

/**
 * The menu, cart and order-submission flow. Renders every product grouped
 * by category, and a drawer for the current order.
 *
 * @param {object} props
 * @param {object} props.config Public cafe config (api base URL, tables, etc).
 * @param {object} props.notify antd notification instance (`notification.useNotification()`),
 *   shared with App so all toasts stack together.
 */
function Menu({ config, notify }) {
    const [menu, setMenu] = useState(null);
    const [showOrder, setShowOrder] = useState(false);
    const [tableNumber, setTableNumber] = useState("");
    const [order, setOrder] = useState([]);
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
            setMenu(responseData);
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
          notify.open({
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
        placeOrder({tableNumber, order, orderNotes, allergyAlert});
    }

    const addToOrder = (productID, productName, productCost, productAvailable, orderMods, orderModsCost) => {
        if (productAvailable === '1') {
          setOrder([...order, {productID, productName, productCost, orderMods, orderModsCost}]);
          setShowOrder(true);
        } else{
          notify.open({
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

        notify.open({
          message: 'Order Reset',
          description:
            'Your previous order has been cleared.',
          duration: 5,
        });
    }

    return (
      <>
        {menu && (
          <div className="app-menu">
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
                      <div className="menu-item menu-item-unavailable" key={item.id}>
                        <div className="menu-item-title">{item.product_name}</div>
                        <div className="menu-item-description">{item.product_description}</div>
                        <div className="menu-item-price">
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
                          <div className="menu-item-price-total">
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
                  <Checkbox checked={allergyAlert} onChange={(e) => setAllergyAlert(e.target.checked)} className="allergy-checkbox">Alert staff to allergies</Checkbox>
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

Menu.propTypes = {
    config: PropTypes.shape({
        api: PropTypes.string.isRequired,
    }).isRequired,
    notify: PropTypes.shape({
        open: PropTypes.func.isRequired,
    }).isRequired,
};

export default Menu;
