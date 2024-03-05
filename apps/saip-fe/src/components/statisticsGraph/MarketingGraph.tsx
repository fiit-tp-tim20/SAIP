import React from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Label } from "recharts";

type MarketingGraphProps = {
	demand: number[];
	volume: number[];

};

function MarketingGraph({volume, demand }: MarketingGraphProps) {
	const chartData = demand.map((value, index) => ({ x: index+1, Dopyt: value, Volume: volume[index] }));
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
						<Label value="Kolo" offset={-10} position="insideBottom" />
					</XAxis>
					<YAxis>
						<Label value="Kusy" offset={0} position="insideLeft" angle={-90} />
					</YAxis>
					<CartesianGrid stroke="#f5f5f5" />
					<Tooltip />
					<Legend verticalAlign="top" />
					<Line type="monotone" dataKey="Dopyt" stroke="#8884d8" yAxisId={0} name="Dopyt" />
					<Line type="monotone" dataKey="Volume" stroke="#82ca9d" yAxisId={0} name="Počet vyrobených kusov" />
				</LineChart>
			</ResponsiveContainer>
		</div>
	);
}

export default MarketingGraph;
