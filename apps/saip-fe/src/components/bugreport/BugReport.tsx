import React from "react";
import { ReactComponent as Bug } from "./bug-solid.svg";

function BugReport() {
	return (
		<div className="fixed bottom-0 left-0">
			<a href="https://docs.google.com/forms/d/e/1FAIpQLSfT8VZymF_sTY39ApoRyeDH18oOoZ13jHMzeyp6_wmSwmqCdg/viewform">
				<Bug className="w-8 h-8 m-4 fill-accent-500" />
			</a>
		</div>
	);
}

export default BugReport;
