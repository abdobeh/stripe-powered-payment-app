import express, {Request, Response, NextFunction } from 'express';
import cors from 'cors';
import { createStripeCheckoutSession} from './checkout';
import { createPaymentIntent } from './payments';
import { handleStripeWebhook } from './webhooks';
import {auth} from './firebase';
import { ListPaymentMethods } from './customer';

export const app = express();

app.use(express.json())

app.use(cors({ origin: true}));

app.post('/test', (req: Request, res: Response) => {

    const amount = req.body.amount;

    res.status(200).send({ with_tax: amount *7 });
})

app.use(
    express.json({
      verify: (req, res, buffer) => (req['rawBody'] = buffer),
    })
  );

  
/**
 * Checkout
 */

app.post(
    '/checkouts/', async ({ body }: Request, res: Response) => {
        res.send(

            await createStripeCheckoutSession(body.line_items)


        );
    }
);


function runAsync(callback: Function) {
    return (req: Request, res: Response, next: NextFunction) => {
        callback(req, res, next).catch(next);
    };
}

/**
 * Payment Intents
 */

 app.post(
    '/payments',
    runAsync(async ({ body }: Request, res: Response) => {
      res.send(
        await createPaymentIntent(body.amount)
      );
    })
  );
  
  /**
* Webhooks
 */

app.post('/hooks', runAsync(handleStripeWebhook));

app.use(decodeJWT)

async function decodeJWT(req: Request, res: Response, next: NextFunction) {
    if (req.headers?.authorization?.startsWith('Bearer')) {
        const idToken = req.headers.authorization.split('Bearer' )[1];

    try {
        const decodedToken = await auth.verifyIdToken(idToken);
        req['currentUser'] = decodedToken;
    }   catch (err) {
        console.log(err);
    
    }
}
    next();
};

function validateUser(req: Request) {
    const user = req['currentUser'];
    if (!user) {
        throw new Error(
            'You must be logged in to make this request. i.e Authorization: Bearer <token>'
        );
    }
    return user;

}

app.post(
    '/wallet',
    runAsync(async (req: Request, res: Response) => {
        const user = validateUser(req);
        const setupIntent = await createPaymentIntent(user.uid);
        res.send(setupIntent);
    })
);


app.get(
    '/wallet',
    runAsync(async (req: Request, res: Response) => {
        const user = validateUser(req);

        const wallet = await ListPaymentMethods(user.uid);
        res.send(wallet.data);
    })
);

