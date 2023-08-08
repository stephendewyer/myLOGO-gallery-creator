import classes from './PillButtonSecondary.module.css';

const PillButtonSecondary = (props) => {
    return (
        <div className={classes.pill_button}>
            {props.children}
        </div>
    );
};

export default PillButtonSecondary;