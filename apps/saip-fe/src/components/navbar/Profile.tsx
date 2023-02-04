import React, { useEffect, useState } from "react";

function Profile() {
	const [open, setOpen] = useState(false);

	useEffect(() => {
		console.warn(open);
	}, [open]);

	return (
		<>
			<button
				className="p-0 border-4 border-accent-400 ring-offset-base-100 ring-offset-2 w-10 h-10 rounded-full bg-gray-200"
				type="button"
				onClick={() => setOpen(!open)}
			>
				<img className="rounded-full" src="https://avatars.dicebear.com/api/miniavs/123.png" alt="user photo" />
			</button>

			{open && (
				<div className="absolute right-0 w-48 py-2 mt-2 bg-white rounded-md shadow-xl dark:bg-gray-800">
					<a
						href="#"
						className="block px-4 py-2 text-sm text-gray-700 transition-colors duration-200 transform rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
					>
						Profile
					</a>
					<a
						href="#"
						className="block px-4 py-2 text-sm text-gray-700 transition-colors duration-200 transform rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
					>
						Settings
					</a>
					<a
						href="#"
						className="block px-4 py-2 text-sm text-gray-700 transition-colors duration-200 transform rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
					>
						Logout
					</a>
				</div>
			)}
		</>
	);
}

export default Profile;
