import { hashPassword } from '../../../library/auth';
import { connectToDatabase } from '../../../library/db';
import { v4 as uuidv4 } from 'uuid';

async function handler(req, res) {
  if (req.method === 'POST') {

    const data = req.body;

    const { username, email, password } = data;

    if ( !username || !email || !password ) {

      res.status(422).json({ message:'all fields required' });
      return;

    }

    if (password.trim().length < 7) {

      res.status(422).json({ message:'password should also be at least 7 characters long' });
      return;

    }

    if (!email.includes('@')) {

      res.status(422).json({ message:'email address must include @' });
      return;

    }

    let client;

    try {

      client = await connectToDatabase();

    } catch (error) {

      res.status(500).json({ message: 'could not connect to database.' });
      return;

    }

  
    const db = client.db();

    const existingUser = await db.collection('users').findOne({ email: email });

    if (existingUser) {
      res.status(422).json({ message: 'User exists already!' });
      client.close();
      return;
    }

    const hashedPassword = await hashPassword(password);

    const indexURLAdd = process.env.indexURL;

    console.log(indexURLAdd);

    // get the default image URLs

    const image1src = `${indexURLAdd}/uploads/logo01.jpg`;
    const image2src = `${indexURLAdd}/uploads/logo02.png`;
    const image3src = `${indexURLAdd}/uploads/logo03.jpg`;
    const image4src = `${indexURLAdd}/uploads/logo04.png`;
    const image5src = `${indexURLAdd}/uploads/logo05.png`;
    const image6src = `${indexURLAdd}/uploads/logo06.png`;
    const image7src = `${indexURLAdd}/uploads/logo07.png`;
    const image8src = `${indexURLAdd}/uploads/logo08.jpg`;
    const image9src = `${indexURLAdd}/uploads/logo09.png`;
    const image10src = `${indexURLAdd}/uploads/logo10.jpg`;
    const image11src = `${indexURLAdd}/uploads/logo11.png`;
    const image12src = `${indexURLAdd}/uploads/logo12.jpg`;
    const image13src = `${indexURLAdd}/uploads/logo13.jpg`;
    const image14src = `${indexURLAdd}/uploads/logo14.jpeg`;
    const image15src = `${indexURLAdd}/uploads/logo15.jpg`;
    
    const defaultImages = [
      {
        image: image1src,
        altText: "default logo 1",
        timestamp: new Date(),
        id: uuidv4(),
      },
      {
        image: image2src,
        altText: "default logo 2",
        timestamp: new Date(),
        id: uuidv4(),
      },
      {
        image: image3src,
        timestamp: new Date(),
        altText: "default logo 3",
        id: uuidv4(),
      }, 
      {
        image: image4src,
        timestamp: new Date(),
        altText: "default logo 4",
        id: uuidv4(),
      },
      {
        image: image5src,
        timestamp: new Date(),
        altText: "default logo 5",
        id: uuidv4(),
      },
      {
        image: image6src,
        altText: "default logo 6",
        timestamp: new Date(),
        id: uuidv4(),
      },
      {
        image: image7src,
        altText: "default logo 7",
        timestamp: new Date(),
        id: uuidv4(),
      },
      {
        image: image8src,
        altText: "default logo 8",
        timestamp: new Date(),
        id: uuidv4(),
      },
      {
        image: image9src,
        altText: "default logo 9",
        id: uuidv4(),
        timestamp: new Date(),
      }, 
      {
        image: image10src,
        altText: "default logo 10",
        id: uuidv4(),
        timestamp: new Date(),
      },
      {
        image: image11src,
        altText: "default logo 11",
        id: uuidv4(),
        timestamp: new Date(),
      },
      {
        image: image12src,
        altText: "default logo 12",
        id: uuidv4(),
        timestamp: new Date(),
      },
      {
        image: image13src,
        altText: "default logo 13",
        id: uuidv4(),
        timestamp: new Date(),
      },
      {
        image: image14src,
        altText: "default logo 14",
        id: uuidv4(),
        timestamp: new Date(),
      },
      {
        image: image15src,
        altText: "default logo 15",
        id: uuidv4(),
        timestamp: new Date(),
      },
    ]

    // add user information and default images information to the database
    try {
      await db.collection('users').insertOne({
        username: username,
        email: email,
        password: hashedPassword,
        timestamp: new Date(),
      });

    } catch (error) {
      client.close();
      res.status(500).json({ message: 'failed to insert user into the users collection'});
      client.close();
      return;
    }

    try {
      await db.collection('user_gallery_images').insertOne({
        email: email,
        timestamp: new Date(),
        gallery_images: defaultImages,
      });
    } catch (error) {
      client.close();
      res.status(500).json({ message: 'failed to insert default logos into the user images collection'});
      return;
    }

    client.close();

    res.status(200).json({ message: 'account created! '});

    return;

  }

}

export default handler;