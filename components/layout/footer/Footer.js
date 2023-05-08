import styles from './Footer.module.css';
import Link from 'next/link'

const Footer = () => {
    const today = new Date();
    const year = today.getFullYear();
    return (
        <footer className={styles.footer}>
            <div className={styles.footer_info} >
                <Link href="https://www.stephendewyerwebwork.com" passHref target="_blank">stephen garrett dewyer | {year}</Link> 
            </div>
        </footer>
    )

}

export default Footer;