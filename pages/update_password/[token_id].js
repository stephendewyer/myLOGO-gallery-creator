import Head from 'next/head';
import React, { Fragment, useRef, useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { connectToDatabase } from '../../library/db';
import FlashMessage from '../../components/flash_message/FlashMessage';
import InputErrorMessage from '../../components/forms/inputErrorMessage/InputErrorMessage';
import InputFormSection from '../../components/forms/inputFormSection/InputFormSection';
import LabelAndInput from '../../components/forms/labelAndInput/LabelAndInput';
import FormInput from '../../components/forms/input/FormInput';
import MyLink from '../../public/util/MyLink';
import PillButton from '../../components/buttons/pill_button/PillButton';
import PillButtonSecondary from '../../components/buttons/pillButtonSecondary/PillButtonSecondary';
import classes from './UpdatePassword.module.css';

async function updatePassword(newPassword, userEmail) {

    const response = await fetch('/api/auth/UpdatePassword', {

        method: 'PATCH',
        body: JSON.stringify(newPassword, userEmail),
        headers: {
            'Content-Type': 'application/json',
        }
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || 'something went wrong');
    }

}

const UpdatePassword = (validatedUserEmail, paramsID) => {

    console.log(validatedUserEmail);

    const router = useRouter();

    const passwordInputRef = useRef();

    // set the flash message state
    
    const [requestStatus, setRequestStatus] = useState();  // 'pending', 'success', 'error'
    const [requestError, setRequestError] = useState();

    useEffect(() => {
        if (requestStatus === 'pending' || requestStatus === 'error') {
            const timer = setTimeout(() => {
                setRequestStatus(null);
                setRequestError(null);
            }, 6000);

            return () => clearTimeout(timer);

        }
    }, [requestStatus]);

    // before submit

    // email validation state
    const [enteredPasswordIsValid, setEnteredPasswordIsValid] = useState(true);

    // email touched state
    const [enteredPasswordIsTouched, setEnteredPasswordIsTouched] = useState(true);

    const passwordInputChangeHandler = (event) => {
        if (passwordInputRef.current.value !== '') {
            setEnteredPasswordIsValid(true);
        }
    };

    const passwordInputBlurHandler = (event) => {
        setEnteredPasswordIsTouched(true);
        if (passwordInputRef.current.value === '') {
            setEnteredPasswordIsValid(false);
        }
    }

    // after submit
  
    async function submitHandler(event) {
        event.preventDefault();
        
        const enteredPassword = passwordInputRef.current.value;
        const validUserEmail = validatedUserEmail;

        // optional: Add validation

        setEnteredPasswordIsTouched(true);

        setRequestStatus('pending');

        try {
            await updatePassword(
            { 
                newPassword: enteredPassword, 
                userEmail: validUserEmail,

            });
            setRequestStatus('success');
            router.replace('/login');
        } catch (error) {
            if (enteredPassword === '') {
                setEnteredPasswordIsValid(false);
            }
            setRequestError(error.message);
            setRequestStatus('error');
        }
    }
      
    let notification;

    if (requestStatus === 'pending') {
        notification = {
          status: 'pending',
          title: 'validating password',
          message: 'please wait a moment while we validate your new password',
        };
    }
    
    if (requestStatus === 'success') {
        notification = {
          status: 'success',
          title: 'new password created',
          message: 'your password has been updated',
        };
    }
    
    if (requestStatus === 'error') {
        notification = {
          status: 'error',
          title: 'password failed to update',
          message: requestError,
        };
    }

    return (
        <Fragment>
            <Head>
                <title>myLOGO gallery creator - update password</title>
                <meta name="description" content="update password" />
                <meta property="og:image" content="https://my-logo-gallery-creator.vercel.app/images/index_screengrab.JPG" />
                <meta property="og:url" content={`https://my-logo-gallery-creator.vercel.app/update_password/${paramsID}`} />
            </Head>
            <div className="page">
                <h1 className="heading02">
                    update password
                </h1>
                <form className={classes.form} onSubmit={submitHandler} noValidate >
                    <InputFormSection>
                        <LabelAndInput>
                            <label className={classes.label} htmlFor='password' >
                                password:
                            </label>
                            <FormInput
                                isvalid={enteredPasswordIsValid} 
                                type="password" 
                                id="password" 
                                ref={passwordInputRef}
                                onChange={passwordInputChangeHandler} 
                                onBlur={passwordInputBlurHandler} 
                            />
                        </LabelAndInput>
                        { enteredPasswordIsValid ? 
                            ""
                            : 
                            <InputErrorMessage>
                                password required
                            </InputErrorMessage>
                        }
                    </InputFormSection>
                    <div className={classes.form_buttons} >
                        <PillButton type="submit" >
                            update
                        </PillButton>
                        <MyLink href={'/'} passHref aria-label="link to index page">
                            <PillButtonSecondary>
                                cancel
                            </PillButtonSecondary>
                        </MyLink>
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
        </Fragment>
    )
}

export async function getServerSideProps(context) {

    const { params } = context;

    const paramsID = params.token_id;

    // search for a token match for paramsID in the users collection

    // begin GET authenticated user information

    let client;

    try {
        client = await connectToDatabase();
    } catch (error) {
        console.log('Connecting to the database failed!');
        return;
    }

    const db = client.db();

    const validatedUser = await db.collection('users').findOne({ resetToken :  paramsID, resetTokenExpiration: {$gt: Date.now() } });

    if (!validatedUser) {
        console.log('Invalid token.  Unable to authenticate user.');
        return {
            redirect: {
                destination: '/reset_password',
                permanent: false,
            }
        };
    }

    const validatedUserEmail = validatedUser.email;

    return {
        props:  {
            validatedUserEmail: JSON.parse(JSON.stringify(validatedUserEmail)), 
            paramsID: JSON.parse(JSON.stringify(paramsID)),
        
        },
    };


}

// end redirect for unauthenticated users

export default UpdatePassword;