import React from 'react'
import mqtt from 'mqtt';


const Mqtt = () => {

    const [client, setClient] = useState(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    // Connect to the MQTT broker
    const mqttClient = mqtt.connect({
      hostname: '4.240.114.7',
      port: 9001,
      protocol: 'ws',
      // path: '/mqtt',
      username: 'BarifloLabs',
      password: 'Bfl@123'
    });

    setClient(mqttClient);

    // Subscribe to a topic to receive data from the device
    mqttClient.on('connect', () => {
      console.log('Connected to MQTT broker');
      mqttClient.subscribe(`${26773439927218}/data`);
      mqttClient.subscribe(`${565988520125275}/data`); 
      mqttClient.subscribe(`${847120588896324}/data`);
    });

    // Handle incoming messages
    mqttClient.on('message', (topic, payload) => {
      console.log(`Received message on topic ${topic}: ${payload.toString()}`);
      // Process the received data here and update state or trigger any necessary actions
    });

    return () => {
      // Disconnect from the MQTT broker when component unmounts
      if (mqttClient) {
        mqttClient.end();
        console.log('Disconnected from MQTT broker');
      }
    };
  }, []);


  // Function to publish a message to control the device
  const publishMessage = () => {
    if (client) {
      client.publish(`${26773439927218}/data`, message);
      console.log('Published message to control the device');
    }
  };

  const handleCheckboxChange = (event) => {
    setDeviceChecked(event.target.checked);
    setMessage(event.target.value);
    if (event.target.checked) {
      publishMessage();
    }
  };
  return (
    <div>Mqtt</div>
  )
}

export default Mqtt