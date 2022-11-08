import classes from './flash_message.module.css';

function FlashMessage(props) {
  const { title, message, status } = props;

  let statusClasses = '';

  if (status === 'success') {
    statusClasses = classes.success;
  }

  if (status === 'error') {
    statusClasses = classes.error;
  }

  const cssClasses = `${classes.notification} ${statusClasses}`;

  return (
    <div className={cssClasses}>
      <h1 className={classes.flash_title}>{title}</h1>
      <p className={classes.flash_message}>{message}</p>
    </div>
  );
}

export default FlashMessage;
