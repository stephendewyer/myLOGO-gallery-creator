import Head from 'next/head';
import React, { Fragment, useState, useEffect } from 'react';
import styles from './AuthUser.module.css';
import { connectToDatabase } from '../../library/db';
import { getSession } from "next-auth/react";
import { v4 as uuidv4 } from 'uuid';


const AuthUser = ({userImages, user}) => {

  let images = [];
  for (let i = 0; i < userImages.gallery_images.length; i++) {
    images.push(
      {
        imageSrc: userImages.gallery_images[i].image,
        id: uuidv4(),
      }
      
    )
  };

  const cycle01 = images.slice(0, 12);

  // if cycle02 is initialized

  const cycle02images = [...cycle01];
  // replace cycle01images 0, 1, 5 with images 12, 13, 14
  cycle02images.splice(0, 1, {...images[12]});
  cycle02images.splice(1, 1, {...images[13]});
  cycle02images.splice(5, 1, {...images[14]});
  const cycle02 = cycle02images;

  // if cycle03 is initialized
  // replace cycle02images 3, 6, 8 with images 0, 1, 5
  const cycle03images = [...cycle02];
  cycle03images.splice(3, 1, {...images[0]});
  cycle03images.splice(6, 1, {...images[1]});
  cycle03images.splice(8, 1, {...images[5]});
  const cycle03 = cycle03images;

  // if cycle04 is initialized
  // replace cycle03images 1, 7, 10 with images 3, 6, 8
  const cycle04images = [...cycle03];
  cycle04images.splice(1, 1, {...images[3]});
  cycle04images.splice(7, 1, {...images[6]});
  cycle04images.splice(10, 1, {...images[8]});
  const cycle04 = cycle04images;

  // if cycle05 is initialized
  // replace cycle04images 2, 4, 9 with images 2, 4, 7
  const cycle05images = [...cycle04];
  cycle05images.splice(2, 1, {...images[7]});
  cycle05images.splice(4, 1, {...images[2]});
  cycle05images.splice(9, 1, {...images[4]});
  const cycle05 = cycle05images;  

  // if cycle06 is initialized
  // replace cycle05images 9, 10, 11 with images 1, 7, 10
  const cycle06images = [...cycle05];
  cycle06images.splice(0, 1, {...images[11]});
  cycle06images.splice(1, 1, {...images[10]});
  cycle06images.splice(11, 1, {...images[9]});
  const cycle06 = cycle06images;    

  const imageCycles = [
    {
      // if cycle01 is initialized
      selectedImages: cycle01,
      id: 0,
    },
    {
      // if cycle02 is initialized
      selectedImages: cycle02,
      id: 1,
    },
    {
      // if cycle03 is initialized
      selectedImages: cycle03,
      id: 2,
    },
    {
      // if cycle04 is initialized
      selectedImages: cycle04,
      id: 3,
    },
    {
      // if cycle05 is initialized
      selectedImages: cycle05,
      id: 4,
    },
    {
      // if cycle06 is initialized
      selectedImages: cycle06,
      id: 5,
    },
  ];

  // set the cycle states 

  const [cycleIndex, setCycleIndex] = useState(0);

  const [cycle, setCycle] = useState(imageCycles[0].selectedImages);

  useEffect(() => {
    const id = setTimeout(
      () => setCycleIndex((cycleIndex + 1) % imageCycles.length),
      3000
    );

    setCycle(imageCycles[cycleIndex].selectedImages);
    return () => {
      clearInterval(id); // removes React warning when gets unmounted
    };
  }, [cycleIndex]); 

  const userName = user.username;

  return (
    <Fragment>
      <Head>
        <title>myLOGO gallery creator | my gallery</title>
        <meta name="description" content="my gallery of logos" />
        <meta property="og:image" content="https://my-logo-gallery-creator.vercel.app/images/index_screengrab.JPG" />
        <meta property="og:url" content="https://my-logo-gallery-creator.vercel.app/AuthUser" />
      </Head>
      <div className="container">
        <h2 className="heading02">
            {`${userName}'s logo gallery`}
        </h2>
        <div className={styles.gridContainer}>
          {cycle.map((img) => {
            const imgSrc = img.imageSrc;
            const id = img.id;
            return (
              <div
                key={id}
                className={styles.gridItem}
              >
                {(id !== null) &&
                  <picture>
                    <source 
                        srcSet={imgSrc} 
                        type="image/webp" 
                    />
                    <img 
                        src={imgSrc}
                        className="image"
                        alt="logo" 
                    />
                  </picture>
                }
              </div>
            )
          })}
          </div>
      </div>
    </Fragment>
  )
}

// begin redirect for unauthenticated users

export async function getServerSideProps(context) {

    const session = await getSession({ req: context.req });

    if (!session) {
        return {
            redirect: {
                destination: '/login',
                permanent: false,
            }
        };
    }

    // end redirect for unauthenticated users

    // begin GET authenticated user information

    let client;

    try {
        client = await connectToDatabase();
    } catch (error) {
        console.log('Connecting to the database failed!');
        return;
    }

    const db = client.db();

    const usersCollection = db.collection('users'); 
        
    const userEmail = session.user.email;

    const user = await usersCollection.findOne({ email: userEmail });  

    if (!user) {
        console.log('User not found.');
        client.close();
        return;
    }

    const userGalleryImages = client.db().collection('user_gallery_images');

    // find the gallery images for the user in the user_gallery_images collection

    const userGallery = await userGalleryImages.findOne({ email: userEmail });

    return {
        props: { session,
            user: JSON.parse(JSON.stringify(user)),
            userImages: JSON.parse(JSON.stringify(userGallery)),
        },
    };

    // end GET authenticated user gallery images
}


export default AuthUser;