import React, { useState } from "react";
import { Card, Form, Button } from "react-bootstrap";

const CategoryDropdown = ({ foods, addFood }) => {
  const categories = [...new Set(foods.map((food) => food.categorie))];
  const [selectedFoods, setSelectedFoods] = useState({});
  const [quantities, setQuantities] = useState({});

  const handleSelect = (category, foodName) => {
    setSelectedFoods((prev) => ({ ...prev, [category]: foodName }));

    // 🔹 Dacă utilizatorul alege din nou "Alege un aliment", resetează câmpul de cantitate
    if (!foodName) {
      setQuantities((prev) => ({ ...prev, [category]: "" }));
    }
  };

  const handleQuantityChange = (category, value) => {
    const numValue = value.replace(/[^0-9]/g, ""); // Elimină orice caracter care nu e cifră
    setQuantities((prev) => ({ ...prev, [category]: numValue }));
  };

  const handleAddFood = (category) => {
    const selectedFood = foods.find((f) => f.name === selectedFoods[category]);
    if (selectedFood && quantities[category]) {
      addFood({ ...selectedFood }, parseInt(quantities[category])); // 🔹 Transmitem corect datele spre App.js
      setSelectedFoods((prev) => ({ ...prev, [category]: "" }));
      setQuantities((prev) => ({ ...prev, [category]: "" }));
    }
  };

  return (
    <div className="container mt-3">
      <div className="row justify-content-center">
        {categories.map((category) => (
          <div key={category} className="col-md-3 col-sm-6 mb-3">
            <Card
              className="p-2 shadow-lg"
              style={{ maxWidth: "250px", margin: "0 auto" }}
            >
              <h6 className="text-center">{category}</h6>
              <Form.Select
                value={selectedFoods[category] || ""}
                onChange={(e) => handleSelect(category, e.target.value)}
              >
                <option value="">Alege un aliment</option>
                {foods
                  .filter((food) => food.categorie === category)
                  .map((food) => (
                    <option key={food.id} value={food.name}>
                      {food.name}
                    </option>
                  ))}
              </Form.Select>
              <Form.Control
                type="text" // Folosim "text" pentru a controla inputul
                inputMode="numeric" // Afișează tastatura numerică pe mobile
                placeholder="Cantitate (g/ml)"
                className="mt-2"
                value={quantities[category] || ""}
                onChange={(e) => handleQuantityChange(category, e.target.value)}
                disabled={!selectedFoods[category]}
              />
              <Button
                className="custom-button"
                variant="primary"
                disabled={!selectedFoods[category] || !quantities[category]}
                onClick={() => handleAddFood(category)}
              >
                Adaugă
              </Button>
            </Card>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoryDropdown;
