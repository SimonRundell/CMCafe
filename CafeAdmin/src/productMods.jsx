import React, { useState, useEffect } from 'react';
import { notification } from 'antd';

function ProductMods({ config, id }) {
    const [api, contextHolder] = notification.useNotification();
    const [productMods, setProductMods] = useState([]);
    const [editIndex, setEditIndex] = useState();
    const [newMod, setNewMod] = useState({ mod_name: '', mod_cost: 0.00 });

    useEffect(() => {
        const fetchProductMods = async () => {
            const jsonData = JSON.stringify({ product_id: id });
            // console.log("Product Mods JSON:", jsonData);
            try {
                const response = await fetch(config.api + '/getProductExtras.php', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: jsonData,
                });
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setProductMods(JSON.parse(data));
                // console.log("Product Mods:", data);
            } catch (error) {
                console.error("Error fetching product mods:", error);
            }
        };

        if (config) {
            fetchProductMods();
        }
    }, [config, id]);

    const handleModCost = (e) => {
        setProductMods(productMods.map(mod => {
            if (mod.id === editIndex) {
                return { ...mod, mod_cost: e.target.value };
            }
            return mod;
        }));
    }

    const handModName = (e) => {
        setProductMods(productMods.map(mod => {
            if (mod.id === editIndex) {
                return { ...mod, mod_name: e.target.value };
            }
            return mod;
        }));
    }

    const addModItem = async () => {
        const jsonData = JSON.stringify({ product_id: id, mod_name: newMod.mod_name, mod_cost: newMod.mod_cost });
        console.log("Add Mod JSON:", jsonData);
        try {
            const response = await fetch(config.api + '/insertProductExtras.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: jsonData,
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            console.log("Add Mod:", data);
            setProductMods([...productMods, { id: data, ...newMod }]);
            setNewMod({ mod_name: '', mod_cost: 0.00 });
        } catch (error) {
            console.error("Error adding product mod:", error);
        }
    }



    return (
        <div className='product-mods'>
            <div className='mod-list'>
                {productMods.map(mod => (
                    <div key={mod.id} className='mod-item' onClick={() => setEditIndex(mod.id)}>
                        <div>{editIndex === mod.id ? (
                            <input className="add-mod-name" type='text' value={mod.mod_name} onChange={handModName} />
                        ) : (
                            mod.mod_name
                        )}</div>
                        <div>{editIndex === mod.id ? (
                            <>£ <input className="add-mod-cost" type='text' value={mod.mod_cost} onChange={handleModCost}/></>
                        ) : (
                            <>
                            {mod.mod_cost === 0 ? 'Free' : (`Cost £ ${mod.mod_cost.toFixed(2)}`)}
                            </>
                        )}</div>
                    </div>
                ))}
                <div className='mod-item'>
                    <div><input className="add-mod-name" type='text' value={newMod.mod_name} placeholder='New Mod Name' onChange={(e)=>setNewMod({mod_name: e.target.value})}/></div>
                    <div>£ <input className="add-mod-cost" type='text' value={newMod.mod_cost} onChange={(e)=>setNewMod({mod_cost: e.target.value})}/></div>
                </div>
                <button className="mod-button" onClick={addModItem}>Add</button>
            </div>
        </div>
    );
}

export default ProductMods;