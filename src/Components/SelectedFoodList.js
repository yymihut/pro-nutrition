  import React from "react";
import { Button } from "react-bootstrap";
import MineralsTable from "./MineralsTable"; // Importăm tabelul de minerale

const SelectedFoodList = ({ selectedFoods, removeFood }) => {
  return (
    <div className="container mt-3">
      <div className="selected-foods-container">
      <h5 className="diet-info-title">Alimente Selectate</h5>
      {selectedFoods.length > 0 ? (
          <div className="row justify-content-center">
            {selectedFoods.map((item, index) => (
              <div key={index} className="col-12 food-item">
                <div className="food-name">{item.name} - {item.quantity}   g/ml</div>
                <Button className="delete-button" size="sm" onClick={() => removeFood(index)}>
                  Șterge
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-white">Nu ai selectat niciun aliment.</p>
        )}
      </div>

     
      {selectedFoods.length > 0 && (
        <MineralsTable selectedFoods={selectedFoods} />
      )}
    </div>
  );
};

 export default SelectedFoodList; 
 /*
import React from "react";
import { Button, Card } from "react-bootstrap";
import MineralsTable from "./MineralsTable"; // Importăm noua componentă

const SelectedFoodList = ({ selectedFoods, removeFood }) => {
  return (
    <div className="container mt-5 pt-5">
      <div className="row g-1 justify-content-center">
        {selectedFoods.map((item, index) => (
          <div key={index} className="col-auto p-1">
            <Card
              className="selected-food-card"
              style={{
                width: "130px",
                maxWidth: "140px",
                wordWrap: "break-word",
                padding: "4px",
                textAlign: "center",
              }}
            >
              <strong>{item.name}</strong>
              <p>{item.quantity} g/ml</p>
              <Button
                variant="danger"
                size="sm"
                onClick={() => removeFood(index)}
              >
                Șterge
              </Button>
            </Card>
          </div>
        ))}
      </div>
      {selectedFoods.length > 0 && <MineralsTable selectedFoods={selectedFoods} />}
    </div>
  );
};

export default SelectedFoodList;  */
