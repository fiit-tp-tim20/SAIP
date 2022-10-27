import React from "react";

type Props = {
	name: string;
	researchedAvatars: string[];
};

function UpgradeInfo(props: Props) {
	const { name, researchedAvatars } = props;

	return (
		<li className="w-full bg-gray-200 py-2 px-4 my-2 rounded-xl flex flex-row justify-between align-middle h-16">
			<p className="font-bold my-auto">{name}</p>
			<div className="avatar-group -space-x-6">
				{researchedAvatars
					.filter((_el, index) => index < 3)
					.map((avatar) => (
						<div className="avatar">
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
