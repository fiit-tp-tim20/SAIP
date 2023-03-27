import React from "react";
import { useNavigate } from "react-router-dom";

function NotFound() {
	const navigate = useNavigate();

	return (
		<div className="grid items-center">
			<h1 className="flex justify-center mt-10">404</h1>
			<h3 className="flex justify-center my-5">Stránka, ktorú hľadáte sa nenašla</h3>
			<button
				className="flex bg-accent-500 hover:bg-accent-700 text-white font-bold rounded-lg mx-40 mt-10"
				type="button"
				onClick={() => navigate("/")}
			>
				Späť na hlavnú stránku
			</button>
		</div>
	);
}

export default NotFound;
