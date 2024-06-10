import React from "react";
import { useTranslation } from "react-i18next";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Label } from "recharts";

type MarketingGraphProps = {
	demand: number[];
	volume: number[];
	orders_fulfilled: number[];

};

function MarketingGraph({volume, demand, orders_fulfilled }: MarketingGraphProps) {
	const { t } = useTranslation();
	const chartData = demand.map((value, index) => ({ x: index+1, Dopyt: value, Volume: volume[index], Orders: orders_fulfilled[index] }));
	return (
		<div style={{ width: '100%', height: '250px' }}>
			<ResponsiveContainer width="100%" height="100%">
				<LineChart
					width={500}
					height={300}
					data={chartData}
					margin={{ top: 5, right: 20, left: 10, bottom: 10 }}
				>
					<XAxis dataKey="x">
						<Label value={`${t("misc.round")}`} offset={-10} position="insideBottom" />
					</XAxis>
					<YAxis>
						<Label value={`${t("marketing.graph.pieces")}`} offset={0} position="insideLeft" angle={-90} />
					</YAxis>
					<CartesianGrid stroke="#f5f5f5" />
					<Tooltip />
					<Legend verticalAlign="top" />
					<Line type="monotone" dataKey="Dopyt" stroke="#8884d8" yAxisId={0} name={`${t("marketing.graph.enquiry")}`} />
					<Line type="monotone" dataKey="Volume" stroke="#82ca9d" yAxisId={0} name={`${t("marketing.graph.volume")}`} />
					<Line type="monotone" dataKey="Orders" stroke="#ffca9d" yAxisId={0} name={`${t("marketing.graph.orders")}`} />
				</LineChart>
			</ResponsiveContainer>
		</div>
	);
}

export default MarketingGraph;
