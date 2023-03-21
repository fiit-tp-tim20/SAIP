import React from "react";
import { useTranslation } from "react-i18next";
import { useQuery } from "react-query";
import Tweet from "../components/news/tweet";
import getTweets from "../mock/news";

function News() {
	const { t } = useTranslation();

	const { isLoading, data } = useQuery(["news"], () => getTweets());

	return (
		<div className="max-w-7xl flex flex-col justify-center">
			<h1 className="p-6">{t("news.title") as string}</h1>
			<div className="flex flex-row max-w-7xl space-x-12">
				<div className="flex flex-col space-y-2">
					<div>
						<h3>Filter</h3>
						<div className="flex flex-row space-x-2">
							<input type="radio" id="all" name="news" value="all" />
							<label htmlFor="all">{t("news.all") as string}</label>
						</div>
						<div className="flex flex-row space-x-2">
							<input type="radio" id="tweets" name="news" value="tweets" />
							<label htmlFor="tweets">{t("news.tweets") as string}</label>
						</div>
						<div className="flex flex-row space-x-2">
							<input type="radio" id="articles" name="news" value="articles" />
							<label htmlFor="articles">{t("news.articles") as string}</label>
						</div>
					</div>

					<div>
						<h3>Sort by</h3>
						<div className="flex flex-row space-x-2">
							<input type="radio" id="newest" name="news" value="newest" />
							<label htmlFor="newest">{t("news.newest") as string}</label>
						</div>
						<div className="flex flex-row space-x-2">
							<input type="radio" id="oldest" name="news" value="oldest" />
							<label htmlFor="oldest">{t("news.oldest") as string}</label>
						</div>
					</div>
				</div>

				<div className="flex flex-row col-start-2 col-span-4">
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
		</div>
	);
}
export default News;
