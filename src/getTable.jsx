import React from 'react';
import { Select } from 'antd';

const { Option } = Select;

function TableSelect({ config, tableNumber, setTableNumber }) {
  return (
	<Select
	  value={tableNumber}
	  onChange={value => setTableNumber(value)}
	  style={{ width: 200 }}
      placeholder="Select a table"
      size="large"
	>
	  {Object.entries(config.tables).map(([key, { name, seats }]) => (
		<Option key={key} value={key}>{`${name} (${seats} seats)`}</Option>
	  ))}
	</Select>
  );
}

export default TableSelect;