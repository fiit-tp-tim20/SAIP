import React from "react";
import { Divide } from "react-feather";
import { useTranslation } from "react-i18next";
import { useQuery } from "react-query";
import Tweet from "../components/news/tweet";

function News() {
    const { t } = useTranslation();
    const text = "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Harum modi earum est corporis deserunt error hic, eum praesentium rerum minima, et culpa illo, nisi quasi dicta officia consequuntur! Nesciunt, neque.";
    
    return (
        <div className="max-w-7xl">
			<h1 className="p-6">{t("news.title") as string}</h1>
            <div className="grid grid-cols-1 gap-6">
                <Tweet username={"Pelec"} avatar={"Meh"} message={text}/>
                <Tweet username={"Floppa"} avatar={"Flop"} message={text}/>
                <Tweet username={"Jesus Christ"} avatar={"Heh"} message={text}/>
            </div>
        </div>
    );
}
export default News;