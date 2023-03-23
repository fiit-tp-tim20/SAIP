import React from "react";
import { useTranslation } from "react-i18next";
import { useQuery } from "react-query";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

type LineGraphProps = {
  data: number[];
};

function LineGraph({ data }: LineGraphProps) {
  console.log(data);
  return (
    <div style={{ width: '100%', height: '100%' }}>
      <LineChart
        width={500}
        height={300}
        data={data}
        margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
      >
        <XAxis dataKey="index" />
        <YAxis />
        <CartesianGrid stroke="#f5f5f5" />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="value" stroke="#ff7300" yAxisId={0} />
      </LineChart>
    </div>
  );
}

export default LineGraph;