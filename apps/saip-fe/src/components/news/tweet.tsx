import React from "react";

type Props = {
	username: string;
	avatar: string;
    message: string;
};

function Tweet(props: Props) {
	const { username, avatar, message  } = props;

	return (
        <div className="flex flex-col background-container p-3 rounded-2xl">
            <div className="flex flex-row">
                    <div className="w-10 h-10 rounded-full bg-gray-200">
                        <img src={`https://avatars.dicebear.com/api/miniavs/${avatar}.png`} alt="person" />
                    </div>
                    <h2 className="pl-2">{username}</h2>
            </div>
                <p>{message}</p>    
        </div>
    );
}

export default Tweet;
