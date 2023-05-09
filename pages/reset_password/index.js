import Head from 'next/head';
import FlashMessage from '../../components/flash_message/FlashMessage';
import React, { Fragment, useRef, useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import InputErrorMessage from '../../components/forms/inputErrorMessage/InputErrorMessage';
import InputFormSection from '../../components/forms/inputFormSection/InputFormSection';
import LabelAndInput from '../../components/forms/labelAndInput/LabelAndInput';
import FormInput from '../../components/forms/input/FormInput';
import MyLink from '../../public/util/MyLink';
import PillButton from '../../components/buttons/pill_button/PillButton';
import PillButtonSecondary from '../../components/buttons/pillButtonSecondary/PillButtonSecondary';
import classes from './ResetPassword.module.css';

async function changePassword(email) {

    const response = await fetch('/api/auth/ResetPassword', {
        method: 'PATCH',
        body: JSON.stringify(email),
        headers: {
            'Content-Type': 'application/json',
        }
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || 'something went wrong');
    }

}

const ResetPassword = (props) => {

    const router = useRouter();
    const emailRef = useRef();

    const [requestStatus, setRequestStatus] = useState(); // 'pending', 'success', 'error'
    const [requestError, setRequestError] = useState();

    useEffect(() => {
        if (requestStatus === 'success' || requestStatus === 'error') {
          const timer = setTimeout(() => {
            setRequestStatus(null);
            setRequestError(null);
          }, 6000);
    
          return () => clearTimeout(timer);
        }
    }, [requestStatus]);

    // before submit

    // email validation state
    const [enteredEmailIsValid, setEnteredEmailIsValid] = useState(true);
    // email validation state 2
    const [enteredEmailHasAtSymbol, setEnteredEmailHasAtSymbol] = useState(true);

    // email touched state
    const [enteredEmailIsTouched, setEnteredEmailIsTouched] = useState(true);

    const emailInputChangeHandler = (event) => {
        if ( emailRef.current.value !== '' && emailRef.current.value.includes('@') ) {
            setEnteredEmailIsValid(true);
            setEnteredEmailHasAtSymbol(true);
        }
        if ( emailRef.current.value !== '' && !emailRef.current.value.includes('@') ) {
            setEnteredEmailIsValid(true);
        }
    };

    const emailInputBlurHandler = (event) => {
        setEnteredEmailIsTouched(true);
        if (emailRef.current.value === '') {
            setEnteredEmailIsValid(false);
            setEnteredEmailHasAtSymbol(true);
        }
        if (emailRef.current.value !== '' && !emailRef.current.value.includes('@') ) {
            setEnteredEmailIsValid(false);
            setEnteredEmailHasAtSymbol(false);
        }
    }

    // after submit
  
    async function submitHandler(event) {
        event.preventDefault();
        
        const enteredEmail = emailRef.current.value;

        // optional: Add validation

        setEnteredEmailIsTouched(true);

        setRequestStatus('pending');

        try {
            await changePassword({
                email: enteredEmail
            });
            setRequestStatus('success');
            router.replace('/reset_password');
        } catch (error) {
            if (enteredEmail === '') {
                setEnteredEmailIsValid(false);
            }
            if (enteredEmail !== '' && !enteredEmail.includes('@')) {
                setEnteredEmailHasAtSymbol(false);
            }
            setRequestError(error.message);
            setRequestStatus('error');
        }
    }

    let notification;

    if (requestStatus === 'pending') {
        notification = {
            status: 'pending',
            title: 'verifying if email exists',
            message: 'checking our records for submitted email',
        };
    }

    if (requestStatus === 'success') {
        notification = {
            status: 'success',
            title: 'we sent you an email',
            message: 'please check your email for a password update link',
        };
    }

    if (requestStatus === 'error') {
        notification = {
            status: 'error',
            title: 'failed to send an email with a password update link',
            message: requestError,
        };
    }

    let emailErrorMessage = '';

    if (!enteredEmailIsValid) {
        emailErrorMessage = (
            <InputErrorMessage>
                email required
            </InputErrorMessage>
        )
    }

    if (!enteredEmailIsValid && !enteredEmailHasAtSymbol) {
        emailErrorMessage = (
            <InputErrorMessage>
                    missing an @ symbol in email address
            </InputErrorMessage>
        )
    }

    return (
        <Fragment>

            <Head>
                <title>myLOGO gallery creator | reset password</title>
                <meta property="og:image" content="https://my-logo-gallery-creator.vercel.app/images/index_screengrab.JPG" />
                <meta property="og:url" content="https://my-logo-gallery-creator.vercel.app/reset_password" />
                <meta name="description" content="reset password" />
                <meta name="robots" content="index, follow" />
            </Head>

            <div className="page">
                <h1 className="heading02">
                    reset password
                </h1>
                <form className={classes.form} onSubmit={submitHandler} noValidate >
                    <InputFormSection>
                        <LabelAndInput>
                            <label className={classes.label} htmlFor='email' >
                                email:
                            </label>
                            <FormInput
                                isvalid={enteredEmailIsValid} 
                                type='email' 
                                id="email" 
                                ref={emailRef} 
                                onChange={emailInputChangeHandler} 
                                onBlur={emailInputBlurHandler}
                            />
                        </LabelAndInput>
                        {emailErrorMessage}
                    </InputFormSection>
                    <div className={classes.form_buttons} >
                        <MyLink href={'/'} passHref aria-label="link to index page">
                            <PillButtonSecondary>
                                cancel
                            </PillButtonSecondary>
                        </MyLink>
                        <PillButton type='submit' >
                            send email
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
        </Fragment>
    )
    
}

export default ResetPassword;