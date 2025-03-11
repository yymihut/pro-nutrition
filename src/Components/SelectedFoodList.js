import React from "react";
import { Button, Card } from "react-bootstrap";

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
    </div>
  );
};

export default SelectedFoodList;
