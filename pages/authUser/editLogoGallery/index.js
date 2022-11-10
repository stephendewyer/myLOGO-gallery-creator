import Head from 'next/head';
import React, { Fragment, useState, useRef, useEffect } from 'react';
import styles from './EditLogoGallery.module.css';
import { getSession } from "next-auth/react";
import { connectToDatabase } from '../../../library/db';
import { useRouter } from 'next/router';
import DeleteButton from '../../../components/buttons/deleteButton/DeleteButton';
import FlashMessage from '../../../components/flash_message/FlashMessage';
import InputErrorMessage from '../../../components/forms/inputErrorMessage/InputErrorMessage';
import InputFormSection from '../../../components/forms/inputFormSection/InputFormSection';
import LabelAndInput from '../../../components/forms/labelAndInput/LabelAndInput';
import FormInput from '../../../components/forms/input/FormInput';
import PillButton from '../../../components/buttons/pill_button/PillButton';


async function createPost( user_email, uploadedImageURL, altText ) {
  const response = await fetch('/api/fileUpload', {
    method: "POST",
    body: JSON.stringify({ user_email, uploadedImageURL, altText }),
      headers: {
        'Content-Type': 'application/json',
      },
  });
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Something went wrong!');
  }
}

const EditLogoGallery = ({userImages, user}) => {

  const router = useRouter();

  const user_email = user.email;

  const userName = user.username;

  // function to delete logos using an API
  async function deleteIconHandler(id) {
    const response = await fetch('/api/deleteImage', {
      method: 'DELETE',
      body: JSON.stringify({ user_email, id }),
      headers: {
        'Content-Type': 'application/json',
      },
    })
    const data = await response.json();

    console.log(data);

    router.replace(router.asPath);

  }

  // handle the userImages data

  let images = [];
  for (let i = 0; i < userImages.gallery_images.length; i++) {
    images.push(
      {
        imageSrc: userImages.gallery_images[i].image,
        id: userImages.gallery_images[i].id,
      }
      
    )
  };

  // get the number of user images

  let userImagesAmount = userImages.gallery_images.length;

  // handle the file upload

  const altTextRef = useRef();
  const imageRef = useRef();

  // set the flash message state
  
  const [requestStatus, setRequestStatus] = useState();  // 'pending', 'success', 'error'
  const [requestError, setRequestError] = useState();

  useEffect(() => {
    if (requestStatus === 'pending' || requestStatus === 'error' || requestStatus === 'success') {
      const timer = setTimeout(() => {
        setRequestStatus(null);
        setRequestError(null);
      }, 6000);

      return () => clearTimeout(timer);

    }
  }, [requestStatus]);

  // before submit

  // alt text validation state
  const [enteredAltTextIsValid, setEnteredAltTextIsValid] = useState(true);

  // image validation state
  const [enteredImageIsValid, setEnteredImageIsValid] = useState(true);
  const [enteredImageIsValidType, setEnteredImageIsValidType] = useState(true);

  // alt text touched state
  const [enteredAltTextIsTouched, setEnteredAltTextIsTouched] = useState(true);

  // image touched state
  const [enteredImageIsTouched, setEnteredImageIsTouched] = useState(true);

  const altTextChangeHandler = (event) => {
    if ( altTextRef.current.value !== '' && enteredAltTextIsTouched ) {
      setEnteredAltTextIsValid(true);
    }
  };

  const altTextBlurHandler = (event) => {
    setEnteredAltTextIsTouched(true);
    if (altTextRef.current.value === '') {
      setEnteredAltTextIsValid(false);
    }
  }

  // set the states for image preview

  const [image, setImage] = useState(null);
  const [imageInput, setImageInput] = useState(null); 

  const imageChangeHandler = (event) => {

    // get the file
    const file = event.target.files[0];
    setImageInput(file);
    const fileReader = new FileReader();
    if (file && file.type.match('image.*')) {
      fileReader.onload = function(event) {
          setImage(event.target.result);
      }
      fileReader.readAsDataURL(file);
    }

    if (imageRef.current.value === '' && !enteredImageIsTouched) {
      setEnteredImageIsValid(false);
      setEnteredImageIsValidType(true);
      setImage(null);
    }
    if (!(file && file.type.match('image.*')) && (imageRef.current.value !== '')) {
      setEnteredImageIsValid(true);
      setEnteredImageIsValidType(false);
      setImage(null);
    }
    if ((file && file.type.match('image.*')) && (imageRef.current.value !== '')) {
      setEnteredImageIsValid(true);
      setEnteredImageIsValidType(true);
    } 
  }

  async function handleFormData(event) {

    event.preventDefault();

    let uploadedImageURL = null;

    let altText = altTextRef.current.value;

    // optional: add client-side validation
    
    setEnteredAltTextIsTouched(true);
    setEnteredImageIsTouched(true);

    setRequestStatus('pending');

    // get the file from the form

    const form = event.currentTarget;
    const fileInput = Array.from(form.elements).find(({name}) => name === 'file');

    // console.log(fileInput, altText);

    const formData = new FormData();

    for (const fileToUpload of fileInput.files) {
      formData.append('file', fileToUpload);
    };

    // upload the file to Cloudinary and get image URL

    formData.append('upload_preset', 'my-uploads');

    const dataCloudinary = await fetch('https://api.cloudinary.com/v1_1/dsztjf1mf/image/upload', {
      method: 'POST',
      body: formData,
    }).then(response => response.json());

    // load the uploaded file URL in a variable

    uploadedImageURL = dataCloudinary.secure_url;

    console.log(uploadedImageURL);

    // send the image URL to an API to save in MongoDB

    try {
      await createPost(
        user_email,
        uploadedImageURL, 
        altText,
      );
      setRequestStatus('success');
      setImage(null);
      imageRef.current.value = null;
      altTextRef.current.value = "";
      router.replace(router.asPath);
    } catch (error) {
      if (altText === '') {
          setEnteredAltTextIsValid(false);
      }
      if (imageInput === '') {
          setEnteredImageIsValid(false);
      }
      setRequestError(error.message);
      setRequestStatus('error');
    }

  }

  let notification;

  if (requestStatus === 'pending') {
    notification = {
      status: 'pending',
      title: 'validating image',
      message: 'please wait a moment while we verify your image data',
    };
  }

  if (requestStatus === 'success') {
    notification = {
      status: 'success',
      title: 'image upload successful',
      message: 'your image has been added to your gallery',
    };
  }

  if (requestStatus === 'error') {
    notification = {
      status: 'error',
      title: 'failed to upload image',
      message: requestError,
    };
  }

  let altTextErrorMessage = '';

  if (!enteredAltTextIsValid) {
    altTextErrorMessage = (
      <InputErrorMessage>
          please enter alt text
      </InputErrorMessage>
    )
  }

  let imageErrorMessage = '';

  if (!enteredImageIsValidType) {
    imageErrorMessage = (
      <InputErrorMessage>
          please select an image file
      </InputErrorMessage>
    )
  }

  if (!enteredImageIsValid) {
    imageErrorMessage = (
      <InputErrorMessage>
          please select an image to upload
      </InputErrorMessage>
    )
  }

  return (
    <Fragment>
      <Head>
        <title>myLOGO gallery creator | my gallery</title>
        <meta name="description" content="my gallery of logos" />
        <meta property="og:image" content="https://my-logo-gallery-creator.vercel.app/images/index_screengrab.JPG" />
        <meta property="og:url" content="https://my-logo-gallery-creator.vercel.app/AuthUser/editLogoGallery" />
      </Head>
      <div className="container">
        <h2 className="heading02">
            {`${userName}'s logo gallery editor`}
        </h2>
        <div className={styles.editor}>
          <div className={styles.controlPanel}>
            <h2 className="heading03">add an image</h2>
            <form onSubmit={handleFormData} className={styles.form}>
                <div className={styles.logoPreview}>
                    {image && 
                      <picture>
                        <source 
                          srcSet={image} 
                          type="image/webp" 
                        />
                        <img 
                          src={image} 
                          style={{ width: '100%'}} 
                        />
                      </picture>}
                </div>
                <div className={styles.fileFieldContainer}>
                  <input 
                      type="file" 
                      id="floatingInput"
                      name="file"
                      className={styles.inputfile}
                      placeholder="enter file"
                      ref={imageRef}  
                      onChange={imageChangeHandler} 
                  />
                </div>
                {imageErrorMessage}
                <InputFormSection>
                    <LabelAndInput>
                        <label className={styles.label} htmlFor='email' >
                            alt text:
                        </label>
                        <FormInput
                            isvalid={enteredAltTextIsValid} 
                            type="text" 
                            id="floatingInput"
                            name="alt text"
                            placeholder="enter alternative text"
                            ref={altTextRef}  
                            onChange={altTextChangeHandler} 
                            onBlur={altTextBlurHandler}
                        />
                    </LabelAndInput>
                    {altTextErrorMessage}
                </InputFormSection>
                <div className={styles.form_buttons} >
                    <PillButton type="submit" >
                      add
                    </PillButton>
                </div>
            </form>
            {notification && (
                <FlashMessage
                    status={notification.status}
                    title={notification.title}
                    message={notification.message}
                />
              )}    
            </div>
          <div className={styles.gridContainer}>
          {images.map((img) => {
              const imgSrc = img.imageSrc;
              const id = img.id;
              return (
                  <div
                      key={id}
                      className={styles.gridItem}
                  >
                  {(id !== null) &&
                    <div className={styles.logoContainer}>
                      <div 
                        className={styles.deleteIcon}
                      >
                        {( userImagesAmount > 15) ?
                          <DeleteButton clicked={() => {
                            deleteIconHandler(id)
                            }
                          }/>
                          :
                          ""
                        }
                      </div>
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
                    </div>
                  }
                </div>
              )
            })}
          </div>
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

export default EditLogoGallery;