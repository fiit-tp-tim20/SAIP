import React, { useState } from "react";

interface SliderProps {
  min: number;
  max: number;
  step?: number;
}

function Slider({ min, max, step = 1 }: SliderProps) {
    const [value, setValue] = useState((max - min) / 2);
  
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      setValue(parseInt(event.target.value));
    };
  
    return (
        <div className="relative">
          <input
            type="range"
            min={min}
            max={max}
            step={step}
            value={value}
            onChange={handleChange}
            className="block w-full bg-gray-300 appearance-none rounded-lg cursor-pointer"
          />
          <input
            type="number"
            min={min}
            max={max}
            step={step}
            value={value}
            onChange={handleChange}
            className="block w-2/3 mx-auto appearance-none rounded-lg p-2 border border-gray-300"
          />
        </div>
      );
    }
  
export default Slider;