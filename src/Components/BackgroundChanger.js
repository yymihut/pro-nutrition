import React, { useState, useEffect } from 'react';
import './BackgroundChanger.css';

import picture1 from '../assets/picture1.webp';
import picture2 from '../assets/picture2.webp';
import picture3 from '../assets/picture3.webp';
import picture4 from '../assets/picture4.webp';
import picture5 from '../assets/picture5.webp';
import picture6 from '../assets/picture6.webp';

const images = [picture1, picture2, picture3, picture4, picture5, picture6];

const BackgroundChanger = () => {
    const [currentImage, setCurrentImage] = useState(images[0]);

    useEffect(() => {
        const interval = setInterval(() => {
            const randomIndex = Math.floor(Math.random() * images.length);
            setCurrentImage(images[randomIndex]);
        }, 3000);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="background-container" style={{ backgroundImage: `url(${currentImage})` }}>
            {/* Conținutul aplicației */}
        </div>
    );
};

export default BackgroundChanger;
