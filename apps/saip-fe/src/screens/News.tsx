import React from "react";
import { useTranslation } from "react-i18next";
import { useQuery } from "react-query";

function News() {
    const { t } = useTranslation();
    
    return (
        <div className="max-w-7xl">
			<h1 className="p-6">{t("news.title") as string}</h1>
            <div className="grid grid-cols-1 ">
        </div>
                <div className="flex flex-col background-container p-3 rounded-2xl">

                </div>
            </div>
    );
    
}
export default News;