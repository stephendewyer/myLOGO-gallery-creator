import classes from './BoxButton.module.css';

const BoxButton = (props) => {
    return (
        <button className={classes.box_button}>
            {props.children}
        </button>
    );
};

export default BoxButton;