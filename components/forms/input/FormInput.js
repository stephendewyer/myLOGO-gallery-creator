import styles from './FormInput.module.css';
import { forwardRef } from 'react';

const FormInput = (props, ref) => {

    return (
        <input 
            className={(!props.isvalid) ? styles.invalidInput : styles.input } 
            type={props.type}
            id={props.id} 
            ref={ref} 
            onChange={props.onChange} 
            onBlur={props.onBlur}
            defaultValue={props.defaultValue}
        />
    )
};

export default forwardRef(FormInput);