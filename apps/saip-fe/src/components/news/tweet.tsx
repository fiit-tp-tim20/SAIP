import React from "react";
import { Heart } from "react-feather";

type Props = {
	username: string;
	avatar: string;
	message: string;
	date: string;
	likesCount: number;
};

function Tweet(props: Props) {
	const { username, avatar, message, date, likesCount } = props;

	return (
		<div className="flex flex-col background-container p-5 rounded-2xl">
			<div className="flex flex-row justify-between">
				<div className="flex flex-row">
					<div className="w-10 h-10 rounded-full bg-gray-200">
						<img src={`https://avatars.dicebear.com/api/miniavs/${avatar}.png`} alt="person" />
					</div>
					<h4 className="pl-4">{username}</h4>
				</div>
				<blockquote>{new Date(date).toLocaleDateString()}</blockquote>
			</div>
			<div className="divider my-1"></div>
			<p>{message}</p>
			<div className="divider my-1"></div>
			<div className="flex flex-row justify-end">
				<Heart />
				<p className="pl-2">{likesCount}</p>
			</div>
		</div>
	);
}

export default Tweet;
