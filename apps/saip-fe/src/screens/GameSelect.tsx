import React from "react";


function GameSelect() {


    return (
        <div className="w-full  max-w-xs">
            <form className="bg-white shadow-md rounded px-6 pt-6 pb-8 mb-4">
                <div>
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">
                        Názov tímu
                    </label>
                    <input
						className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
						id="username"
						type="text"
						placeholder="Názov vášho tímu"
					/>
                    <label className="block text-gray-700 text-sm font-bold mb-2">Zvoľte vaše cvičenie</label>
                    <select className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-accent-500 focus:border-accent-500 block w-full p-2.5">
                        <option selected>Choose a country</option>
                        <option value="US">United States</option>
                        <option value="CA">Canada</option>
                        <option value="FR">France</option>
                        <option value="DE">Germany</option>
                    </select>
                </div>
            </form>
        </div>
    );
}

export default GameSelect;