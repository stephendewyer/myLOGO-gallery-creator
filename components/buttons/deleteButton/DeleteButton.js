import { useState } from 'react';
import styles from './DeleteButton.module.css';
import Image from 'next/image';
import deleteIconDefault from '../../../public/images/icons/deleteIcon.svg';
import deleteIconHover from '../../../public/images/icons/deleteIconHover.svg';

const DeleteButton = (props) => {
    
    const [isHovering, setIsHovered] = useState(false);
    const onMouseEnter = () => setIsHovered(true);
    const onMouseLeave = () => setIsHovered(false);

    return (
        <div 
            className={styles.deleteIcon}
            onMouseEnter={onMouseEnter} 
            onMouseLeave={onMouseLeave}
            onClick={props.clicked}
        >
            {isHovering ? (
            <Image 
                src={deleteIconHover} 
                className="image" 
                alt="delete logo icon hover" 
                priority
            /> 
            ) : (
            <Image 
                src={deleteIconDefault} 
                className="image" 
                alt="delete logo icon default" 
                priority
            />
            )}
        </div>
    );
};

export default DeleteButton;