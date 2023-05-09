import Head from 'next/head';
import React, { useState, useRef, Fragment, useEffect } from 'react';
import { getSession } from "next-auth/react";
import { useRouter } from 'next/router';
import FlashMessage from '../../components/flash_message/FlashMessage';
import InputErrorMessage from '../../components/forms/inputErrorMessage/InputErrorMessage';
import InputFormSection from '../../components/forms/inputFormSection/InputFormSection';
import LabelAndInput from '../../components/forms/labelAndInput/LabelAndInput';
import FormInput from '../../components/forms/input/FormInput';
import MyLink from '../../public/util/MyLink';
import PillButton from '../../components/buttons/pill_button/PillButton';
import PillButtonSecondary from '../../components/buttons/pillButtonSecondary/PillButtonSecondary';
import BoxButton from '../../components/buttons/box_button/BoxButton';
import classes from './CreateAccount.module.css';

async function createUser(username, email, password) {
    
    const response = await fetch('/api/auth/signup', {
      method: 'POST',
      body: JSON.stringify({ username, email, password }),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();

    console.log(data);

    if (!response.ok) {
        throw new Error(data.message || 'Something went wrong!');
    }

}

const CreateAccount = () => {

    const [requestStatus, setRequestStatus] = useState(); // 'pending', 'success', 'error'
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

    const usernameInputRef = useRef();
    const emailInputRef = useRef();
    const passwordInputRef = useRef();

    const router = useRouter();

    // before submit

    // username validation state
    const [enteredUsernameIsValid, setEnteredUsernameIsValid] = useState(true);
    // email validation state
    const [enteredEmailIsValid, setEnteredEmailIsValid] = useState(true);
    // email validation state 2
    const [enteredEmailHasAtSymbol, setEnteredEmailHasAtSymbol] = useState(true);
    // password validation state
    const [enteredPasswordIsValid, setEnteredPasswordIsValid] = useState(true);

    // username touched state
    const [enteredUsernameTouched, setEnteredUsernameIsTouched] = useState(true);
    // email touched state
    const [enteredEmailIsTouched, setEnteredEmailIsTouched] = useState(true);
    // password touched state
    const [enteredPasswordIsTouched, setEnteredPasswordIsTouched] = useState(true);

    const usernameInputChangeHandler = (event) => {
        if (usernameInputRef.current.value !== '') {
            setEnteredUsernameIsValid(true);
        }
    };

    const emailInputChangeHandler = (event) => {
        if ( emailInputRef.current.value !== '' && emailInputRef.current.value.includes('@') ) {
            setEnteredEmailIsValid(true);
            setEnteredEmailHasAtSymbol(true);
        }
        if ( emailInputRef.current.value !== '' && !emailInputRef.current.value.includes('@') ) {
            setEnteredEmailIsValid(true);
        }
    };

    const passwordInputChangeHandler = (event) => {
        if (passwordInputRef.current.value !== '') {
            setEnteredPasswordIsValid(true);
        }
    };

    const usernameInputBlurHandler = (event) => {
        setEnteredUsernameIsTouched(true);
        if (usernameInputRef.current.value === '') {
            setEnteredUsernameIsValid(false);
        }
    }

    const emailInputBlurHandler = (event) => {
        setEnteredEmailIsTouched(true);
        if (emailInputRef.current.value === '') {
            setEnteredEmailIsValid(false);
            setEnteredEmailHasAtSymbol(true);
        }
        if (emailInputRef.current.value !== '' && !emailInputRef.current.value.includes('@') ) {
            setEnteredEmailIsValid(false);
            setEnteredEmailHasAtSymbol(false);
        }
    }

    const passwordInputBlurHandler = (event) => {
        setEnteredPasswordIsTouched(true);
        if (passwordInputRef.current.value === '') {
            setEnteredPasswordIsValid(false);
        }
    }

    // after submit

    async function submitHandler(event) {
        event.preventDefault();

        const enteredUsername = usernameInputRef.current.value;
        const enteredEmail = emailInputRef.current.value;
        const enteredPassword = passwordInputRef.current.value;

        // optional: add validation

        setEnteredUsernameIsTouched(true);
        setEnteredEmailIsTouched(true);
        setEnteredPasswordIsTouched(true);

        setRequestStatus('pending');

        try {
            await createUser(
                enteredUsername, 
                enteredEmail, 
                enteredPassword,
            );
            setRequestStatus('success');
            router.replace('/login');
        } catch (error) {
            if (enteredUsername === '') {
                setEnteredUsernameIsValid(false);
            }
            if (enteredEmail === '') {
                setEnteredEmailIsValid(false);
            }
            if (enteredEmail !== '' && !enteredEmail.includes('@')) {
                setEnteredEmailHasAtSymbol(false);
            }
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
            title: 'verifying information',
            message: 'please wait a moment while we verify your information',
        };
    }

    if (requestStatus === 'success') {
        notification = {
            status: 'success',
            title: 'account successfully created',
            message: 'you successfully created an account with your credentials',
        };
    }

    if (requestStatus === 'error') {
        notification = {
            status: 'error',
            title: 'failed to create an account',
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
                <title>myLOGO gallery creator | create account</title>
                <meta name="description" content="registration form to myLOGO gallery creator account" />
                <meta property="og:image" content="https://my-logo-gallery-creator.vercel.app/images/index_screengrab.JPG" />
                <meta property="og:url" content="https://my-logo-gallery-creator.vercel.app/createAccount" />
                <meta name="robots" content="index, follow" />
            </Head>

            <div className="page">
               <h1 className="heading02">
                    create an account
                </h1>
                <form className={classes.form} onSubmit={submitHandler} noValidate >
                    <InputFormSection>
                        <LabelAndInput>
                            <label className={classes.label} htmlFor='nameFirst' >
                                username:
                            </label>
                            <FormInput
                                isvalid={enteredUsernameIsValid} 
                                type="text" 
                                id="username" 
                                ref={usernameInputRef} 
                                onChange={usernameInputChangeHandler} 
                                onBlur={usernameInputBlurHandler}
                            />
                        </LabelAndInput>
                        { enteredUsernameIsValid ? 
                            ""
                            : 
                            <InputErrorMessage>
                                username required
                            </InputErrorMessage>
                        }
                    </InputFormSection>
                    <InputFormSection>
                        <LabelAndInput>
                            <label className={classes.label} htmlFor='email' >
                                email:
                            </label>
                            <FormInput
                                isvalid={enteredEmailIsValid} 
                                type="email" 
                                id="email" 
                                ref={emailInputRef} 
                                onChange={emailInputChangeHandler} 
                                onBlur={emailInputBlurHandler}
                            />
                        </LabelAndInput>
                        {emailErrorMessage}
                    </InputFormSection>
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
                    <div className={classes.form_buttons}>
                        <MyLink href={'/'} passHref aria-label="link to index page">
                            <PillButtonSecondary>
                                cancel
                            </PillButtonSecondary>
                        </MyLink>
                        <PillButton type='submit'>
                            create
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
                <div className={classes.login_information}>
                    <h3 className="heading03">
                        already have an account?
                    </h3>
                    <MyLink href="/login" passHref aria-label="link to login page">
                        <BoxButton>
                            login
                        </BoxButton>
                    </MyLink>
                </div>
            </div>
        </Fragment>
    )
}

export async function getServerSideProps(context) {
    const session = await getSession({ req: context.req });
  
    if (session) {
        return {
            redirect: {
                destination: '/authUser',
                permanent: false,
            }
        };
    }
  
    return {
        props: { session },
    };
  }

export default CreateAccount;