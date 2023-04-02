import { hashPassword } from '../../../library/auth';
import { connectToDatabase } from '../../../library/db';

async function handler(req, res) {
    
    if (req.method !== 'PATCH') {
      return;
    }

    const newPassword = req.body.newPassword;

    const validUserEmail = req.body.userEmail.validatedUserEmail;

    // validate the new password

    if (
        !newPassword ||
        newPassword.trim().length < 7
    ) {
        res.status(422).json({
            message:
                'invalid input - password should be at least 7 characters long.',
        });
        return;
    }

    // if password is valid, connect to the database
  
    const client = await connectToDatabase();
  
    const usersCollection = client.db().collection('users');
  
    const hashedPassword = await hashPassword(newPassword);
  
    await usersCollection.updateOne(
      { email: validUserEmail },
      { $set: { password: hashedPassword } }
    );
  
    client.close();

    // begin send email verification

    const sgMail = require('@sendgrid/mail')
    sgMail.setApiKey(process.env.SENDGRID_API_KEY)
    const msg = {
        to: validUserEmail,
        from: 'stephen.dewyer@stephengdewyer.info',
        subject: 'password update',
        html: '<h1>Your myLOGO gallery creator password has been updated.  If you are receiving this email in error, please contact the myLOGO gallery creator administrator at stephen.dewyer@stephengdewyer.info.</h1>'
    };
    (async () => {
        try {
          await sgMail.send(msg);
          res.status(200).json({ message: 'password updated' });
        } catch (error) {
          console.error(error);
    
          if (error.response) {
            console.error(error.response.body)
            res.status(422).json({ message: 'message not sent due to a problem with the API' });
          }
        }
    })();

    // end send email verification

  }
  
  export default handler;