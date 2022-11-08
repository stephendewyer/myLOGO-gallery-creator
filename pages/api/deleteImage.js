import { connectToDatabase } from '../../library/db';

async function handler(req, res) {

    if (req.method === 'DELETE') {

      const email = req.body.user_email;
  
      const logoID = req.body.id;

      // connect to the database
  
      let client;
  
      try {
  
        client = await connectToDatabase();
  
      } catch (error) {
  
        res.status(500).json({ message: 'could not connect to database.' });
        return;
  
      }

      const db = client.db()

      // find the image in the database using ID and user email

      const query = { email: email };

      const pull = {
        $pull: {
          gallery_images: {
            id: logoID
          }
        }
      };

      const options = {
        upsert: false,
        multi: true,
      }

      try {
        const result = db.collection('user_gallery_images').updateOne( query, pull, options );

        if (!result) {
          client.close();
          res.status(500).json({ message: 'failed to delete.  Logo not found'});
          return;
        }
      } catch (error) {
        client.close();
        res.status(500).json({ message: 'failed to delete image'});
        return;
      }
  
      res.status(200).json({ message: 'image deleted! '});
  
      return;
  
    }
  
  }
  
  export default handler;