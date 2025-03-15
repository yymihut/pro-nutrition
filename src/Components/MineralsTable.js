import React from "react";
import { Table, Container } from "react-bootstrap";
import nutrientsDailyIntake from "../Data/nutrients_daily_intake.json";

const MineralsTable = ({ selectedFoods }) => {
  const mineralKeys = Object.keys(nutrientsDailyIntake);

  // Calculăm totalul fiecărui mineral
  const mineralTotals = mineralKeys.reduce((totals, mineral) => {
    totals[mineral] = selectedFoods.reduce((sum, food) => {
      return sum + ((food[mineral] || 0) * food.quantity) / 100;
    }, 0);
    return totals;
  }, {});
/* */
  return (
    <Container className="mt-4 text-center">
      <h5 className="diet-info-title">Total minerale & vitamine</h5>
      <Table striped bordered hover className="minerals-table table-sm table-dark" responsive>
        <thead>
          <tr>
            <th>Mineral</th>
            <th>Cantitate</th>
            <th>% DZR</th>
          </tr>
        </thead>
        <tbody>
          {mineralKeys.map((mineral) => {
            const total = mineralTotals[mineral] || 0;
            const dzr = nutrientsDailyIntake[mineral]?.daily_recommended_intake;
            const percent = dzr && dzr !== "None" ? ((total / dzr) * 100).toFixed(1) + "%" : "N/A";

            return (
              <tr key={mineral}>
                <td>{mineral}</td>
                <td>{total.toFixed(2)}</td>
                <td>{percent}</td>
              </tr>
            );
          })}
        </tbody>
      </Table>
    </Container>
  );
};

export default MineralsTable;
