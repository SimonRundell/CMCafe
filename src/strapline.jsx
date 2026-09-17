import PropTypes from 'prop-types';

/**
 * Footer strip with the cafe's contact details and social links.
 *
 * @param {object} props
 * @param {object} props.config Public cafe config (address, phone, email, socials).
 */
function Strapline({ config }) {
    return (
        <div>
            {config.address} | {config.phone} | <a href={`mailto:${config.email}`} target="_blank" rel="noopener noreferrer">{config.email} </a> |
                <a href={config.facebook} target="_blank" rel="noopener noreferrer"> Facebook </a> |
                <a href={config.twitter} target="_blank" rel="noopener noreferrer"> Twitter </a> |
                <a href={config.instagram} target="_blank" rel="noopener noreferrer"> Instagram</a>
        </div>
    )
}

Strapline.propTypes = {
    config: PropTypes.shape({
        address: PropTypes.string,
        phone: PropTypes.string,
        email: PropTypes.string,
        facebook: PropTypes.string,
        twitter: PropTypes.string,
        instagram: PropTypes.string,
    }).isRequired,
};

export default Strapline;
