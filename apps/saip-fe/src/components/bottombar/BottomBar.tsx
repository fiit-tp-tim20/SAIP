import React, { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { getGeneralInfo } from "../../api/CompanyInfo";
import useMarketingStore from "../../store/Marketing";

export default function BottomBar() {
	const { isLoading, data } = useQuery("companyInfo", () => getGeneralInfo());

	const { getSum } = useMarketingStore();

	const [spent, setSpent] = useState(0);

	useEffect(() => {}, [data]);

	return (
		<div className="flex flex-row p-2 bottom-0 w-screen fixed left-0 z-40 justify-center">
			{!isLoading ? (
				<div className="bg-white p-3 rounded-lg border-2 border-accent-700">
					<p>
						{getSum()}/{data.budget_cap}
					</p>
				</div>
			) : null}
		</div>
	);
}
