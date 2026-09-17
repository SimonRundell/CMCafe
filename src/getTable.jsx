import PropTypes from 'prop-types';
import { Select } from 'antd';

const { Option } = Select;

/**
 * Table picker, populated from the cafe config's table list.
 *
 * @param {object} props
 * @param {object} props.config Public cafe config, including `tables`.
 * @param {string} props.tableNumber Currently selected table key.
 * @param {(value: string) => void} props.setTableNumber
 */
function TableSelect({ config, tableNumber, setTableNumber }) {
  return (
    <Select
      value={tableNumber}
      onChange={value => setTableNumber(value)}
      className="table-select"
      placeholder="Select a table"
      size="large"
    >
      {Object.entries(config.tables).map(([key, { name, seats }]) => (
        <Option key={key} value={key}>{`${name} (${seats} seats)`}</Option>
      ))}
    </Select>
  );
}

TableSelect.propTypes = {
    config: PropTypes.shape({
        tables: PropTypes.object.isRequired,
    }).isRequired,
    tableNumber: PropTypes.string.isRequired,
    setTableNumber: PropTypes.func.isRequired,
};

export default TableSelect;
