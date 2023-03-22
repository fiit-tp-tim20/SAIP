import React from "react";
import { useTranslation } from "react-i18next";
import { useQuery } from "react-query";
import { Line } from "react-chartjs-2";
import { X } from "react-feather";

type data = {
	data: number[];
};

const LineGraph = ({ data }: data) => {
    console.log(data)
	const chartData = {
		labels: Array.from({ length: data.length }, (_, i) => i + 1),
		datasets: [
			{
				label: "Demand",
				data: data,
				fill: false,
				borderColor: "rgb(75, 192, 192)",
				tension: 0.1
			},
		],
	};






	return <Line data={chartData} />;
};

export default LineGraph;
