import React from "react";
import { useState, useEffect } from "react";


function GameSelect() {


    const [numOfMembers, setNumOfMembers] = useState('');
    const [fields, setFields] = useState([]);
    const [games, setGames] = useState([]);
    

    
    const confirm = async () => {
		const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/list_games/`, {
			method: "GET",
			headers: {
				"Content-type": "application/json",
			},
		});
        console.log(response);

    }
    

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		//const {data, status} = useQuery('login', login)
		confirm();
		//navigate("/dashboard");
	};



    const onChangeNumberOfMembers = (e) => {
        const numOfMembers = e.target.value;
        setNumOfMembers(numOfMembers);

        if(numOfMembers != null){
            const generateArrays= Array.from(Array(Number(e.target.value)).keys())
              setFields(generateArrays);
          } else {
            setFields([])
          }
    };

    function addFields (){
        return  fields.map((field) => (
        <div>
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">
                        Celé meno
                    </label>
                    <input
						className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
						id="username"
						type="text"
						placeholder="Celé meno"
					/>
        </div>  ))
    }

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
					/>
                    <label className="block text-gray-700 text-sm font-bold mb-2">Zvoľte vaše cvičenie</label>
                    <select className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-accent-500 focus:border-accent-500 block w-full p-2.5">
                        <option selected>Cvičenie, do ktorého patríte</option>
                        <option value="US">United States</option>
                        <option value="CA">Canada</option>
                        <option value="FR">France</option>
                        <option value="DE">Germany</option>
                    </select>
                    <label className="block text-gray-700 text-sm font-bold mb-2">Počet ľudí v tíme</label>
                    <select className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-accent-500 focus:border-accent-500 block w-full p-2.5" onChange={onChangeNumberOfMembers}>
                        <option selected> </option>
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="4">4</option>
                        <option value="5">5</option>
                        <option value="6">6</option>
                    </select>
                </div>
                {fields.length ? ( 
                <div className="mb-6">
                    {addFields()}
                </div>
            ) : null
            }
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

export default GameSelect;