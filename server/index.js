import express from "express";
import Stripe from "stripe";
import cors from "cors";
import { v4 as uuidv4 } from 'uuid';
import dotenv from "dotenv"

const app = express();
dotenv.config()

// middleware
app.use(express.json())
app.use(cors())


const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

/* const stripeController = async () => {
    const customer = await stripe.customers.create({
        email: 'atherdci@gmail.com',
      });
    
      console.log(customer.id);
}
 */
//routes

// route for stripe
app.post("/sripe-payment", (req, res) => {

    const {product, token} = req.body


    const idempotencyKey = uuidv4() // it keeps record that user is not charged twice for the same product

    return stripe.customers.create({
        email : token.email,
        source: token.id
    })
    .then(customer => stripe.charges.create({
        amount: product.price * 100, // muliplying with 100 because stripe calculates in cents
        currency: "usd",
        customer: customer.id,
        receipt_email: token.email,
        description: product.name,
        shipping: {
            name: token.card.name,
            address: {
                country: token.card.address_country
            }
        } 

    }, {
        idempotencyKey
    }))
    .then(result => res.status(200).json(result))
    .catch(err => console.log(err))

})

app.get("/", (req, res) => res.send("Accessing Stripe Backend"))


//listen

app.listen(8080, () => console.log("App listening at 8080"))