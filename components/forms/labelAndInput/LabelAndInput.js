import styles from './LabelAndInput.module.css';

const LabelAndInput = (props) => {
    return (
        <div className={styles.labelAndInput}>
            {props.children}
        </div>
    )    
}

export default LabelAndInput;