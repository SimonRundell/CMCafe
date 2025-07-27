import { useState, useEffect } from 'react'
import './App.css'
import Menu from './getMenu'
import Strapline from './strapline'
import { notification } from 'antd'

function setCookie(name, value, days) {
  const d = new Date();
  d.setTime(d.getTime() + (days*24*60*60*1000));
  let expires = "expires="+ d.toUTCString();
  document.cookie = name + "=" + value + ";" + expires + ";path=/";
}

function getCookie(name) {
  let nameEQ = name + "=";
  let ca = document.cookie.split(';');
  for(let i=0;i < ca.length;i++) {
    let c = ca[i];
    while (c.charAt(0)===' ') c = c.substring(1,c.length);
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length,c.length);
  }
  return null;
}

function App() {
  const [config, setConfig] = useState(null);
  const [api, contextHolder] = notification.useNotification();  

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
        api.open({
          message: 'Welcome to ' + data.cafeName,
          description: `Please take a seat, select the number from the top of this menu (or select takeaway) and place your order.`,
          duration: 15,
        });
        
      })
      .catch(error => {
        console.error("Error fetching config:", error);
      });
  }, []);

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
        <div className="menu-container"><Menu config={config}/></div>
      </div>
      )}
    </>
  )
}

export default App
