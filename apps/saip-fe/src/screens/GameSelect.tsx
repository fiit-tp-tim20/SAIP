import React from "react";
import { useState, useEffect } from "react";

type User = {
	name: string;
	id: number;
};

export default function GameSelect() {
	const [games, setGames] = useState([]);
	const [users, setUsers] = useState<User[]>([]);
	const [inputNumbersOfUsers, setInputNumbersOfUsers] = useState(0);
	const [companyName, setCompanyName] = useState("");

	useEffect(() => {
		async () => {
			const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/list_games/`, {
				method: "GET",
				headers: {
					"Content-type": "application/json",
					Authorization: `Bearer ${localStorage.getItem("token")}`,
				},
			});
			const games = await response.json();
			setGames(games);
		};
	}, []);

	function setNumberOfUsers(numOfPlayers: number) {
		const obj = [...Array(numOfPlayers).keys()].map((number) => {
			return { value: "", id: number };
		});
		setInputNumbersOfUsers(numOfPlayers);
		setUsers(obj);
	}

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const arrayOfNames = users.map((user) => user.value);
		//console.log(arrayOfNames);

		async () => {
			const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/create_company/`, {
				method: "POST",
				headers: {
					"Content-type": "application/json",
					Authorization: `Bearer ${localStorage.getItem("token")}`,
				},
				body: JSON.stringify({
					game: games,
					name: companyName,
					participants: arrayOfNames,
				}),
			});
			const data = await response.json();
			console.log(data);

			if (response.status !== 201) {
				console.log(data.detail);
			}
		};
	};

	const updateUser = (e: React.ChangeEvent<HTMLInputElement>, id: number) => {
		setUsers((users) =>
			users.map((user) => {
				if (user.id === id) {
					return { ...user, value: e.target.value };
				}
				return user;
			}),
		);
	};

	return (
		<div className="w-full  max-w-xs">
			<form className="bg-white shadow-md rounded px-6 pt-6 pb-8 mb-4" onSubmit={handleSubmit}>
				<div className="mb-6">
					<label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">
						Názov tímu
					</label>
					<input
						className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
						id="username"
						type="text"
						placeholder="Názov vašej spoločnosti"
						onChange={(e: any) => setCompanyName(e.target.value)}
					/>
					<label className="block text-gray-700 text-sm font-bold mb-2">Zvoľte vaše cvičenie</label>
					<select className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-accent-500 focus:border-accent-500 block w-full p-2.5">
						{games.map(({ id, name }) => (
							<>
								<option value={name}>{name}</option>
							</>
						))}
					</select>
					<label className="block text-gray-700 text-sm font-bold mb-2">Počet ľudí v tíme</label>
					<select
						onChange={(e) => setNumberOfUsers(+e.target.value)}
						value={inputNumbersOfUsers}
						className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-accent-500 focus:border-accent-500 block w-full p-2.5"
					>
						<option key="0" value="0">
							0
						</option>
						<option key="1" value="1">
							1
						</option>
						<option key="2" value="2">
							2
						</option>
						<option key="3" value="3">
							3
						</option>
						<option key="4" value="4">
							4
						</option>
						<option key="5" value="5">
							5
						</option>
						<option key="6" value="6">
							6
						</option>
					</select>
				</div>
				{users?.length > 0 && (
					<div className="mb-6">
						{users.map(({ value, id }) => (
							<div>
								<label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">
									Celé meno
								</label>
								<input
									className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
									id="username"
									type="text"
									placeholder="Celé meno"
									value={value}
									onChange={(e) => updateUser(e, +id)}
								/>
							</div>
						))}
					</div>
				)}
				<div className="flex items-center justify-between">
					<button
						className="w-full bg-accent-700 hover:bg-accent-500 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
						type="submit"
					>
						Potvrdiť
					</button>
				</div>
			</form>
		</div>
	);
}
