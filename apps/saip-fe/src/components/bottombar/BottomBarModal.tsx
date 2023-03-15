type Props = {
	onAccept: () => void;
	onDecline: () => void;
};

const BottomBarModal = (props: Props) => {
	const { onAccept, onDecline } = props;

	return (
		<div className="background-container rounded-2xl p-6 flex flex-col gap-4">
			<h5>Naozaj chcete ukončiť aktuálne kolo? Táto akcia je nezvratná.</h5>
			<div className="flex flex-row gap-4 justify-end">
				<button
					type="button"
					onClick={onDecline}
					className="bg-accent-200 hover:bg-accent-400 text-accent-900 font-bold py-2 px-4 rounded-lg disabled:bg-accent-100 disabled:cursor-not-allowed"
				>
					Zrušiť
				</button>
				<button
					type="submit"
					onClick={onAccept}
					className="bg-accent-500 hover:bg-accent-700 text-white font-bold py-2 px-4 rounded-lg disabled:bg-accent-100 disabled:cursor-not-allowed"
				>
					Potvrdiť
				</button>
			</div>
		</div>
	);
};

export default BottomBarModal;
