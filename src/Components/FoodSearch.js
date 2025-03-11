import React, { useState } from "react";
import { Form, ListGroup, Button } from "react-bootstrap";

const FoodSearch = ({ foods, addFood }) => {
  const [search, setSearch] = useState("");
  const [quantity, setQuantity] = useState("");
  const [selectedFood, setSelectedFood] = useState(null);

  const handleSelectFood = (food) => {
    setSelectedFood(food);
    setSearch(food.name);
  };

  return (
    <div className="container mt-5 pt-5">
      <Form.Control
        type="text"
        placeholder="Caută aliment..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      {search && (
        <ListGroup>
          {foods
            .filter((food) => food.name.toLowerCase().includes(search.toLowerCase()))
            .map((food) => (
              <ListGroup.Item key={food.id} onClick={() => handleSelectFood(food)}>
                {food.name}
              </ListGroup.Item>
            ))}
        </ListGroup>
      )}
      {selectedFood && (
        <div className="mt-2 d-flex align-items-center">
          <Form.Control
            type="number"
            placeholder="Cantitate (g/ml)"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
          />
          <Button variant="success" disabled={!quantity} onClick={() => addFood(selectedFood, quantity)}>Adaugă</Button>
        </div>
      )}
    </div>
  );
};

export default FoodSearch;
