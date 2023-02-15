import React, { useState } from "react";

interface SliderProps {
	min: number;
	max: number;
	value: number;
	setValue: (value: number) => void;
	checked?: boolean;
	setChecked?: (value: boolean) => void;
	step?: number;
}

function Slider(props: SliderProps) {
	const { min, max, value, setValue, checked, setChecked, step = 1 } = props;

	const [localValue, setLocalValue] = useState(value);

	const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setLocalValue(parseInt(event.target.value));
	};

	const toggleState = () => {
		if (setChecked) setChecked(!checked);
		setValue(localValue);
	};

	return (
		<div className="relative">
			<input
				type="range"
				min={min}
				max={max}
				step={step}
				value={localValue}
				onChange={handleChange}
				className={`block w-full bg-gray-300 appearance-none rounded-lg cursor-pointer ${
					checked ? "opacity-50 cursor-not-allowed" : ""
				}`}
				disabled={checked}
				placeholder="0"
			/>
			<div className="flex items-center justify-between mt-2 min-w-[200px]">
				<input
					type="number"
					min={min}
					max={max}
					step={step}
					value={localValue}
					onChange={handleChange}
					className={`block w-1/2 appearance-none rounded-lg p-2 m-0 border border-gray-300 slider ${
						checked ? "opacity-50 cursor-not-allowed" : ""
					}`}
					disabled={checked}
					placeholder="0"
				/>
				{checked !== undefined && (
					<button
						type="button"
						className="bg-accent-500 hover:bg-accent-700 text-white font-bold py-2 px-4 m-0 rounded-lg"
						onClick={toggleState}
					>
						{!checked ? "Potvrdiť" : "Zmeniť"}
					</button>
				)}
			</div>
		</div>
	);
}

export default Slider;
