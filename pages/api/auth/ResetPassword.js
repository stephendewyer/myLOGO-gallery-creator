import { connectToDatabase } from '../../../library/db';

async function handler(req, res) {

    if (req.method !== 'PATCH') {
        console.log('request method is not POST')
        return;
    }

    // connect to the database

    const client = await connectToDatabase();

    const db = client.db();

    // load the user's email

    const email = req.body.email;

    // load the user in the database collection with the matching email address

    const existingUser = await db.collection('users').findOne({ email: email });

    // begin set token

    const crypto = require('crypto');
    const bcrypt = require('bcryptjs');

    crypto.randomBytes(32, (err, buffer) => {

        if (err) {
            console.log(err);
            client.close();
        }

        const token = buffer.toString('hex');

        // redirect the user if no user email is found

        if (!existingUser) {
            res.status(422).json({ message: 'no account with submitted email found' });
            client.close();
            return;
        }

        // add the token and token expiration date to the user document in the database

        const tokenExpDate = Date.now() + 3600000;

        
        db.collection('users').updateOne(
            { email: email },
            { 
                $set: { 
                    resetToken : token,
                    resetTokenExpiration : tokenExpDate,
                } 
            }
        );
        
        // begin send email verification

        const indexURLAdd = process.env.indexURL;

        const sgMail = require('@sendgrid/mail')
        sgMail.setApiKey(process.env.SENDGRID_API_KEY)
        const msg = {
            to: email,
            from: 'stephen.dewyer@stephengdewyer.info',
            subject: 'password reset',
            html: `
                <p>You requested a password reset.</p>
                <p>Click <a href="${indexURLAdd}/update_password/${token}" >this link to set a new password.</a></p>
            `
        };
        (async () => {
            try {
                await sgMail.send(msg);
                res.status(201).json({ message: 'sent verification email' });
                client.close();
            } catch (error) {
                console.error(error);
        
                if (error.response) {
                    console.error(error.response.body)
                    res.status(422).json({ message: 'message not sent due to a problem with the API' });
                }
            }
        })();
        // end send email verification

    });
    return;

};

export default handler;