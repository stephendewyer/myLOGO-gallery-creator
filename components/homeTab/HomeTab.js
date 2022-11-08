import {useState } from 'react';
import styles from './HomeTab.module.css';
import homeIcon from '../../public/images/icons/home_icon.svg';
import homeIconHover from '../../public/images/icons/home_icon_hover.svg';
import Image from 'next/image';

const DeleteButton = (props) => {
    
    const [isHovering, setIsHovered] = useState(false);
    const onMouseEnter = () => setIsHovered(true);
    const onMouseLeave = () => setIsHovered(false);

    return (
        <div 
            className={styles.homeIcon}
            onMouseEnter={onMouseEnter} 
            onMouseLeave={onMouseLeave}
            onClick={props.clicked}
        >
            {isHovering ? (
            <Image 
                src={homeIconHover} 
                className="image" 
                alt="home icon hover" 
                priority
            /> 
            ) : (
            <Image 
                src={homeIcon} 
                className="image" 
                alt="home icon default" 
                priority
            />
            )}
        </div>
    );
};

export default DeleteButton;