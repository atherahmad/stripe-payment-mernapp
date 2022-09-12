import logo from './logo.svg';
import React, {useState} from 'react';
import './App.css';
import StripeCheckout from 'react-stripe-checkout';

function App() {

  const [product, setProduct] = useState({
    name:"Laptop",
    price: 10,
    productBy : "Ather"
  })

  const makePayment = token => {
    const body = {
      token,
      product,

    }
    const headers = {
      "Content-Type" : "application/json"
    }
    return fetch("http://localhost:8080/sripe-payment", {
      method: "POST",
      headers,
      body : JSON.stringify(body)
    })
    .then(res => console.log(res))
    .catch(err => console.log(err))
  }
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn Stripe Implementation in React
        </a>
        <StripeCheckout 
        stripeKey = {process.env.REACT_APP_STRIPE_PUBLIC_KEY}
        token={makePayment}
        name= "Buy via Stripe"
        amount={product.price * 100}
        shippingAddress
        billingAddress>
          <button className='btn-large green'>Buy via Stripe</button>
        </StripeCheckout>
      </header>
    </div>
  );
}

export default App;
