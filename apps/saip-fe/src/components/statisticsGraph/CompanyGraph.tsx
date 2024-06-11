import React from "react";
import { useTranslation } from "react-i18next";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Label } from "recharts";

type CompanyGraphProps = {
	manufactured: number[];
	price: number[];
	stored: number[];
	capacity: number[];
};

function CompanyGraph(props: CompanyGraphProps) {
	const { t } = useTranslation();
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
						<Label value={`${t("misc.round")}`} offset={-10} position="insideBottom" />
					</XAxis>
					<YAxis yAxisId="right" orientation="right">
						<Label
							value={`${t("production_sales.graph.price")}`}
							offset={0}
							position="insideRight"
							angle={-90}
						/>
					</YAxis>
					<YAxis yAxisId="left" orientation="left">
						<Label
							value={`${t("production_sales.graph.quantity")}`}
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
						name={`${t("production_sales.graph.production")}`}
						stroke="#8884d8"
						yAxisId="left"
					/>
					<Line
						type="monotone"
						dataKey="Zásoby"
						name={`${t("production_sales.graph.stocks")}`}
						stroke="#82ca9d"
						yAxisId="left"
					/>
					<Line
						type="monotone"
						dataKey="Kapacita"
						name={`${t("production_sales.graph.capacity")}`}
						stroke="#ffc658"
						yAxisId="left"
					/>
					<Line
						type="monotone"
						dataKey="Cena"
						name={`${t("production_sales.graph.price")}`}
						stroke="#000000"
						yAxisId="right"
					/>
				</LineChart>
			</ResponsiveContainer>
		</div>
	);
}

export default CompanyGraph;
