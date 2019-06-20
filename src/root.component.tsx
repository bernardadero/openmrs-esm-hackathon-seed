import React from "react";
import dayjs from "dayjs";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip
} from "recharts";

export default function Vitals(props: VitalsParcelProps) {
  const [weight, setWeight] = React.useState([]);
  const data = [{ name: "Page A", uv: 400, pv: 2400, amt: 2400 }];

  React.useEffect(() => {
    getLatestWeight(props.patientUuid).then(obs => {
      setWeight(obs.results);
    });
  }, []);

  return (
    <div className="card">
      <div className="card-header ">
        <h5 className="card-title"> Weight Graph</h5>
      </div>
      {weight ? renderWeight() : renderLoader()}
    </div>
  );

  function renderLoader() {
    return <div>Loading...</div>;
  }

  function renderWeight() {
    const patientWeight = weight;
    const listItems = patientWeight.map(obs => (
      <li>
        <span>{obs.value}</span>{" "}
        <span>{dayjs(obs.obsDatetime).format("YYYY-MM-DD")}</span>
      </li>
    ));
    return <div>{graph()}</div>;

    function graph() {
      const data = patientWeight.map(obs => ({
        name: dayjs(obs.obsDatetime).format("YYYY-MM-DD"),
        uv: obs.value
      }));

      const renderLineChart = (
        <LineChart
          width={400}
          height={300}
          data={data}
          margin={{ top: 5, right: 20, bottom: 5, left: 0 }}
        >
          <Line type="monotone" dataKey="uv" stroke="#8884d8" />
          <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
        </LineChart>
      );
      return renderLineChart;
    }
  }
}

function getObsByconceptId(conceptId, patientUuid) {
  return fetch(
    `/openmrs/ws/rest/v1/obs?concept=${conceptId}&patient=${patientUuid}&v=full`
  ).then(resp => {
    if (resp.ok) {
      return resp.json();
    } else {
      throw Error(`Cannot fetch obs '${resp.status}'`);
    }
  });
}

function getLatestWeight(patientUuid) {
  const weightConcept = "5089AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA";
  return getObsByconceptId(weightConcept, patientUuid);
}

type VitalsParcelProps = {
  patientUuid: string;
};
