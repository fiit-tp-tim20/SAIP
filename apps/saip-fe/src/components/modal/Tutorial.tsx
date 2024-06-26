import React from "react";
// @ts-ignore
import Modal from "react-modal";
import { useTranslation } from "react-i18next";

// @ts-ignore
function Tutorial({ isOpen, closeModal, textTitle, textContent }) {
	const { t } = useTranslation();

	return (
		<Modal
			isOpen={isOpen}
			onRequestClose={closeModal}
			contentLabel="Popup"
			ariaHideApp={false}
			className="popover"
			style={{
				content: {
					width: "80%", // Set the width of the modal to 80% of the viewport
					maxWidth: "600px", // Limit the maximum width of the modal
					minWidth: "300px", // Minimum width for the content area
					margin: "auto", // Center the modal horizontally
					marginTop: "10%", // Center the modal vertically
					display: "flex",
					flexDirection: "column",
					alignItems: "center",
					justifyContent: "center",
					border: "4px solid black",
					borderRadius: "10px",
					background: "white",
				},
			}}
		>
			<h3 className="popover-title" style={{ margin: "20px" }}>
				{textTitle}
			</h3>
			<div className="popover-content" style={{ margin: "20px", maxHeight: "300px", overflowY: "auto" }}>
				{/* You can replace the static content with a dynamic text */}
				{textContent}
			</div>

			{/* eslint-disable-next-line react/button-has-type */}
			<button className="button-light font-bold rounded-lg" onClick={closeModal} style={{ margin: "20px" }}>
				{t("tutorial.close") as string}
			</button>
		</Modal>
	);
}

export default Tutorial;
