import React from "react";

function Sandbox() {
	return (
		<div className="flex flex-col">
			<div className="flex flex-row background-container rounded-2xl p-5">
				<div className="flex flex-col">
					<button type="button" className="btn btn-primary mt-2">
						Button Primary
					</button>
					<button type="button" className="btn btn-secondary mt-2">
						Button Secondary
					</button>
					<button type="button" className="btn btn-info mt-2">
						Button Info
					</button>
					<button type="button" className="btn btn-warning mt-2">
						Button Warning
					</button>
					<button type="button" className="btn btn-error mt-2">
						Button Error
					</button>
					<button type="button" className="btn btn-success mt-2">
						Button Success
					</button>
				</div>
				<div className="flex flex-col ml-2">
					<input
						type="range"
						min="0"
						max="100"
						value="40"
						placeholder="0"
						className="range range-primary mt-2"
					/>
					<input
						type="range"
						min="0"
						max="100"
						value="40"
						placeholder="0"
						className="range range-secondary mt-2"
					/>
				</div>
				<div className="flex flex-col ml-2">
					<input type="radio" name="radio-3" className="radio radio-primary mt-2" placeholder="0" checked />
					<input type="radio" name="radio-3" className="radio radio-secondary mt-2" placeholder="0" />
				</div>
			</div>
			<div className="flex flex-row mt-2 background-container rounded-2xl p-5">
				<div className="flex flex-col text-left">
					<h1>Heading 1</h1>
					{/* TODO add stylings to h2-h6 */}
					<h2>Heading 2</h2>
					<h3>Heading 3</h3>
					<h4>Heading 4</h4>
					<h5>Heading 5</h5>
					<h6>Heading 6</h6>
					<p>Paragraph</p>
					<blockquote>blockquote</blockquote>
				</div>
			</div>
		</div>
	);
}

export default Sandbox;
