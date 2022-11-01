import React from "react";

type Props = {
	name: string;
	researchedAvatars: string[];
	progressMax?: number;
	progressValue?: number;
};

function UpgradeInfo(props: Props) {
	const { name, researchedAvatars, progressMax, progressValue } = props;

	return (
		<li className="w-full bg-gray-200 dark:bg-[#242424] py-2 px-4 my-2 rounded-xl flex flex-row justify-between align-middle h-16">
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
			<div className="avatar-group -space-x-6">
				{researchedAvatars
					.filter((_el, index) => index < 3)
					.map((avatar) => (
						<div className="avatar" key={avatar}>
							<div className="w-10 h-10 rounded-full bg-gray-200">
								<img src={`https://avatars.dicebear.com/api/miniavs/${avatar}.png`} alt="person" />
							</div>
						</div>
					))}
				{researchedAvatars.length > 3 && (
					<div className="avatar placeholder">
						<div className="w-10 h-10 bg-primary-focus text-primary-content">
							<span>+{researchedAvatars.length - 3}</span>
						</div>
					</div>
				)}
			</div>
		</li>
	);
}

export default UpgradeInfo;
