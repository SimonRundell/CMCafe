import { useState, useEffect } from 'react'
import './App.css'
import Menu from './getMenu'
import Strapline from './strapline'
import { notification } from 'antd'

/**
 * Root component. Loads the cafe's public config (name, tables, contact
 * details) and renders the menu once it's available. Owns the single
 * antd notification instance shared with Menu, so all toasts stack together.
 */
function App() {
  const [config, setConfig] = useState(null);
  const [notify, contextHolder] = notification.useNotification();

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
        notify.open({
          message: 'Welcome to ' + data.cafeName,
          description: `Please take a seat, select the number from the top of this menu (or select takeaway) and place your order.`,
          duration: 15,
        });

      })
      .catch(error => {
        console.error("Error fetching config:", error);
      });
  }, [notify]);

  return (
    <>
    {contextHolder}
    {config && (
      <div className="app-container">
        <div className="app-header">
          <div className="cafe-title">{config.cafeName}</div>
            <div className="cafe-strapline">{config.strapline}</div>
        </div>
        <div className="bottom-strap"><Strapline config={config} /></div>
        <div className="menu-container"><Menu config={config} notify={notify} /></div>
      </div>
      )}
    </>
  )
}

export default App
