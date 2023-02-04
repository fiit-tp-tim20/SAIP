import React, { useEffect, useState } from "react";

function Profile() {
	const [open, setOpen] = useState(false);

	//! just for testing, find a better place to do this
	const logout = () => {
		localStorage.removeItem("token");
		localStorage.removeItem("expiryDate");
		window.location.reload();
	};

	return (
		<>
			<button
				className="p-0 border-4 border-accent-400 ring-offset-base-100 ring-offset-2 w-10 h-10 rounded-full bg-gray-200"
				type="button"
				onClick={() => setOpen(!open)}
			>
				{/* TODO replace with real avatar */}
				<img className="rounded-full" src="https://avatars.dicebear.com/api/miniavs/123.png" alt="user photo" />
			</button>

			{open && (
				<div className="absolute right-1 py-2 mt-2 bg-white rounded-xl shadow-xl border-accent-700 border-2">
					<div className="flex flex-col justify-between px-4 py-2">
						{/* TODO replace with real name */}
						<h6 className="py-2">Company Name</h6>
						<button
							className="bg-accent-50 transition-all ease-in-out duration-300 rounded-lg min-w-[128px] flex justify-center align-middle bg-transparent py-2 px-3 hover:text-accent-700 hover:bg-accent-300"
							onClick={logout}
						>
							Logout
						</button>
					</div>
				</div>
			)}
		</>
	);
}

export default Profile;
