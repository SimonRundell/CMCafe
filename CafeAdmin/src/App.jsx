import { useState, useEffect } from 'react'
import { Drawer } from 'antd'
import Menu from './Menu'
import OpenOrders from './openOrders'
import './App.css'

function App() {
  const [config, setConfig] = useState(null);
 

  useEffect(() => {
    fetch('/.config.json')
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        setConfig(data);
        // console.log("Configuration:", data);
      })
      .catch(error => {
        console.error("Error fetching config:", error);
      });
  }, []);

  const editMenuItem = () => {
      if (document.querySelector('.product-menu').style.display === 'none') {    
        document.querySelector('.product-menu').style.display = 'grid';
      } else {
        document.querySelector('.product-menu').style.display = 'none';
      }
  }

  const openOrders = () => {
    if (document.querySelector('.open-orders').style.display === 'none') {    
      document.querySelector('.open-orders').style.display = 'grid';
    } else {
      document.querySelector('.open-orders').style.display = 'none';
    }
  }

  return (
    <>
    {config && (
      <div className='app-container'>
        <div className='app-header'>
          <div className='cafe-title'>{config?.cafeName} ADMIN SYSTEM</div>
          <div className='cafe-strapline'>{config?.strapline}</div>
        </div>
        <div className="admin-button">
          <button onClick={()=>editMenuItem()}>Edit Menu</button>
          <button onClick={()=>openOrders()}>Open Orders</button>
        </div>
        <div className="product-menu">
          <Menu config={config} editMenuItem={editMenuItem}/>
        </div>
        <div className="open-orders">
          <OpenOrders config={config} />
        </div>
      </div>
    )}
    </>
  )
}

export default App
