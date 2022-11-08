import styles from './Footer.module.css';

const Footer = () => {
    const today = new Date();
    const year = today.getFullYear();
    return (
        <div className={styles.footer}>
            <div className={styles.footer_info} >
                developed by stephen garrett dewyer | {year}
            </div>
        </div>
    )

}

export default Footer;