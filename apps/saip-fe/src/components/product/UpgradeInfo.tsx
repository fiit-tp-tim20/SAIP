import React from "react";

type Props = {
	name: string;
	researchedAvatars: string[];
	progressMax?: number;
	progressValue?: number;
	onClick?: () => void;
};

function UpgradeInfo(props: Props) {
	const { name, researchedAvatars, progressMax, progressValue, onClick } = props;

	return (
		<li
			className="w-full bg-gray-200 dark:bg-[#242424] py-2 px-4 my-2 rounded-xl flex flex-row justify-between align-middle h-16"
			onClick={onClick}
		>
			<div className="flex flex-row align-middle justify-center">
				<p className="font-bold my-auto min-w-[180px]">{name}</p>
				{progressMax && (
					<div className="flex flex-row items-center justify-center text-center">
						<progress className="progress progress-primary w-56" value={progressValue} max={progressMax} />
						<p className="my-auto ml-2">
							{progressValue}/{progressMax}
						</p>
					</div>
				)}
			</div>
			<div className="flex mb-5 -space-x-4">
				{researchedAvatars
					.filter((_el, index) => index < 3)
					.map((avatar) => (
						<div
							key={avatar}
							className="border-4 border-accent-400 ring-offset-base-100 ring-offset-2 w-12 h-12 rounded-full bg-gray-200"
						>
							<img
								className="rounded-full"
								src={`https://avatars.dicebear.com/api/miniavs/${avatar}.png`}
								alt="person"
							/>
						</div>
					))}
				{researchedAvatars.length > 3 && (
					<div className="border-4 border-accent-400 ring-offset-base-100 ring-offset-2 w-12 h-12 rounded-full bg-gray-200 flex justify-center leading-10">
						<span>+{researchedAvatars.length - 3}</span>
					</div>
				)}
			</div>
		</li>
	);
}

export default UpgradeInfo;
