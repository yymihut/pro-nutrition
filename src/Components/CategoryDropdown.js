import React, { useState, useEffect, useContext } from "react";
import { Form, Button, Container } from "react-bootstrap";
import { LanguageContext } from "../LanguageContext";

const CategoryDropdown = ({ foods, addFood, resetSelections }) => {
  const categories = [...new Set(foods.map((food) => food.categorie))];
  const [selectedFoods, setSelectedFoods] = useState({});
  const [quantities, setQuantities] = useState({});
  const { language } = useContext(LanguageContext); // 🔥 Obținem limba curentă

  // 🔹 Detectăm resetarea și curățăm câmpurile
  useEffect(() => {
    setSelectedFoods({});
    setQuantities({});
  }, [resetSelections]); // Se reactivează de fiecare dată când `resetSelections` este apelat

  const handleSelect = (category, foodName) => {
    setSelectedFoods((prev) => ({ ...prev, [category]: foodName }));
    if (!foodName) {
      setQuantities((prev) => ({ ...prev, [category]: "" }));
    }
  };

  const handleQuantityChange = (category, value) => {
    const numValue = value.replace(/[^0-9]/g, "").slice(0, 5);
    setQuantities((prev) => ({ ...prev, [category]: numValue }));
  };

  const handleAddFood = (category) => {
    const selectedFood = foods.find((f) => f.name === selectedFoods[category]);
    if (selectedFood && quantities[category]) {
      addFood({ ...selectedFood }, parseInt(quantities[category]));
      setSelectedFoods((prev) => ({ ...prev, [category]: "" }));
      setQuantities((prev) => ({ ...prev, [category]: "" }));
    }
  };

  return (
    <Container className="mt-2 category-container">
      {categories.map((category) => (
        <div key={category} className="category-card">
          <h6 className="text-center">{category}</h6>

          <div className="food-selection">
            <Form.Select
              value={selectedFoods[category] || ""}
              onChange={(e) => handleSelect(category, e.target.value)}
              className="form-select"
            >
              <option value="">
                {language === "ro" ? "Alege un aliment" : "Choose a food"}
              </option>
              {foods
                .filter((food) => food.categorie === category)
                .map((food) => (
                  <option key={food.id} value={food.name}>
                    {food.name}
                  </option>
                ))}
            </Form.Select>

            <Form.Control
              type="text"
              inputMode="numeric"
              className="quantity-input"
              placeholder="g/ml"
              value={quantities[category] || ""}
              onChange={(e) => handleQuantityChange(category, e.target.value)}
              disabled={!selectedFoods[category]}
            />
          </div>

          <div className="button-container">
            <Button
              className="custom-button"
              disabled={!selectedFoods[category] || !quantities[category]}
              onClick={() => handleAddFood(category)}
            >
              {language === "ro" ? "Adaugă" : "Add"}
            </Button>
          </div>
        </div>
      ))}
    </Container>
  );
};

export default CategoryDropdown;
