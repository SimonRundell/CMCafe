import { useState } from 'react';
import PropTypes from 'prop-types';

/**
 * Menu item thumbnail that opens a full-size overlay on click.
 *
 * @param {object} props
 * @param {string} [props.image_url] Image to display; falls back to a
 *   placeholder when not provided.
 */
const LightBox = ({ image_url }) => {
    const [isLightboxOpen, setIsLightboxOpen] = useState(false);

    const fallback = "./assets/notfound.png";
    
    const openLightbox = () => setIsLightboxOpen(true);
    const closeLightbox = (e) => {
        e.stopPropagation(); // Prevent the event from bubbling up
        setIsLightboxOpen(false);
    };

    const displayImageUrl = image_url || fallback;

    return (
        <div>
            <div onClick={openLightbox}>
                <img className="menu-item-image" src={displayImageUrl} height={50} alt="Menu item" />
            </div>
            {isLightboxOpen && (
                <div className="lightbox-overlay" onClick={closeLightbox}>
                    <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>

                    
                        <img src={displayImageUrl} className="lightbox-image" alt="image"/>
                
                        <button className="lightbox-close" onClick={closeLightbox}>&nbsp;X&nbsp;</button>
                    </div>
                </div>
            )}
        </div>
    );
};

LightBox.propTypes = {
    image_url: PropTypes.string,
};

export default LightBox;