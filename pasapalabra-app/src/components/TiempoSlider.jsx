// src/components/TiempoSlider.jsx
import React, { useEffect, useState } from 'react';
import CircularSlider from '@fseehawer/react-circular-slider';

const TiempoSlider = ({ min, max, initialTime, onChange }) => {
  const [value, setValue] = useState(initialTime);

  useEffect(() => {
    setValue(initialTime);
  }, [initialTime]);

  const values = Array.from({ length: max - min + 1 }, (_, i) => i + min);

  return (
    <CircularSlider
      width={74}
      data={values}
      dataIndex={value - min}
      knobColor="#e24a94ff"
      knobSize={28}
      
      progressColorFrom="#e24a94ff"
      progressColorTo="#6e0936ff"
      trackColor="transparent"
      trackSize={2}
      progressSize={4}
      hideLabelValue
      onChange={(val) => {
        setValue(val);
        onChange(val);
      }}
    />
  );
};

export default TiempoSlider;
