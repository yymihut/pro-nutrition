import React, { useState, useEffect, useRef } from "react";
import { Form, ListGroup, Button } from "react-bootstrap";

const FoodSearch = ({ foods, addFood }) => {
  const [search, setSearch] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [quantity, setQuantity] = useState("");
  const [selectedFood, setSelectedFood] = useState(null);
  const containerRef = useRef(null);

  const handleSelectFood = (food) => {
    setSelectedFood(food);
    setSearch(food.name);
    setShowSuggestions(false); // ✅ Ascunde lista după selectare
  };

  // ✅ Închide lista când se face clic în afara elementului
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="container mt-3 position-relative" ref={containerRef} style={{ maxWidth: "500px" }}>
      {/* Câmp de căutare */}
      <Form.Control
        type="text"
        placeholder="Caută aliment..."
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          setShowSuggestions(true);
        }}
        onFocus={() => setShowSuggestions(true)} // ✅ Lista apare la focus
      />

      {/* Lista de sugestii */}
      {showSuggestions && search && (
        <ListGroup className="search-suggestions">
          {foods
            .filter((food) => food.name.toLowerCase().includes(search.toLowerCase()))
            .map((food) => (
              <ListGroup.Item
                key={food.id}
                onClick={() => handleSelectFood(food)}
                className="suggestion-item"
              >
                {food.name}
              </ListGroup.Item>
            ))}
        </ListGroup>
      )}

      {/* Câmp pentru cantitate + buton Adaugă */}
      {selectedFood && (
        <div className="mt-2 d-flex align-items-center">
          <Form.Control
            type="number"
            placeholder="g/ml"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            className="quantity-input"
          />
          <Button variant="success" disabled={!quantity} onClick={() => addFood(selectedFood, quantity)}>
            Adaugă
          </Button>
        </div>
      )}
    </div>
  );
};

export default FoodSearch;
