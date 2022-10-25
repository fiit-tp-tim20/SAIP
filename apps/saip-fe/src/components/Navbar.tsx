import React from "react";

function Navbar() {
	return (
		<div className="navbar bg-gray-100 top-0 w-screen fixed left-0">
			<div className="flex-1">
				<a href="/" className="btn btn-primary btn-ghost normal-case text-xl">
					Navbar
				</a>
			</div>
			<div className="flex-none">
				<ul className="menu menu-horizontal p-0">
					<li>
						<a href="/">macky</a>
					</li>
					<li>
						<a href="/">Item 2</a>
					</li>
					<li>
						<a href="/">Item 3</a>
					</li>
					<li>
						<a href="/">Item 4</a>
					</li>
					<li>
						<a href="/">Item 5</a>
					</li>
					<li>
						<a href="/">Item 6</a>
					</li>
					<li>
						<a href="/">Item 7</a>
					</li>
				</ul>
			</div>
		</div>
	);
}

export default Navbar;
