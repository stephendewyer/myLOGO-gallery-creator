import { connectToDatabase } from '../../library/db';
import { v4 as uuidv4 } from 'uuid';


async function handler(req, res) {

    if (req.method !== 'POST') {
        return;
    }

    const email = req.body.user_email;

    const altText = req.body.altText;
    
    const imageURL = req.body.uploadedImageURL;

    if (!email) {
        res.status(422).json({
        message:
          'failed to add image to database.  Missing session email.',
      });
      return;
    }

    if (!imageURL) {
        res.status(422).json({
        message:
          'failed to add image to database.  Missing image URL.',
      });
      return;
    }

    // validate the file type

    // array of allowed files
    const array_of_allowed_files = ['png', 'jpeg', 'jpg', 'JPG', 'svg', 'gif'];

   // get the extension of the uploaded file
    const file_extension = imageURL.slice(
        ((imageURL.lastIndexOf('.') - 1) >>> 0) + 2
    );

    // check if the uploaded file is allowed
    if (!array_of_allowed_files.includes(file_extension)) {
        res.status(422).json({ message:'invalid file.  file type must be an image' });
        return;
    }

    // connect to the database
    let client;

    try {

        client = await connectToDatabase();
  
    } catch (error) {
        res.status(500).json({ message: 'Could not connect to database.' });
        return;
  
    }

    const db = client.db();

    const imageCollection = db.collection('user_gallery_images');

    const query = { email: email };

    const push = {
        $push: {
            gallery_images: {
                image: imageURL,
                altText: altText,
                timestamp: new Date(),
                id: uuidv4(),
            }
        }
    };

    try {

        await imageCollection.updateOne( query, push );

    } catch (error) {

            client.close();
            res.status(500).json({ message: 'failed to insert user into the database'});
            return;

    }

    client.close();

    res.status(200).json({ message: 'image added to database! '});
  
    return;

}

export default handler;