import React, { useState } from "react";

interface SliderProps {
	min: number;
	max: number;
	step?: number;
}

function Slider({ min, max, step = 1 }: SliderProps) {
	const [value, setValue] = useState(0);
	const [isDisabled, setIsDisabled] = React.useState(false);
	const [buttonText, setButtonText] = React.useState("Potvrdiť");

	const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setValue(parseInt(event.target.value));
	};

	const toggleState = () => {
		setIsDisabled(!isDisabled);
		setButtonText(isDisabled ? "Potvrdiť" : "Zmeniť");
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
				className={`block w-full bg-gray-300 appearance-none rounded-lg cursor-pointer ${
					isDisabled ? "opacity-50 cursor-not-allowed" : ""
				}`}
				disabled={isDisabled}
			/>
			<div className="flex items-center justify-between mt-2">
				<input
					type="number"
					min={min}
					max={max}
					step={step}
					value={value}
					onChange={handleChange}
					className={`block w-1/2 mx-auto appearance-none rounded-lg p-2 border border-gray-300 ${
						isDisabled ? "opacity-50 cursor-not-allowed" : ""
					}`}
					style={{ WebkitAppearance: "none" }}
					disabled={isDisabled}
				/>
				<button
					className="bg-accent-500 hover:bg-accent-700 text-white font-bold py-2 px-4 mx-2 rounded-lg"
					onClick={toggleState}
				>
					{buttonText}
				</button>
			</div>
		</div>
	);
}

export default Slider;
