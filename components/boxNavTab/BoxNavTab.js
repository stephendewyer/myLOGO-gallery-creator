import styles from './BoxNavTab.module.css';

const BoxNavTab = (props) => {
    return (
        <button 
            className={props.pageIsActive ? styles.boxButtonActive : styles.boxButton}
        >
            {props.children}
        </button>
    );
};

export default BoxNavTab;