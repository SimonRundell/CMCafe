import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Tag } from 'antd';

/**
 * Read-only list of the extras/mods chosen for one cart line, shown in the
 * order drawer.
 *
 * @param {object} props
 * @param {object} props.config Public cafe config (api base URL).
 * @param {number} props.productID Product these extras belong to.
 * @param {number[]} props.mods Mod IDs chosen for this line.
 */
function RenderTags({ config, productID, mods }) {
    const [extras, setExtras] = useState([]);

    useEffect(() => {
        const jsonData = JSON.stringify({product_id: parseInt(productID)});
        fetch(config.api + '/getProductExtras.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: jsonData,
        })
        .then(response => response.json())
        .then(responseData => {
            setExtras(responseData);
        });
    }, [config.api, productID]);

    return (
        <>
        <div className="order-extras-container">
            {extras && extras.map(extra => (
                mods.includes(extra.id) && (
                    <Tag key={extra.id}
                        value={extra.mod_cost}
                        checked={mods.includes(extra.id)}
                        className="order-extra-tag">
                        {extra.mod_name}
                    </Tag>
                )
            ))}
        </div>
        </>
    );
}

RenderTags.propTypes = {
    config: PropTypes.shape({
        api: PropTypes.string.isRequired,
    }).isRequired,
    productID: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
    mods: PropTypes.array.isRequired,
};

export default RenderTags;
