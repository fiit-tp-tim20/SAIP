import React from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

type MarketingGraphProps = {
	data: number[];
};

function MarketingGraph({ data }: MarketingGraphProps) {
	const chartData = data.map((value, index) => ({ x: index + 1, Dopyt: value }));
	return (
		<div style={{ width: "100%", height: "250px" }}>
			<ResponsiveContainer width="100%" height="100%">
				<LineChart
					width={500}
					height={300}
					data={chartData}
					margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
				>
					<XAxis dataKey="x" />
					<YAxis />
					<CartesianGrid stroke="#f5f5f5" />
					<Tooltip />
					<Legend />
					<Line type="monotone" dataKey="Dopyt" stroke="#8884d8" yAxisId={0} />
				</LineChart>
			</ResponsiveContainer>
		</div>
	);
}

export default MarketingGraph;
