import styles from './InputErrorMessage.module.css';
import Image from 'next/image';
import errorIcon from '../../../public/images/icons/error_icon.svg';

const InputErrorMessage = (props) => {
    return (
        <div className={styles.inputErrorMessage}>
            <p className={styles.inputErrorParagraph}>
                {props.children}
            </p> 
            <div className={styles.inputErrorIcon}>
                <Image 
                    src={errorIcon} 
                    className="image"
                    alt="error icon"
                    priority
                />
            </div>
        </div>
    )
}

export default InputErrorMessage;