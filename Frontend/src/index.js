import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';

import { firebaseAppProvider } from 'reactfire';

import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

const firebaseConfig = {

  apiKey: "AIzaSyAZGZ4yb0gNzkoKr79ku2divfoWXLcRS9c",

  authDomain: "abdobeh-b0403.firebaseapp.com",

  projectId: "abdobeh-b0403",

  storageBucket: "abdobeh-b0403.appspot.com",

  messagingSenderId: "906150624174",

  appId: "1:906150624174:web:f6b13989eb67b072d3263f",

  measurementId: "G-F6ZWW94FRG"

};

export const stripePromise = loadStripe(
  'pk_test_51KOLX7Cr1L2XVSYVZGooqLBgrxxcRIs45KW0WyynRMvHgBtPJmuzaVl81tquWdRf5xdjaYqLxj26SPSWjWd5Ajyi00fIbxWTlk'
)
ReactDOM.render(
  <React.StrictMode>
    <firebaseAppProvider firebaseConfig = {firebaseConfig}>
    <Elements stripe = {stripePromise}>
    <App />
    </Elements>
    </firebaseAppProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

