import styles from './Footer.module.css';
import Link from 'next/link'

const Footer = () => {
    const today = new Date();
    const year = today.getFullYear();
    return (
        <div className={styles.footer}>
            <div className={styles.footer_info} >
                developed by <Link href="https://www.stephendewyerwebwork.com" passHref target="_blank">stephen garrett dewyer</Link> | {year}
            </div>
        </div>
    )

}

export default Footer;