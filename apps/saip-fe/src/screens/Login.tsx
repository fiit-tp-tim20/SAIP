import React from 'react';
import { useState } from 'react';
import { useQuery } from 'react-query';

export default function Login() {

    const [email, setEmail] = useState(0)
    const [password, setPassword] = useState(0)

    const login = async () => {
        const response = await fetch('http://127.0.0.1:8000/login', {
            method: 'POST',
            body: JSON.stringify({
                'username': email,
                'password': password,
            }),
            headers: {
                'Content-type': 'application/json'
            }
        })
        return response.json();
    }

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        //const {data, status} = useQuery('login', login)
        login()
    }

    
    return (
        <div className="w-full  max-w-xs">
            <form className="bg-white shadow-md rounded px-6 pt-6 pb-8 mb-4" onSubmit={ handleSubmit }>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">
                        E-mail
                    </label>
                    <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="username" type="text" placeholder="E-mail" onChange={(e: any) => setEmail(e.target.value)}/>
                </div>
                <div className="mb-6">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                        Heslo
                    </label>
                    <input className="shadow appearance-none border border-red-500 rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline" id="password" type="password" placeholder="******************" onChange={(e: any) => setPassword(e.target.value)}/>
                    <p className="text-red-500 text-xs italic">Prosím, zvoľte heslo.</p>
                </div>
                <div className="flex items-center justify-between">
                <button className="bg-accent-700 hover:bg-accent-500 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="submit">
                    Prihlásiť sa
                </button>
                    <a className="inline-block align-baseline font-bold text-sm text-accent-700 hover:text-accent-500" href="#">
                        Zabudnuté heslo?
                    </a>
                </div>
                <p className="mt-8 text-xs font-light text-center text-gray-700">
                    {" "}
                    Nemáte vytvorený účet? Registrujte sa {" "}
                    <a
                        href="#"
                        className="font-bold text-accent-700 hover:text-accent-500 hover:underline"
                    >
                        TU
                    </a>
                </p>
            </form>
            
        </div>
    );
}