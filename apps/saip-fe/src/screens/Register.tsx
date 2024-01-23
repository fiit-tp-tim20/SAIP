import React, { useRef, useState } from "react";
import { Link, redirect } from "react-router-dom";

function Register() {
	const emailElement = useRef<HTMLInputElement>(null);
	const passwordElement = useRef<HTMLInputElement>(null);
	const repeatPasswordElement = useRef<HTMLInputElement>(null);

	const [isInvalidUsername, setIsInvalidUsername] = useState(false);
	const [isInvalidPassword, setIsInvalidPassword] = useState(false);
	const [success, setSuccess] = useState(false);

	const handleSubmit = async () => {
		setIsInvalidPassword(false);
		setIsInvalidUsername(false);
		setSuccess(false);

		if (passwordElement.current?.value !== repeatPasswordElement.current?.value) {
			setIsInvalidPassword(true);
			return;
		}

		const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/register/`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				username: emailElement.current?.value,
				password: passwordElement.current?.value,
			}),
		});

		if (response.status === 400) {
			setIsInvalidUsername(true);
			return;
		}

		setSuccess(true);
	};

	return (
		<div className="w-full h-full max-w-xs flex flex-col gap-4 justify-center items-center">
			<Link to="/">
				<button
				  className="button-light font-bold py-1 px-10 rounded-lg focus:outline-none focus:shadow-outline"
				>
					<h5 className="font-bold">🏠</h5>
				</button>
			</Link>
			<h2 className="font-bold">Registrácia</h2>
			<form className="bg-white rounded-2xl px-6 pt-6 pb-8 mb-4 min-w-[300px]">
				<div className="mb-4">
					{success ? (
						<div
							className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative"
							role="alert"
						>
							<strong className="font-bold">Úspešne ste sa zaregistrovali!</strong>{" "}
							<span className="block sm:inline">Teraz sa môžete prihlásiť.</span>
						</div>
					) : null}
				</div>
				<div className="mb-4">
					<label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">
						Používateľské meno
					</label>
					<input
						ref={emailElement}
						className={`shadow appearance-none border ${
							isInvalidUsername ? "border-red-500" : ""
						} rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`}
						id="username"
						type="text"
						placeholder="Požívateľské meno"
					/>
					{isInvalidUsername ? (
						<p className="text-red-500 text-xs italic">Používateľské meno už existuje</p>
					) : null}
				</div>
				<div className="mb-4">
					<label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
						Heslo
					</label>
					<input
						ref={passwordElement}
						className={`shadow appearance-none border ${
							isInvalidPassword ? "border-red-500" : ""
						}  rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`}
						id="password"
						type="password"
						placeholder="Heslo"
					/>
					{isInvalidPassword ? <p className="text-red-500 text-xs italic">Heslá sa nezhodujú</p> : null}
				</div>
				<div className="mb-4">
					<label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
						Zopakovať heslo
					</label>
					<input
						ref={repeatPasswordElement}
						className={`shadow appearance-none border ${
							isInvalidPassword ? "border-red-500" : ""
						}  rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline`}
						id="repeat-password"
						type="password"
						placeholder="Heslo"
					/>
					{isInvalidPassword ? <p className="text-red-500 text-xs italic">Heslá sa nezhodujú</p> : null}
				</div>
				<div className="flex flex-col items-center justify-between gap-2">
					<button
						className="w-full button-dark font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
						type="button"
						onClick={handleSubmit}
					>
						Registrácia
					</button>
					<p>
						Už máte účet?{" "}
						<span className="accent-800-color accent-800-color-hover transition-all duration-300">
							<Link to="/login">Prihláste sa</Link>
						</span>
					</p>
				</div>
			</form>
		</div>
	);
}

export default Register;
