import React, { useState, useRef, useContext } from "react";
import { Form, Button, Badge, ListGroup } from "react-bootstrap";
import { LanguageContext } from "../LanguageContext";
import { translations } from "../translations";
import useClickOutside from "../hooks/useClickOutside";

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
  dietType,
  proteinPercentage,
  carbsPercentage,
  fatPercentage,
  resetSelections,
  onSearchInteractionEnd,
}) => {
  const { language, toggleLanguage } = useContext(LanguageContext);
  const [filteredFoods, setFilteredFoods] = useState([]);
  const searchContainerRef = useRef(null); // 🔹 Referință pentru zona de căutare
  //const [foodSelected, setFoodSelected] = useState(false);
  // 🔹 Traduceri pentru textele din interfață
  const t = (key) => translations[key]?.[language] || translations[key]?.["en"];
  
  // 🔹 Închidem lista când utilizatorul face click în afara inputului
  useClickOutside(searchContainerRef, () => {
    setFilteredFoods([]);

    // Mutăm logica de reset în App (nu aici)
    onSearchInteractionEnd?.();
  });

  const handleSearchChange = (e) => {
    const rawQuery = e.target.value;
    const query = rawQuery.replace(/\s+/g, " "); // normalizează spațiile multiple

   // setFoodSelected(false); // ⚠️ resetăm starea de aliment selectat

    if (/^[a-zA-ZăâîșțĂÂÎȘȚ ,.'-]*$/.test(query) || query === "") {
      setSearch(query);

      if (query.trim().length > 1) {
        const languageKey = `name_${language?.toUpperCase() || "EN"}`;

        const results = foods.filter((food) => {
          if (!food || !food[languageKey]) return false;
          return food[languageKey].toLowerCase().includes(query.toLowerCase());
        });

        setFilteredFoods(results);
      } else {
        setFilteredFoods([]);
      }
    }
  };

  const handleSelectFood = (food) => {
    setSearch(food[`name_${language.toUpperCase()}`]);
    setFilteredFoods([]);
    //setFoodSelected(true); // ✅ Aliment selectat
  };

  return (
    <header ref={headerRef} className="header">
      <div className="header-title-container">
        <p className="header-subtitle">
          {t("subtitle_header")}{" "}
        </p>
        <h1 className="header-title">
        {t("title_header")}{" "}
        </h1>
        <div className="language-switcher">
          {["ro", "en", "fr", "de"].map((lang) => (
            <button
              key={lang}
              className={`language-button ${lang} ${
                language === lang ? "active" : ""
              }`}
              onClick={() => toggleLanguage(lang)}
              aria-label={`Selectează limba ${lang.toUpperCase()}`}
            ></button>
          ))}
          <span className="language-label">
          {t("language_label")}
          </span>
        </div>  
      </div>
      <div className="header-controls">
        {/* Căutare aliment */}
        <div className="position-relative" ref={searchContainerRef}>
          <Form.Control
            type="text"
            placeholder={t("search_placeholder")}
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
                  {food[`name_${language.toUpperCase()}`]}
                </ListGroup.Item>
              ))}
            </ListGroup>
          )}
        </div>

        {/* Cantitate */}
        <Form.Control
          type="text" // ✅ permite orice, inclusiv „125.5” sau „125,5”
          placeholder="g/ml"
          value={quantity}
          onChange={(e) => {
            let value = e.target.value.replace(",", "."); // înlocuiește „,” cu „.”
            if (/^\d*\.?\d*$/.test(value)) {
              setQuantity(value);
            }
          }}
          className="form-control"
          style={{ width: "60px", fontSize: "14px" }}
        />

        {/* Buton „Adaugă” și Tipul dietei */}
        <div className="d-flex align-items-center">
          <Button
            variant="success"
            size="sm"
            disabled={!search || !quantity}
            onClick={() => {
              const selectedFood = foods.find(
                (food) =>
                  food[`name_${language.toUpperCase()}`]?.toLowerCase() ===
                  search.toLowerCase()
              );
              if (selectedFood) {
                addFood({ ...selectedFood }, parseInt(quantity));
                setSearch("");
                setQuantity("");
              }
            }}
          >
           {t("add_food_button")} 🍽️
           {/* // reset buton */}
          </Button>
          <span
            className="badge p-2 ms-2 custom-badge-diet"
            style={{ fontSize: "14px" }}
          >
            {dietType}
          </span>
          <Button className="reset-button" onClick={resetSelections}>
          {t("reset_button")}
          </Button>
        </div>
      </div>

      <div className="nutrition-info">
        <div className="col">
        {t("total_proteins")} :{" "}
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
        {t("total_carbs")}:{" "}
          <Badge bg="light" text="dark">
            {!isNaN(Number(totalCarbs)) ? Number(totalCarbs).toFixed(1) : "0.0"}{" "}
            g
            <span className="text-muted"> ({carbsPercentage.toFixed(1)}%)</span>
          </Badge>
        </div>
        <div className="col">
        {t("total_fats")}:{" "}
          <Badge bg="light" text="dark">
            {!isNaN(Number(totalFat)) ? Number(totalFat).toFixed(1) : "0.0"} g
            <span className="text-muted"> ({fatPercentage.toFixed(1)}%)</span>
          </Badge>
        </div>
        <div className="col">
        {t("total_fiber")}:{" "}
          <Badge bg="light" text="dark">
            {!isNaN(Number(totalFiber)) ? Number(totalFiber).toFixed(1) : "0.0"}{" "}
            g
          </Badge>
        </div>
        <div className="col font-weight-bold">
        {t("total_calories")}:{" "}
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


// {t("total_calories")}
// import { translations } from "../translations";