import { connectToDatabase } from '../../library/db';
import nc from 'next-connect';

export const config = {
    api: {
        bodyParser: false,
    }
};

const upload = multer({
    storage: multer.diskStorage({
        destination: "./public/uploads",
        filename: function (req, file, cb) {
            // set the file name
            cb(null, new Date().getTime() + "-" + file.originalname);
        },
    }),
});

const handler = nc({
    
    onError: (err, req, res, next) => {
        
        console.error(err.stack);
        res.status(500).end("something broke!");
    },
    onNoMatch: (req, res) => {
        res.status(404).end("page is not found");
    },
})
.use(upload.single('image'))
.post(async (req, res) => {

    // validate the incoming data

    const altText = req.body.altText;

    if (!altText) {
        res.status(422).json({ message:'missing alt text' });
        return;
    }

    const url = "./public/uploads/" + req.file.filename;

    if (!url) {
        res.status(422).json({ message:'missing file' });
        return;
    }

    // validate the file type

    // array of allowed files
    const array_of_allowed_files = ['png', 'jpeg', 'jpg', 'gif'];

   // get the extension of the uploaded file
    const file_extension = url.slice(
        ((url.lastIndexOf('.') - 1) >>> 0) + 2
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

    const imageCollection = db.collection('images');

    try {

        res.status(201).json({ body: req.body, file: req.file });

        await imageCollection.insertOne({
            image: url,
            altText: altText,
            timestamp: new Date(),

        });

    } catch (error) {

            client.close();
            res.status(500).json({ message: 'failed to insert user into the database'});
            return;

    }

    client.close();
    
});

export default handler;