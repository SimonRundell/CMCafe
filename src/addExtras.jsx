import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Tag } from 'antd';

/**
 * Checkable list of extras/mods for a single menu item. Reports the chosen
 * mod IDs and their combined cost back up to Menu via the setter props.
 *
 * @param {object} props
 * @param {object} props.config Public cafe config (api base URL).
 * @param {number} props.productID Product these extras belong to.
 * @param {(mods: number[]) => void} props.setOrderMods Called with the chosen mod IDs.
 * @param {(cost: number) => void} props.setOrderModsCost Called with the combined cost of chosen mods.
 */
function AddExtras({ config, productID, setOrderMods, setOrderModsCost }) {
    const [extras, setExtras] = useState([]);
    const [chosenExtras, setChosenExtras] = useState([]);

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

    useEffect(() => {
        const calculateExtrasTotal = () => {
            const extrasSubTotal = chosenExtras.reduce((total, extraId) => {
                const extra = extras.find((item) => item.id === extraId);
                return total + extra.mod_cost;
            }, 0);
            setOrderModsCost(extrasSubTotal);
            return extrasSubTotal;
        };

        calculateExtrasTotal();
        // setOrderModsCost intentionally excluded: Menu passes a fresh inline
        // callback on every render, so depending on it here would re-run this
        // effect (and re-trigger Menu's own re-render) in an infinite loop.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [chosenExtras, extras]);

    const handleChange = (tag, checked) => {
        const nextChosenExtras = checked
          ? [...chosenExtras, tag]
          : chosenExtras.filter((t) => t !== tag);
        setChosenExtras(nextChosenExtras);
        setOrderMods(nextChosenExtras);
    };

    return (
        <>
        <div className="extras-container">
            {extras && extras.map(extra => (
                <Tag.CheckableTag key={extra.id}
                                  value={extra.mod_cost}
                                  checked={chosenExtras.includes(extra.id)}
                                  onChange={(checked) => handleChange(extra.id, checked)}
                                  className="extra-tag">
                    {extra.mod_name} <strong>+£{extra.mod_cost.toFixed(2)}</strong>
                </Tag.CheckableTag>
            ))}
        </div>
        </>
    );
}

AddExtras.propTypes = {
    config: PropTypes.shape({
        api: PropTypes.string.isRequired,
    }).isRequired,
    productID: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
    setOrderMods: PropTypes.func.isRequired,
    setOrderModsCost: PropTypes.func.isRequired,
};

export default AddExtras;
