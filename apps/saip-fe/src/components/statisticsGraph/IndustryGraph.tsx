import React from "react";
import { Line, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Label, ComposedChart } from "recharts";

type IndustryGraphProps = {
	rank: number[];
	stock_price: number[];
};

function IndustryGraph(props: IndustryGraphProps) {
    const { rank, stock_price } = props;
    const data = rank.map((value, index) => ({ x: index + 1, Poradie: value, Cena: stock_price[index] }));

    return (
        <div style={{ width: "100%", height: "250px" }}>
            <ResponsiveContainer width="100%" height="100%">
                <ComposedChart width={500} height={300} data={data} margin={{ top: 5, right: 20, left: 10, bottom: 10 }}>
                    <XAxis dataKey="x">
                        <Label value="Kolo" offset={-10} position="insideBottom" />
                    </XAxis>
                    <YAxis>
                    </YAxis>
                    <CartesianGrid stroke="#f5f5f5" />
                    <Tooltip />
                    <Legend verticalAlign="top"/>
                    <Bar type="monotone" dataKey="Poradie" fill="#8884d8" yAxisId={0} />
                    <Line type="monotone" dataKey="Cena" stroke="#82ca9d" yAxisId={0} />
                </ComposedChart>
            </ResponsiveContainer>
        </div>
    );
}

export default IndustryGraph;