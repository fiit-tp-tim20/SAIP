import React from "react";
import { Line, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Label, ComposedChart } from "recharts";

type IndustryGraphProps = {
	rank: number[];
	stock_price: number[];
    num_players: number;
};

function IndustryGraph(props: IndustryGraphProps) {
    const { rank, stock_price, num_players } = props;
    const data = rank.map((value, index) => ({ x: index + 1, Poradie: value, Cena: stock_price[index] }));

    return (
        <div style={{ width: "100%", height: "250px" }}>
            <ResponsiveContainer width="100%" height="100%">
                <ComposedChart width={500} height={300} data={data} margin={{ top: 5, right: 20, left: 10, bottom: 10 }}>
                    <XAxis dataKey="x">
                        <Label value="Kolo" offset={-10} position="insideBottom" />
                    </XAxis>
                    <YAxis yAxisId="left" domain={[1, num_players]} tickCount={num_players} reversed >
                        <Label value="Poradie" offset={0} position="insideLeft" angle={-90} />
                    </YAxis>
                    <YAxis yAxisId="right" orientation="right">
                        <Label value="Cena akcie" offset={0} position="insideRight" angle={90} />
                    </YAxis>

                    <CartesianGrid stroke="#f5f5f5" />

                    <Tooltip />
                    <Legend verticalAlign="top"/>
                    <Line type="monotone" dataKey="Poradie" fill="#8884d8" yAxisId="left" />
                    <Line type="monotone" dataKey="Cena akcie" stroke="#82ca9d" yAxisId="right" />
                </ComposedChart>
            </ResponsiveContainer>
        </div>
    );
}

export default IndustryGraph;