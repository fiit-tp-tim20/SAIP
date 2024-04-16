import React, {useRef, useState, useEffect, useContext} from "react";
import { useQuery } from "react-query";
import logout from "../api/logout";
import useCompanyStore from "../store/Company";
import useMarketingStore from "../store/Marketing";
import useUpgradesStore from "../store/Upgrades";

type User = {
	value: string;
	id: number;
};

type Game = {
	id: number;
	name: string;
};

const listGames = async () => {
	const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/list_games_ns/`, {
		headers: {
			Authorization: `Bearer ${localStorage.getItem("token")}`,
			"Content-Type": "application/json",
		},
	});
	const data = (await response.json()) as { games: Game[] };
	return data;
};

function GameSelect() {
	const [users, setUsers] = useState<User[]>([]);
	const [inputNumbersOfUsers, setInputNumbersOfUsers] = useState(0);
	const [selectedGame, setSelectedGame] = useState(0);
	const [isInvalidName, setIsInvalidName] = useState(false);
	const [isNameEmpty, setIsNameEmpty] = useState(false);

	const teamnameInput = useRef<HTMLInputElement>(null);

	const { data: gameList } = useQuery("listGames", listGames);

	const { reset: marketingReset } = useMarketingStore();
	const { reset: companyReset } = useCompanyStore();
	const { reset: upgradesReset } = useUpgradesStore();

	useEffect(() => {
		if (gameList?.games?.length) {
			setSelectedGame(gameList.games[0].id);
		}
	}, [gameList]);

	function setNumberOfUsers(numOfPlayers: number) {
		const obj = [...Array(numOfPlayers).keys()].map((number) => ({ value: "", id: number }));
		setInputNumbersOfUsers(numOfPlayers);
		setUsers(obj);
	}

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		setIsInvalidName(false);
		setIsNameEmpty(false);

		if (teamnameInput.current?.value === "") {
			setIsNameEmpty(true);
			return;
		}
		const arrayOfNames = users.map((user) => user.value);

		const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/create_company/`, {
			method: "POST",
			headers: {
				Authorization: `Bearer ${localStorage.getItem("token")}`,
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				game: selectedGame,
				name: teamnameInput.current?.value,
				participants: JSON.stringify(arrayOfNames),
			}),
		});

		if (response.status !== 201) {
			setIsInvalidName(true);
		}
	};

	const updateUser = (e: React.ChangeEvent<HTMLInputElement>, id: number) => {
		setUsers((prevUsers) =>
			prevUsers.map((user) => {
				if (user.id === id) {
					return { ...user, value: e.target.value };
				}
				return user;
			}),
		);
	};

	return (
		<div className="w-full h-full max-w-xs flex flex-col gap-4 justify-center items-center">
			<h2 className="font-bold text-center">Vytvorte si svoj vlastný tím</h2>
			<form className="bg-white rounded-2xl px-6 pt-6 pb-8 mb-4" onSubmit={handleSubmit}>
				<div className="mb-6">
					<label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">
						Názov tímu
					</label>
					<input
						className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
							isInvalidName || isNameEmpty ? "border-red-500" : ""
						}`}
						id="username"
						type="text"
						placeholder="Názov vašej spoločnosti"
						ref={teamnameInput}
					/>
					{isInvalidName && <p className="text-red-500 text-xs italic">Názov tímu je už obsadený</p>}
					{isNameEmpty && <p className="text-red-500 text-xs italic">Názov tímu nesmie byť prázdny</p>}
					<label className="block text-gray-700 text-sm font-bold mb-2">Zvoľte vaše cvičenie</label>
					<select
						className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-accent-500 focus:border-accent-500 block w-full p-2.5"
						value={selectedGame}
						onChange={(e) => setSelectedGame(parseInt(e.target.value, 10))}
					>
						{gameList?.games?.map(({ id, name }) => (
							<option value={id} key={id}>
								{name}
							</option>
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
				<div className="flex flex-col items-center justify-between gap-2">
					<button
						className="w-full button-dark font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
						type="submit"
					>
						Potvrdiť
					</button>
					<p className="font-light text-center text-gray-700">
						Prihlásili ste sa pod iným účtom ? Odhláste sa kliknutím{" "}
						<button
							type="button"
							className="button-clear accent-800-color hover:underline"
							onClick={() => logout(marketingReset, companyReset, upgradesReset)}
						>
							TU
						</button>
					</p>
				</div>
			</form>
		</div>
	);
}

export default GameSelect;
