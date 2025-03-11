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
  proteinPercentage, // ✅ Adăugat
  carbsPercentage, // ✅ Adăugat
  fatPercentage // ✅ Adăugat
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
      className="bg-dark text-white p-2 fixed-top shadow"
    >
      <div className="header">
        <h4 className="mb-1">Calculator Nutrițional Profesional</h4>

        <div className="d-flex justify-content-center align-items-center flex-wrap gap-2 mt-3">
          {/* Căutare aliment */}
          <div className="position-relative">
            <Form.Control
              type="text"
              placeholder="Caută aliment..."
              value={search}
              onChange={handleSearchChange}
              className="form-control-sm"
              style={{ width: "200px", fontSize: "14px" }}
            />
            {filteredFoods.length > 0 && (
              <ListGroup
                className="position-absolute w-auto bg-white shadow rounded"
                style={{
                  zIndex: 1000,
                  top: "100%", // Plasează lista direct sub input
                  left: 0,
                  minWidth: "200px", // Dimensiune minimă
                  maxWidth: "300px", // Evită să fie prea mare
                  border: "1px solid #ddd",
                }}
              >
                {filteredFoods.map((food, index) => (
                  <ListGroup.Item
                    key={index}
                    action
                    onClick={() => handleSelectFood(food)}
                    className="text-dark px-3 py-1"
                    style={{
                      fontSize: "14px",
                      whiteSpace: "nowrap", // Evită textul prea lung să intre pe două linii
                      overflow: "hidden",
                      textOverflow: "ellipsis",
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
            placeholder="Cantitate (g/ml)"
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
            style={{ width: "150px", fontSize: "14px" }}
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
              className="badge bg-success text-white p-2 ms-2"
              style={{ fontSize: "14px" }}
            >
              {dietType}
            </span>
          </div>
        </div>

        <div className="row mt-4 mb-3">
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
              {!isNaN(Number(totalCarbs))
                ? Number(totalCarbs).toFixed(1)
                : "0.0"}{" "}
              g
              <span className="text-muted">
                {" "}
                ({carbsPercentage.toFixed(1)}%)
              </span>
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
              {!isNaN(Number(totalFiber))
                ? Number(totalFiber).toFixed(1)
                : "0.0"}{" "}
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
      </div>
    </header>
  );
};

export default Header;
