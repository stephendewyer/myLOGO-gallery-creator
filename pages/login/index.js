import Head from 'next/head';
import React, { Fragment, useRef, useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { getSession, signIn } from "next-auth/react";
import FlashMessage from '../../components/flash_message/FlashMessage';
import InputErrorMessage from '../../components/forms/inputErrorMessage/InputErrorMessage';
import InputFormSection from '../../components/forms/inputFormSection/InputFormSection';
import LabelAndInput from '../../components/forms/labelAndInput/LabelAndInput';
import FormInput from '../../components/forms/input/FormInput';
import MyLink from '../../public/util/MyLink';
import PillButton from '../../components/buttons/pill_button/PillButton';
import PillButtonSecondary from '../../components/buttons/pillButtonSecondary/PillButtonSecondary';
import BoxButton from '../../components/buttons/box_button/BoxButton';
import classes from './Login.module.css';

const Login = () => {

    const router = useRouter();
    const emailInputRef = useRef();
    const passwordInputRef = useRef();
    
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

    // email validation state
    const [enteredEmailIsValid, setEnteredEmailIsValid] = useState(true);
    // email validation state 2
    const [enteredEmailHasAtSymbol, setEnteredEmailHasAtSymbol] = useState(true);
    // password validation state
    const [enteredPasswordIsValid, setEnteredPasswordIsValid] = useState(true);

    // email touched state
    const [enteredEmailIsTouched, setEnteredEmailIsTouched] = useState(true);
    // password touched state
    const [enteredPasswordIsTouched, setEnteredPasswordIsTouched] = useState(true);

    const emailInputChangeHandler = (event) => {
        if ( emailInputRef.current.value !== '' && emailInputRef.current.value.includes('@') ) {
            setEnteredEmailIsValid(true);
            setEnteredEmailHasAtSymbol(true);
        }
        if ( emailInputRef.current.value !== '' && !emailInputRef.current.value.includes('@') ) {
            setEnteredEmailIsValid(true);
            setEnteredEmailHasAtSymbol(false);
        }
    };

    const passwordInputChangeHandler = (event) => {
        if (passwordInputRef.current.value !== '') {
            setEnteredPasswordIsValid(true);
        }
    };

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

        const enteredEmail = emailInputRef.current.value;
        const enteredPassword = passwordInputRef.current.value;

        // optional: add client-side validation
        
        setEnteredEmailIsTouched(true);
        setEnteredPasswordIsTouched(true);

        setRequestStatus('pending');

        try {
            const response = await signIn('credentials', {
                email: enteredEmail,
                password: enteredPassword,
                redirect: false,
            });

            if (!response.error) {
                setRequestStatus('success');
                router.replace('/authUser'); 
            }

            if (response.error) {
                throw new Error(response.error || 'something went wrong!');
            }

        } catch (error) {
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
            title: 'verifying login credentials',
            message: 'please wait a moment while we verify your credentials',
        };
    }

    if (requestStatus === 'success') {
        notification = {
            status: 'success',
            title: 'login successful',
            message: 'you successfully logged into your account',
        }
    }

    if (requestStatus === 'error') {
        notification = {
            status: 'error',
            title: 'login failed',
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
                <title>myLOGO gallery creator | login</title>
                <meta name="robots" content="index, follow" />
                <meta property="og:image" content="https://my-logo-gallery-creator.vercel.app/images/index_screengrab.JPG" />
                <meta property="og:url" content="https://my-logo-gallery-creator.vercel.app/login" />
            </Head>
            <div className="container">
               <h1 className="heading02">
                    login
                </h1>
                <form className={classes.form} onSubmit={submitHandler} noValidate >
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
                    <div className={classes.form_buttons} >
                        <MyLink href={'/'} passHref aria-label="link to index page">
                            <PillButtonSecondary>
                                cancel
                            </PillButtonSecondary>
                        </MyLink>
                        <PillButton type="submit" >
                            login
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
                        don&apos;t have an account?
                    </h3>
                    <MyLink href="/createAccount" passHref aria-label="link to create account page">
                        <BoxButton>
                            create an account
                        </BoxButton>
                    </MyLink>
                </div>
                <div className={classes.login_information}>
                    <h3 className="heading03">
                        forgot your password?
                    </h3>
                    <MyLink href="/reset_password" passHref aria-label="link to reset password page">
                        <BoxButton>
                            reset password
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

export default Login;