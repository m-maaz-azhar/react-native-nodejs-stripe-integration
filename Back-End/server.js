require("dotenv").config();
const express = require("express");
const app = express();

app.use(express.json());

const Stripe = require("stripe")(
  "sk_test_51L03C8C28HUvnWbWqZaNuxlKABY7D6TUu40Y5oBZmvpnnRSJrNB1M73ubsq8bDkouGvsHEtuFa184yH1PMPSfmiz00N8sQCrrq"
);

app.post("/payment-sheet", async (req, res) => {
  // Use an existing Customer ID if this is a returning customer.
  let customer = {};
  let price = req.body.item.price;
  console.log("===>+ ", price);
  let paymentMethods = {};

  let paymentIntent = {};

  if (req.body.customer_id != undefined || req.body.customer_id != null) {
    customer = { id: req.body.customer_id };

    paymentMethods = await Stripe.paymentMethods.list({
      customer: req.body.customer_id,
      type: "card",
    });

    console.log("++++ ", paymentMethods);
    paymentIntent = await Stripe.paymentIntents.create({
      amount: price,
      currency: "usd",
      customer: customer.id,
      setup_future_usage: "off_session",
      payment_method: `${paymentMethods.data[0].id}`,
      automatic_payment_methods: {
        enabled: true,
      },
      transfer_group: 'ORDER11',
    });
  } else {
    customer = await Stripe.customers.create();
    paymentIntent = await Stripe.paymentIntents.create({
      amount: price,
      currency: "usd",
      customer: customer.id,
      setup_future_usage: "off_session",
      automatic_payment_methods: {
        enabled: true,
      },
      transfer_group: 'ORDER11',
    });
  }

  // Create a Transfer to the connected account
  const transfer = await Stripe.transfers.create({
    amount: price*0.8,
    currency: "usd",
    destination: "acct_1L0lnf2HzMXSpTXS",
    transfer_group: "ORDER11",
  });

  // Create a second Transfer to another connected account:
  const secondTransfer = await Stripe.transfers.create({
    amount: price*0.2,
    currency: "usd",
    destination: "acct_1L0pBs2HaF1T2SEc",
    transfer_group: "ORDER11",
  });
  const ephemeralKey = await Stripe.ephemeralKeys.create(
    { customer: customer.id },
    { apiVersion: "2020-08-27" }
  );

  console.log("====> ", secondTransfer);

  res.json({
    paymentIntent: paymentIntent.client_secret,
    ephemeralKey: ephemeralKey.secret,
    customer: customer.id,
    publishableKey:
      "pk_test_51L03C8C28HUvnWbWeK51fhEx6fGXK1vLSFos0KPMOBYn1xNRZsM4OsVZnazO0k2fYQKEjmFOa1P5Tz2qLKLVGBPn00c6D6yvbf",
  });
});

app.listen(process.env.PORT || 80);
