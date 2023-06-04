import { useRef } from 'react';
import { useEffect, useState } from 'react';
import './App.css';

function App() {
    const [customers, setCustomers] = useState([]);
    const firstNameRef = useRef();
    const lastNameRef = useRef();

    useEffect(() => {
        fetch("http://localhost:3000/customer")
            .then(res => res.json())
            .then(json => {
                setCustomers(json);
            });
    }, []);

    function deleteCustomer(index) {
        const id = customers[index]._id;
        fetch("http://localhost:3000/customer/" + id, {method: "DELETE"})
            .then(res => res.json())
            .then(json => {
                setCustomers(json);
            });
    }

    function addCustomer() {
        const newCustomer = {
            "firstName": firstNameRef.current.value,
            "lastName": lastNameRef.current.value
        }
        fetch("http://localhost:3000/customer/", {method: "POST", body: JSON.stringify(newCustomer), headers: {"Content-Type": "application/json"}})
            .then(res => res.json())
            .then(json => {
                customers.push(json);
                setCustomers(customers.slice());
            });
    }

    const [devices, setDevices] = useState([]);
    const deviceNameRef = useRef();
    const consumptionRef = useRef();

    useEffect(() => {
        fetch("http://localhost:3000/device")
            .then(res => res.json())
            .then(json => {
                setDevices(json);
            });
    }, []);

    function deleteDevice() {
        fetch("http://localhost:3000/device" + "_id", {method: "DELETE"})
            .then(res => res.json())
            .then(json => {
                setDevices(json);
            });
    }

    function addDevice() {
        const newDevice = {
            "name": deviceNameRef.current.value,
            "consumption": consumptionRef.current.value
        }
        fetch("http://localhost:3000/device/", {method: "POST", body: JSON.stringify(newDevice), headers: {"Content-Type": "application/json"}})
            .then(res => res.json())
            .then(json => {
                devices.push(json);
                setDevices(devices.slice());
            });
    }

    const navigationStyles = {
        backgroundColor: '#333',
        height: '50px',
    };

    const listStyles = {
        listStyleType: 'none',
        margin: 0,
        padding: 0,
        overflow: 'hidden',
    };

    const itemStyles = {
        float: 'left',
    };

    const linkStyles = {
        display: 'block',
        color: 'white',
        textAlign: 'center',
        padding: '16px',
        textDecoration: 'none',
    };

    return (
        <div>
            <nav style={navigationStyles}>
                <ul style={listStyles}>
                    <li style={itemStyles}>
                        <a href="#" style={linkStyles}>
                            Home
                        </a>
                    </li>
                    <li style={itemStyles}>
                        <a href="#" style={linkStyles}>
                            About
                        </a>
                    </li>
                    <li style={itemStyles}>
                        <a href="#" style={linkStyles}>
                            Services
                        </a>
                    </li>
                    <li style={itemStyles}>
                        <a href="#" style={linkStyles}>
                            Contact
                        </a>
                    </li>
                </ul>
            </nav>
            {/* <input ref={startRef} onChange={updateStart} type="datetime-local" />
      <input ref={endRef} onChange={updateEnd} type="datetime-local" /> */}
            <table style={{marginLeft: "100px"}}>
                <thead>
                <tr>
                    <th style={{border: "1px solid #ddd", padding: "12px", backgroundColor: "#04AA6D"}}>Eesnimi</th>
                    <th style={{border: "1px solid #ddd", padding: "12px", backgroundColor: "#04AA6D"}}>Perenimi</th>
                    <th style={{border: "1px solid #ddd", padding: "12px", backgroundColor: "#04AA6D"}}>Tegevused</th>
                </tr>
                </thead>
                <tbody>
                {customers.map((data, index) =>
                    <tr key={index}>
                        <td style={{border: "1px solid #ddd", padding: "8px"}}>{data.firstName}</td>
                        <td style={{border: "1px solid #ddd", padding: "8px"}}>{data.lastName}</td>
                        <td style={{border: "1px solid #ddd", padding: "8px"}}>
                            <button onClick={() => deleteCustomer(index)}>Kustuta andmebaasist</button> <br />
                            <button>TODO: Näita tarbija kasutusi</button> <br />
                            <button>TODO: Lisa tarbijale uus kasutus</button>
                        </td>
                    </tr>)}
                <tr>
                    <td style={{border: "1px solid #ddd", padding: "8px"}}> <input ref={firstNameRef} type="text" /> </td>
                    <td style={{border: "1px solid #ddd", padding: "8px"}}> <input ref={lastNameRef} type="text" /> </td>
                    <td style={{border: "1px solid #ddd", padding: "8px"}}> <button onClick={addCustomer}>Lisa</button> </td>
                </tr>
                </tbody>
            </table>
            <select>
                {devices.map(data => <option>{data.name} ({data.consumption} watti)</option> )}
            </select>
            Valitud: Inkjet printer <button onClick={deleteDevice}>Kustuta andmebaasist</button> <button>Lisa seadme uus kasutus</button>
        </div>
    );
}

export default App;