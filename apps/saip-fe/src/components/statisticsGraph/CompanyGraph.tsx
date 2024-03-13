import React from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Label } from "recharts";

type CompanyGraphProps = {
	manufactured: number[];
	price: number[];
	stored: number[];
	capacity: number[];
};

function CompanyGraph(props: CompanyGraphProps) {
	const { manufactured, price, stored, capacity } = props;

	const data = manufactured.map((value, index) => ({
		x: index + 1,
		Vyrobené: value,
		Zásoby: stored[index],
		Cena: price[index],
		Kapacita: capacity[index],
	}));

	return (
		<div style={{ width: '100%', height: '250px' }}>
			<ResponsiveContainer width="100%" height="100%">
				<LineChart
					width={500}
					height={300}
					data={data}
					margin={{ top: 5, right: 20, left: 20, bottom: 10 }}
				>
					<XAxis dataKey="x">
						<Label value="Kolo" offset={-10} position="insideBottom" />
					</XAxis>
					<YAxis yAxisId="right" orientation="right">
						<Label
							value="Cena"
							offset={0}
							position="insideRight"
							angle={-90}
						/>
					</YAxis>
					<YAxis yAxisId="left" orientation="left">
						<Label
							value="Množstvo"
							offset={0}
							position="insideLeft"
							angle={-90}
						/>
					</YAxis>
					<CartesianGrid stroke="#f5f5f5" />
					<Tooltip />
					<Legend verticalAlign="top" />
					<Line
						type="monotone"
						dataKey="Vyrobené"
						name="Vyrobené"
						stroke="#8884d8"
						yAxisId="left"
					/>
					<Line
						type="monotone"
						dataKey="Zásoby"
						name="Zásoby"
						stroke="#82ca9d"
						yAxisId="left"
					/>
					<Line
						type="monotone"
						dataKey="Kapacita"
						name="Kapacita"
						stroke="#ffc658"
						yAxisId="left"
					/>
					<Line
						type="monotone"
						dataKey="Cena"
						name="Cena"
						stroke="#a658"
						yAxisId="right"
					/>
				</LineChart>
			</ResponsiveContainer>
		</div>
	);
}

export default CompanyGraph;
