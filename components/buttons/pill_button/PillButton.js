import classes from './PillButton.module.css';

const PillButton = (props) => {
    return (
        <button className={classes.pill_button}>
            {props.children}
        </button>
    );
};

export default PillButton;