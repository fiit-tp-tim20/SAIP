import React from "react";
import { useTranslation } from "react-i18next";
import { useQuery } from "react-query";
import Tweet from "../components/news/Tweet";
import { getTweets } from "../mock/news";

function News() {
	const { t } = useTranslation();

	const { isLoading, data } = useQuery(["news"], () => getTweets());

	return (
		<div className="flex flex-col max-w-7xl">
			<h1 className="p-6">{t("news.title") as string}</h1>
			<div className="flex flex-row">
				<div className="max-w-xl">
					<div className="grid grid-cols-1 gap-6">
						{isLoading ? (
							<p>Loading...</p>
						) : (
							data &&
							data.map((tweet) => (
								<Tweet
									key={tweet.id}
									username={tweet.username}
									avatar={tweet.avatar}
									message={tweet.text}
									date={tweet.date}
									likesCount={tweet.likesCount}
								/>
							))
						)}
					</div>
				</div>
			</div>
		</div>
	);
}
export default News;
