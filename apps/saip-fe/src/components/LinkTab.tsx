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
		<>
			<li className={`bg-transparent ${isActive ? "active" : ""}`}>
				<Link to={path} className="min-w-[128px] flex justify-center align-middle">
					<p>{title}</p>
				</Link>
			</li>
			<div className="divider divider-horizontal m-2" />
		</>
	);
}

export default LinkTab;
