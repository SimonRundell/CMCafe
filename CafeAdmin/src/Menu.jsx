import React, { useState, useEffect } from 'react'
import { Checkbox, notification, Input } from 'antd'
import UploadImage from './upload'
import ProductMods from './productMods';
const { TextArea } = Input;

function Menu({config, editMenuItem}) {
    const [menuItems, setMenuItems] = useState([]);
    const [api, contextHolder] = notification.useNotification();

    useEffect(() => {
        const fetchMenuItems = async () => {
            try {
                const response = await fetch(config.api + '/getProducts.php');
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setMenuItems(JSON.parse(data));
                // console.log("Menu Items:", data);
            } catch (error) {
                console.error("Error fetching menu items:", error);
            }
        };

        if (config) {
            fetchMenuItems();
        }
    }, [config]);

function handleProductName(e, id) {
    setMenuItems(menuItems.map(item => {
        if (item.id === id) {
            return { ...item, product_name: e.target.value };
        }
        return item;
    }));
}

function handleProductCategory(e, id) {
    setMenuItems(menuItems.map(item => {
        if (item.id === id) {
            return { ...item, product_category: e.target.value };
        }
        return item;
    }));
}

function handleProductDescription(e, id) {
    setMenuItems(menuItems.map(item => {
        if (item.id === id) {
            return { ...item, product_description: e.target.value };
        }
        return item;
    }));
}

function handleProductCost(e, id) {
    setMenuItems(menuItems.map(item => {
        if (item.id === id) {
            return { ...item, product_cost: e.target.value };
        }
        return item;
    }));
}

function updateMenuItem(id) {
    const item = menuItems.find(item => item.id === id);
    console.log("Updating menu item:", item);
    fetch(config.api + '/updateProduct.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(item)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        console.log("Update response:", data);
        api.open({
            message: 'Item Updated',
            description: data.outcome,
            duration: 5,
        });
    })
    .catch(error => {
        console.error("Error updating menu item:", error);
    });
}

const addItem = () => {

    const addMenuItem = async () => {
        try {
            const response = await fetch(config.api + '/createProduct.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({"product_name": "", "product_category": "", "product_description": "", "product_cost": ""})
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            console.log("Update response:", data);
            api.open({
                message: 'Item Added',
                description: data.outcome + " (" + data.productID +")",
                duration: 5,
            });
            setMenuItems([...menuItems, {"id": data.productID, "product_name": "", "product_category": "", 
                                         "product_description": "", "product_cost": "",
                                         "product_available":1}]);
        } catch (error) {
            console.error("Error updating menu item:", error);
        }
    }

    addMenuItem();
}

    const handleProductImage = (image, id) => {

        // console.log("Image in menu:", image[0]['data_url']);
        
        setMenuItems(menuItems.map(item => {
            if (item.id === id) {
                return { ...item, image_url: image[0]['data_url'] };
            }
            return item;
        }));
    }

    const handleProductMods = (mods, id) => {
        console.log("Mods for item:", id, mods);
            setMenuItems(menuItems.map(item => {
            if (item.id === id) {
                return { ...item, product_mods: mods };
            }
            return item;
        }));
    }
     
return (
    <>
    {contextHolder}
    <div className="add-item-button"><button onClick={addItem}>Add Item</button><button onClick={editMenuItem}>X</button></div>
    <div className="edit-menu">
            {menuItems && menuItems.map((item) => {
                return (
                    <div className="menu-item" key={item.id}>
                        <div>
                            <Input
                                type="text"
                                value={item.product_name}
                                onChange={(e) => handleProductName(e, item.id)}
                                style={{ width: '100%' }}
                            />
                            <UploadImage handleProductImage={handleProductImage} 
                                         id={item.id} 
                                         product_image={item.image_url} />
                        </div>
                        <div>
                            <Input
                                type="text"
                                value={item.product_category}
                                onChange={(e) => handleProductCategory(e, item.id)}
                                style={{ width: '75px', fontStyle: 'bold' }}
                            />
                        </div>
                        <div>
                            <TextArea
                                value={item.product_description}
                                onChange={(e) => handleProductDescription(e, item.id)}
                                style={{ width: '400px' }}
                            />
                            <ProductMods config={config} id={item.id} />
                        </div>
                        <div>
                            <Input
                                type="text"
                                addonBefore="£"
                                value={parseFloat(item.product_cost).toFixed(2)}
                                onChange={(e) => handleProductCost(e, item.id)}
                                style={{ width: '90px' }}
                            />
                            
                        </div>
                        <div className="black-text">
                            Available: <Checkbox
                                        checked={item.product_available}
                                        onChange={(e) => setMenuItems(menuItems.map(i => {
                                            if (i.id === item.id) {
                                                return { ...i, product_available: e.target.checked };
                                            }
                                            return i;
                                        }))}
                                        />
                        </div>
                        <div>
                            <button onClick={() => updateMenuItem(item.id)}>Save</button>
                        </div>
                    </div>
                );
            })}
    </div>
    </>
)

}

export default Menu