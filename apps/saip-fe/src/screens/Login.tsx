import React, { useState } from "react";
import { Link } from "react-router-dom";

import useCompanyStore from "../store/Company";
import useMarketingStore from "../store/Marketing";

export default function Login() {
	const [email, setEmail] = useState(0);
	const [password, setPassword] = useState(0);

	const [isInvalid, setIsInvalid] = useState(false);

	const { reset: marketingReset } = useMarketingStore();
	const { reset: companyReset } = useCompanyStore();

	const login = async () => {
		const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/login/`, {
			method: "POST",
			body: JSON.stringify({
				username: email,
				password,
			}),
			headers: {
				"Content-type": "application/json",
			},
		});

		if (response.status === 400) {
			setIsInvalid(true);
			return null;
		}

		const { token, expiry } = await response.clone().json();

		localStorage.setItem("token", token);
		localStorage.setItem("expiryDate", expiry);

		marketingReset();
		companyReset();

		//! temporary, find a better way to do this
		window.location.reload();
		return response;
	};

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		// const {data, status} = useQuery('login', login)
		login();
		// navigate("/dashboard");
	};

	return (
		<div className="w-full h-full max-w-xs flex flex-col gap-4 justify-center items-center">
			<h1 className="font-bold">SAIP</h1>
			<form className="bg-white rounded-2xl px-6 pt-6 pb-8 mb-4 w-full" onSubmit={handleSubmit}>
				<div className="mb-4">
					<label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">
						Prihlasovacie meno
					</label>
					<input
						className={`shadow appearance-none border ${
							isInvalid ? "border-red-500" : ""
						} rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`}
						id="username"
						type="text"
						placeholder="Prihlasovacie meno"
						onChange={(e: any) => setEmail(e.target.value)}
					/>
				</div>
				<div className="mb-6">
					<label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
						Heslo
					</label>
					<input
						className={`shadow appearance-none border ${
							isInvalid ? "border-red-500" : ""
						}  rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline`}
						id="password"
						type="password"
						placeholder="Heslo"
						onChange={(e: any) => setPassword(e.target.value)}
					/>
					{isInvalid ? <p className="text-red-500 text-xs italic">Nesprávne meno alebo heslo.</p> : null}
				</div>
				<div className="flex items-center justify-between gap-2">
					<button
						className="w-full button-light font-bold py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline"
						type="button"
					>
						<Link to="/register">Registrácia</Link>
					</button>
					<button
						className="w-full button-dark font-bold py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline"
						type="submit"
					>
						Prihlásiť sa
					</button>
				</div>
			</form>
		</div>
	);
}
