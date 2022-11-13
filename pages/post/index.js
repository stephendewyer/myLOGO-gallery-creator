import Head from 'next/head';
import React, { useState, useRef, useEffect } from 'react';
// import { signIn, getSession } from 'next-auth/client';
import FlashMessage from '../../components/flash_message/FlashMessage';
import InputErrorMessage from '../../components/forms/inputErrorMessage/InputErrorMessage';
import InputFormSection from '../../components/forms/inputFormSection/InputFormSection';
import LabelAndInput from '../../components/forms/labelAndInput/LabelAndInput';
import FormInput from '../../components/forms/input/FormInput';
import PillButton from '../../components/buttons/pill_button/PillButton';
import styles from './style.module.css';

async function createPost( body ) {
    const response = await fetch('/api/create', {
        method: "POST",
        body,
    });
    const data = await response.json();

    console.log(data);

    if (!response.ok) {
        throw new Error(data.message || 'Something went wrong!');
    }
}

const PostCreatePage = () => {

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
        if ( altTextRef.current.value !== '' && !enteredAltTextIsTouched ) {
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
        // log the file in the console
        console.log(file);
        //
        const fileReader = new FileReader();
        if (file && file.type.match('image.*')) {
            fileReader.onload = function(event) {
                console.log(event.target.result);
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

        let altText = altTextRef.current.value;

        event.preventDefault();

        // optional: add client-side validation
        
        setEnteredAltTextIsTouched(true);
        setEnteredImageIsTouched(true);

        setRequestStatus('pending');

        const body = new FormData();

        body.append('altText', altText);
        body.append('image', imageInput);

        try {
            await createPost(
                body
            );
            setRequestStatus('success');
            setImage(null);
            imageRef.current.value = null;
            altTextRef.current.value = "";
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
        <div className="container">
            <h2 className="heading02">add an image</h2>
            <form onSubmit={handleFormData} className={styles.form}>
                <InputFormSection>
                    <LabelAndInput>
                        <label className={styles.label} htmlFor='email' >
                            alt text:
                        </label>
                        <FormInput
                            isvalid={enteredAltTextIsValid} 
                            type="text" 
                            id="floatingInput"
                            placeholder="enter alternative text"
                            ref={altTextRef}  
                            onChange={altTextChangeHandler} 
                            onBlur={altTextBlurHandler}
                        />
                    </LabelAndInput>
                    {altTextErrorMessage}
                </InputFormSection>
                <div className={styles.fileFieldContainer}>
                    <input 
                        isvalid={enteredImageIsValid} 
                        type="file" 
                        id="floatingInput"
                        className={styles.inputfile}
                        placeholder="enter file"
                        ref={imageRef}  
                        onChange={imageChangeHandler} 
                    />
                </div>
                {imageErrorMessage}
                <div>
                    {image && <img src={image} style={{ width: '100px'}} />}
                </div>
                <div className={styles.form_buttons} >
                    <PillButton type="submit" >
                        add image
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
    )
}

export default PostCreatePage;