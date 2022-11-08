import BoxButton from '../../boxNavTab/BoxNavTab';
import styles from './MainNavigation.module.css';
import MyLink from '../../../public/util/MyLink';
import { useSession, signOut } from "next-auth/react";
import { useRouter } from 'next/router';
import Link from 'next/link';

const MainNavigation = () => {

    // if session does not exist, redirect user to index page

    const { data: session } = useSession()

    function logoutHandler() {
        signOut({redirect: false});
    }

    let createPageIsActive = false;

    let indexPageIsActive = false;

    let authUserPageIsActive = false;

    let editGalleryPageIsActive = false;

    const router = useRouter();

    const pagePath = router.pathname;

    if (pagePath === "/createAccount") {
        createPageIsActive = true;
    };

    if (pagePath === "/login") {
        indexPageIsActive = true;
    };

    if (pagePath === "/authUser") {
        authUserPageIsActive = true;
    };

    if (pagePath === "/authUser/editLogoGallery") {
        editGalleryPageIsActive = true;
    };

    return (
        <nav 
            className={styles.mainNavigation}
            role="navigation"
        >
            <div className={styles.indexTab}>
                <h1 className="heading01">
                    <Link href="/" aria-label="link to index page">
                        myLOGO gallery creator
                    </Link>
                </h1>
            </div>
            {!session && <div 
                className={styles.navTabs}
                aria-hidden={(session) ? "true" : "false"}
            >
                <MyLink 
                    href="/createAccount" 
                    passHref 
                    aria-label="link to create account page"
                >
                    <BoxButton pageIsActive={createPageIsActive}>
                        create
                    </BoxButton>
                </MyLink>
                <MyLink 
                    href="/login" 
                    passHref 
                    aria-label="link to login"
                >
                    <BoxButton pageIsActive={indexPageIsActive}>
                        login
                    </BoxButton>
                </MyLink>
            </div>}
            {session && <div 
                className={styles.navTabs}
                aria-hidden={(!session) ? "true" : "false"}
            >
                {editGalleryPageIsActive && 
                
                    <MyLink 
                        href="/authUser" 
                        passHref 
                        aria-label="link to gallery page"
                    >
                        <BoxButton pageIsActive={createPageIsActive}>
                            show gallery
                        </BoxButton>
                    </MyLink>
                }
                {authUserPageIsActive && 
                    <MyLink 
                        href="/authUser/editLogoGallery" 
                        passHref 
                        aria-label="link to edit logo gallery page"
                    >
                        <BoxButton pageIsActive={createPageIsActive}>
                            edit gallery
                        </BoxButton>
                    </MyLink>
                }
                <MyLink 
                    href="/login" 
                    passHref 
                    aria-label="link to logout"
                    onClick={logoutHandler}
                >
                    <BoxButton 
                        pageIsActive={indexPageIsActive}
                    >
                        logout
                    </BoxButton>
                </MyLink>
            </div>}
        </nav>
    )
}

export default MainNavigation;