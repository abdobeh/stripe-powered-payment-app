import {stripe} from './';
import Stripe from 'stripe';
import {db} from './firebase';


export async function getOrCreateCustomer(userId: string, params?: Stripe.CustomerCreateParams) {

    const userSnapshot = await db.collection('users').doc(userId).get();

    const { stripeCustomerId, email } = userSnapshot.data();

    if (!stripeCustomerId) {
        
        const customer = await stripe.customers.create({
            email,
            metadata: {
                firebaseUID: userId
            },
            ...params
        });
        await userSnapshot.ref.update({ stripeCustomerId: customer.id });
        return customer;
    } else {
        return await stripe.customers.retrieve(stripeCustomerId) as Stripe.Customer;
    }

};

export async function createSetupIntent(userId: string) {

    const customer = await getOrCreateCustomer(userId);

    return stripe.setupIntents.create({
        customer: customer.id,
    })
};

export async function ListPaymentMethods(userId:string) {
    const customer = await getOrCreateCustomer(userId);

    return stripe.paymentMethods.list({
        customer: customer.id,
        type: 'card',
    });
};

