import { Fragment, useState, useEffect } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import { v4 as uuidv4 } from 'uuid';
import styles from '../styles/Index.module.css';
import image1src from '../public/images/logos/logo01.jpg';
import image2src from '../public/images/logos/logo02.png';
import image3src from '../public/images/logos/logo03.jpg';
import image4src from '../public/images/logos/logo04.png';
import image5src from '../public/images/logos/logo05.png';
import image6src from '../public/images/logos/logo06.png';
import image7src from '../public/images/logos/logo07.png';
import image8src from '../public/images/logos/logo08.jpg';
import image9src from '../public/images/logos/logo09.png';
import image10src from '../public/images/logos/logo10.jpg';
import image11src from '../public/images/logos/logo11.png';
import image12src from '../public/images/logos/logo12.jpg';
import image13src from '../public/images/logos/logo13.jpg';
import image14src from '../public/images/logos/logo14.jpeg';
import image15src from '../public/images/logos/logo15.jpg';

export default function Index() {

  // load the image data

  const images = [
    {
      imageSrc: image1src,
      id: uuidv4(),
    },
    {
      imageSrc: image2src,
      id: uuidv4(),
    },
    {
      imageSrc: image3src,
      id: uuidv4(),
    },
    {
      imageSrc: image4src,
      id: uuidv4(),
    },
    {
      imageSrc: image5src,
      id: uuidv4(),
    },
    {
      imageSrc: image6src,
      id: uuidv4(),
    },
    {
      imageSrc: image7src,
      id: uuidv4(),
    },
    {
      imageSrc: image8src,
      id: uuidv4(),
    },
    {
      imageSrc: image9src,
      id: uuidv4(),
    },
    {
      imageSrc: image10src,
      id: uuidv4(),
    },
    {
      imageSrc: image11src,
      id: uuidv4(),
    },
    {
      imageSrc: image12src,
      id: uuidv4(),
    },
    {
      imageSrc: image13src,
      id: uuidv4(),
    },
    {
      imageSrc: image14src,
      id: uuidv4(),
    },
    {
      imageSrc: image15src,
      id: uuidv4(),
    },
  ]

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

  return (
    <Fragment>
      <Head>
        <title>myLOGO gallery creator</title>
        <meta name="description" content="an image gallery that randomly rotates images" />
        <meta property="og:image" content="https://my-logo-gallery-creator.vercel.app/images/index_screengrab.JPG" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="container">
        <div className={styles.gridContainer}>
          {cycle.map((img) => {
            const imgSrc = img.imageSrc;
            const id = img.id;
            return (
              <div
                key={id}
                className={styles.gridItem}
              >
                <Image 
                  src={imgSrc} 
                  className="image"
                  alt="logo" 
                  priority
                />
              </div>
            )
          })}
          </div>
      </div>
    </Fragment>
  )
}
