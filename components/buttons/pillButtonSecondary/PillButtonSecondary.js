import classes from './PillButtonSecondary.module.css';

const PillButtonSecondary = (props) => {
    return (
        <button className={classes.pill_button}>
            {props.children}
        </button>
    );
};

export default PillButtonSecondary;