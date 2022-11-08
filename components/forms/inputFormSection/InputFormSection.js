import styles from './InputFormSection.module.css';

const InputFormSection = (props) => {
    return (
        <div className={styles.inputFormSection}>
            {props.children}
        </div>
    )
}

export default InputFormSection;