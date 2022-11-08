import React, { useState } from "react";

/**
 *
 * @param _element element to be rendered in the modal
 * @returns {object} {sShowing, setIsShowing, Modal, setElement}
 * @example
 * const { isShowing, setIsShowing, Modal, setElement } = useModal(<div>Modal content</div>);
 */
export const useModal = (_element: any) => {
	const [isShowing, setIsShowing] = useState(false);
	const [element, setElement] = useState(_element);

	const handleParentClick = (e: any) => {
		e.stopPropagation();

		if (e.target.id === "modal") {
			setIsShowing(false);
		}
	};

	function Modal() {
		return (
			<div
				className={`${
					isShowing ? "block" : "hidden"
				} fixed inset-0 z-50 overflow-y-auto top-0 left-0 right-0 bottom-0 bg-[#000000AA]`}
				onClick={handleParentClick}
			>
				<div id="modal" className="flex items-center justify-center min-h-screen p-4">
					{element}
				</div>
			</div>
		);
	}

	return {
		isShowing,
		setIsShowing,
		Modal,
		setElement,
	};
};
