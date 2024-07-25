import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Main = () => {
  const [message, setMessage] = useState('');

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_API_URL}/api/message`)
      .then(response => {
        setMessage(response.data.message);
      })
      .catch(error => {
        console.error('There was an error fetching the message!', error);
      });
  }, []);

  return (
    <main>
      <p>Message: {message}</p>
    </main>
  );
};

export default Main;
