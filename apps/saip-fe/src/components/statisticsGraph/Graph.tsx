import React from "react";
import { useTranslation } from "react-i18next";
import { useQuery } from "react-query";
import { Chart } from "react-charts";

type LineGraphProps = {
	data: number[];
};

function LineGraph({ data: data }: LineGraphProps) {
  const chartData = React.useMemo(
    () => [
      {
        label: 'Values',
        data: data.map((value, index) => [index, value]),
      },
    ],
    [data]
  );

  const axes = React.useMemo(
    () => [
      { primary: true, type: 'linear', position: 'bottom' },
      { type: 'linear', position: 'left' },
    ],
    []
  );

  return (
    <div style={{ width: '400px', height: '300px' }}>
      <Chart data={chartData} axes={axes} />
    </div>
  );
}

export default LineGraph;
