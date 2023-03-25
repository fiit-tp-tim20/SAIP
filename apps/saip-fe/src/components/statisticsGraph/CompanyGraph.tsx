import React from "react";
import { useTranslation } from "react-i18next";
import { useQuery } from "react-query";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

type CompanyGraphProps = {
    manufactured: number[];
    sold: number[];

};

function CompanyGraph(props : CompanyGraphProps) {
  const { manufactured, sold } = props;
    const data = manufactured.map((value, index) => ({ x: index + 1, Vyrobené: value, Predané: sold[index] }));

  console.log(data);
  return (
    <div style={{ width: '100%', height: '250px' }}>
      <ResponsiveContainer width="100%" height="100%">
      <LineChart
        width={500}
        height={300}
        data={data}
        margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
      >
        <XAxis dataKey="x"/>
        <YAxis />
        <CartesianGrid stroke="#f5f5f5" />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="Vyrobené" stroke="#8884d8" yAxisId={0} />
        <Line type="monotone" dataKey="Predané" stroke="#82ca9d" yAxisId={0} />
      </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default CompanyGraph;