import React from "react";
import { Link } from "react-router-dom";

type Props = {
	title: string;
	path: string;
	isActive: boolean;
};

function LinkTab(props: Props) {
	const { title, path, isActive } = props;

	return (
		<li className="px-2">
			<Link to={path} className="">
				{/* <li className="border-r-2 last:border-r-0 border-r-neutral-300 px-2"> */}
				<div
					className={`transition-all ease-in-out duration-300 rounded-lg border-accent-700 min-w-[128px] flex justify-center align-middle bg-transparent py-2 px-3 hover:text-accent-700 hover:bg-accent-300 ${
						isActive ? "active" : ""
					}`}
				>
					{title}
				</div>
			</Link>
		</li>
	);
}

export default LinkTab;
