import React, { useState } from "react";
import { useQuery } from "react-query";
import getGeneralInfo from "../../api/CompanyInfo";
import logout from "../../api/logout";
import useCompanyStore from "../../store/Company";
import useMarketingStore from "../../store/Marketing";
import useUpgradesStore from "../../store/Upgrades";

function Profile() {
	const [open, setOpen] = useState(false);

	const { isLoading, data } = useQuery("companyInfo", () => getGeneralInfo());

	const { reset: marketingReset } = useMarketingStore();
	const { reset: companyReset } = useCompanyStore();
	const { reset: upgradesReset } = useUpgradesStore();

	return !isLoading ? (
		<>
			<button
				className="p-0 border-4 border-accent-400 ring-offset-base-100 ring-offset-2 w-10 h-10 rounded-full bg-gray-200"
				type="button"
				onClick={() => setOpen(!open)}
			>
				{/* TODO replace with real avatar */}
				<img
					className="rounded-full"
					src={`https://avatars.dicebear.com/api/miniavs/${data.id}a.png`}
					alt="user profile "
				/>
			</button>

			{open && (
				<>
					<div className="absolute right-6 py-2 mt-4 bg-white rounded-xl shadow-xl border-accent-700 border-2 z-20 dark:bg-[#121212]">
						<div className="flex flex-col justify-between px-4 py-2">
							<h6 className="py-2">{data.name}</h6>
							<button
								type="button"
								className="bg-accent-50 transition-all ease-in-out duration-300 rounded-lg min-w-[128px] flex justify-center align-middle bg-transparent py-2 px-3 hover:text-accent-700 hover:bg-accent-300 dark:bg-accent-500"
								onClick={() => logout(marketingReset, companyReset, upgradesReset)}
							>
								Logout
							</button>
						</div>
					</div>
					<div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
				</>
			)}
		</>
	) : null;
}

export default Profile;
