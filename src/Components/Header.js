import React, { useState } from "react";
import { Form, Button, Badge, ListGroup } from "react-bootstrap";

const Header = ({
  headerRef,
  foods,
  search,
  setSearch,
  quantity,
  setQuantity,
  addFood,
  totalCalories,
  totalProtein,
  totalCarbs,
  totalFat,
  totalFiber,
  dietType, // 🔹 Adăugăm acest parametru
  proteinPercentage,
  carbsPercentage,
  fatPercentage,
}) => {
  const [filteredFoods, setFilteredFoods] = useState([]);

  const handleSearchChange = (e) => {
    const query = e.target.value;
    if (/^[a-zA-ZăâîșțĂÂÎȘȚ ]*$/.test(query) || query === "") {
      setSearch(query);
      if (query.length > 1) {
        const results = foods.filter((food) =>
          food.name.toLowerCase().includes(query.toLowerCase())
        );
        setFilteredFoods(results);
      } else {
        setFilteredFoods([]); // 🟢 Dacă nu sunt rezultate, ascunde lista
      }
    }
  };

  const handleSelectFood = (food) => {
    setSearch(food.name);
    setFilteredFoods([]);
  };

  return (
    <header
      foods={foods}
      search={search}
      setSearch={setSearch}
      quantity={quantity}
      setQuantity={setQuantity}
      addFood={addFood}
      totalCalories={
        Number(totalCalories) ? Number(totalCalories).toFixed(1) : "0.0"
      }
      totalProtein={
        Number(totalProtein) ? Number(totalProtein).toFixed(1) : "0.0"
      }
      totalCarbs={Number(totalCarbs) ? Number(totalCarbs).toFixed(1) : "0.0"}
      totalFat={Number(totalFat) ? Number(totalFat).toFixed(1) : "0.0"}
      totalFiber={Number(totalFiber) ? Number(totalFiber).toFixed(1) : "0.0"}
      dietType={dietType} // 🔹 Trimite rezultatul funcției către Header.js
      ref={headerRef}
      className="header"
    >
      <h1 className="header-title">Calculator Nutrițional</h1>
      <p className="header-subtitle">- norme UE, surse EFSA</p>

      <div className="header-controls">
        {/* Căutare aliment */}
        <div className="position-relative">
          <Form.Control
            type="text"
            placeholder="Caută aliment..."
            value={search}
            onChange={handleSearchChange}
            className="form-control-sm"
            style={{ width: "300px", fontSize: "14px" }}
          />
          {filteredFoods.length > 0 && (
            <ListGroup
            className="position-absolute search-suggestions shadow rounded"
            style={{
              zIndex: 1000,
              top: "100%", // ✅ Lista este plasată corect sub input
              left: 0,
              minWidth: "250px", // ✅ Asigură spațiu pentru text
              maxWidth: "500px", // ✅ Evită ca lista să fie prea lată
              border: "1px solid #ddd",
              whiteSpace: "normal", // ✅ Permite textului să se afișeze pe mai multe linii
              overflowWrap: "break-word", // ✅ Previne tăierea textului
            }}
            >
              {filteredFoods.map((food, index) => (
                <ListGroup.Item
                  key={index}
                  action
                  onClick={() => handleSelectFood(food)}
                  className="text-dark px-3 py-1"
                  style={{
                    fontSize: "16px",
                    whiteSpace: "normal", // ✅ Elimină tăierea textului
                    overflow: "visible", // ✅ Permite afișarea completă
                    textOverflow: "unset", // ✅ Evită ascunderea textului
                    display: "block", // ✅ Forțează wrap pe text
                  }}
                >
                  {food.name}
                </ListGroup.Item>
              ))}
            </ListGroup>
          )}
        </div>

        {/* Cantitate */}
        <Form.Control
          type="number"
          placeholder="Cant (g/ml)"
          
          value={quantity}
          onChange={(e) => {
            const value = parseInt(e.target.value, 10);
            if (!isNaN(value) && value > 0) {
              setQuantity(value);
            } else {
              setQuantity(""); // Resetăm dacă valoarea este invalidă
            }
          }}
          className="form-control-sm"
          style={{ width: "80px", fontSize: "14px" }}
        />

        {/* Buton „Adaugă” și Tipul dietei */}
        <div className="d-flex align-items-center">
          <Button
            variant="success"
            size="sm"
            disabled={!search || !quantity}
            onClick={() => {
              const selectedFood = foods.find(
                (food) => food.name.toLowerCase() === search.toLowerCase()
              );
              if (selectedFood) {
                addFood({ ...selectedFood }, parseInt(quantity));
                setSearch("");
                setQuantity("");
              }
            }}
          >
            Adaugă
          </Button>

          <span
            className="badge p-2 ms-2 custom-badge-diet"
            style={{ fontSize: "14px" }}
          >
            {dietType}
          </span>
        </div>
      </div>

      <div className="nutrition-info">
        <div className="col">
          Proteine:{" "}
          <Badge bg="light" text="dark">
            {!isNaN(Number(totalProtein))
              ? Number(totalProtein).toFixed(1)
              : "0.0"}{" "}
            g
            <span className="text-muted">
              {" "}
              ({proteinPercentage.toFixed(1)}%)
            </span>
          </Badge>
        </div>
        <div className="col">
          Carbohidrați:{" "}
          <Badge bg="light" text="dark">
            {!isNaN(Number(totalCarbs)) ? Number(totalCarbs).toFixed(1) : "0.0"}{" "}
            g
            <span className="text-muted"> ({carbsPercentage.toFixed(1)}%)</span>
          </Badge>
        </div>
        <div className="col">
          Grăsimi:{" "}
          <Badge bg="light" text="dark">
            {!isNaN(Number(totalFat)) ? Number(totalFat).toFixed(1) : "0.0"} g
            <span className="text-muted"> ({fatPercentage.toFixed(1)}%)</span>
          </Badge>
        </div>
        <div className="col">
          Fibre:{" "}
          <Badge bg="light" text="dark">
            {!isNaN(Number(totalFiber)) ? Number(totalFiber).toFixed(1) : "0.0"}{" "}
            g
          </Badge>
        </div>
        <div className="col font-weight-bold">
          Total Kcal:{" "}
          <Badge bg="warning" text="dark">
            {!isNaN(Number(totalCalories))
              ? Number(totalCalories).toFixed(1)
              : "0.0"}
          </Badge>
        </div>
      </div>
    </header>
  );
};

export default Header;
