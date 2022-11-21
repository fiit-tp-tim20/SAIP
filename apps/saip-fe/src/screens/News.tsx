import React from "react";
import { useTranslation } from "react-i18next";
import { useQuery } from "react-query";
import Tweet from "../components/news/tweet";
import { getTweets } from "../mock/news";

function News() {
	const { t } = useTranslation();

	const { isLoading, data } = useQuery(["news"], () => getTweets());

	return (
		<div className="flex flex-col max-w-7xl">
			<h1 className="p-6">{t("news.title") as string}</h1>
			<div className="grid grid-cols-6 gap-6 px-6 max-w-7xl">
				<div className="dropdown dropdown-end col-start-5">
					<label tabIndex={0} className="btn btn-primary m-1">
						Filter
					</label>
					<ul
						tabIndex={0}
						className="dropdown-content menu p-2 shadow  bg-gray-200 dark:bg-[#444444] rounded-box w-52"
					>
						<li>
							<a>Item 1</a>
						</li>
						<li>
							<a>Item 2</a>
						</li>
						<li>
							<a>Item 3</a>
						</li>
						<li>
							<a>Item 4</a>
						</li>
					</ul>
				</div>
				<ul className="menu background-container rounded-2xl w-1000 h-fit col-start-1 col-span-1">
					<li>
						<a>Item 1</a>
					</li>
					<li>
						<a>Item 2</a>
					</li>
					<li>
						<a>Item 3</a>
					</li>
					<li>
						<a>Item 4</a>
					</li>
					<li>
						<a>Item 5</a>
					</li>
					<li>
						<a>Item 6</a>
					</li>
					<li>
						<a>Item 7</a>
					</li>
				</ul>

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
