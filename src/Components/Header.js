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
  selectedCategory,
  setSelectedCategory,
  removeAds,
}) => {
  const { language, toggleLanguage } = useContext(LanguageContext);
  const [filteredFoods, setFilteredFoods] = useState([]);
  const searchContainerRef = useRef(null); // 🔹 Referință pentru zona de căutare
  //const [foodSelected, setFoodSelected] = useState(false);
  // 🔹 Traduceri pentru textele din interfață
  const t = (key) => translations[key]?.[language] || translations[key]?.["en"];

  const categoryKey = `category_${language.toUpperCase()}`;
  const categories = Array.from(
    new Set(foods.map((food) => food[categoryKey]).filter(Boolean))
  ).sort((a, b) => a.localeCompare(b, language));

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

      if (query.trim().length > 1 || selectedCategory !== "") {
        const languageKey = `name_${language?.toUpperCase() || "EN"}`;
        const results = foods.filter((food) => {
          const name = food[languageKey]?.toLowerCase() || "";
          const category = food[categoryKey];
          const nameMatch = name.includes(query.toLowerCase());
          const categoryMatch =
            !selectedCategory || category === selectedCategory;
          return nameMatch && categoryMatch;
        }).sort((a, b) => {
          const nameA = a[languageKey] || "";
          const nameB = b[languageKey] || "";
          return nameA.localeCompare(nameB, language);
        });;

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
        <h1 className="header-title">{t("title_header")} </h1>
        <div className="language-subtitle">
          <p className="header-subtitle">{t("subtitle_header")} </p>

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
            <span className="language-label">{t("language_label")}</span>
          </div>
        </div>
      </div>

      <div className="header-controls">
        <Form.Select
          size="sm"
          className="mb-2"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          style={{ maxWidth: "300px", fontSize: "14px", height: "32px" }}
        >
          <option value="">{t("all_categories")}</option>
          {categories.map((cat, idx) => (
            <option key={idx} value={cat}>
              {cat}
            </option>
          ))}
        </Form.Select>

        {/* Căutare aliment */}
        <div className="position-relative" ref={searchContainerRef}>
          <Form.Control
            type="text"
            placeholder={t("search_placeholder")}
            value={search}
            onChange={handleSearchChange}
            className="form-control-sm"
            style={{ width: "300px", fontSize: "14px", height: "32px" }}
          />
          {filteredFoods.length > 0 && (
            <ListGroup className="position-absolute search-suggestions shadow rounded">
              {filteredFoods.map((food, index) => (
                <div
                  key={index}
                  onClick={() => handleSelectFood(food)}
                  className="search-item"
                >
                  {food[`name_${language.toUpperCase()}`]}
                </div>
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
          style={{ width: "60px", fontSize: "14px", height: "32px" }}
        />

        {/* Buton „Adaugă” și Tipul dietei */}
        <div className="d-flex align-items-center flex-direction-row">
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
          </Button>

          {/* // reset buton */}
          <Button className="reset-button" onClick={resetSelections}>
            {t("reset_button")}
          </Button>
          {/* // remove aads */}
          <Button className="reset-button" onClick={removeAds}>
            {t("fara_reclame")}
          </Button>
        </div>
      </div>

      <div className="nutrition-info">
        <div className="col">
          <span>{t("total_proteins")}: </span>
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
          <span>{t("total_carbs")}: </span>
          <Badge bg="light" text="dark">
            {!isNaN(Number(totalCarbs)) ? Number(totalCarbs).toFixed(1) : "0.0"}{" "}
            g
            <span className="text-muted"> ({carbsPercentage.toFixed(1)}%)</span>
          </Badge>
        </div>
        <div className="col">
          <span>{t("total_fats")}: </span>
          <Badge bg="light" text="dark">
            {!isNaN(Number(totalFat)) ? Number(totalFat).toFixed(1) : "0.0"} g
            <span className="text-muted"> ({fatPercentage.toFixed(1)}%)</span>
          </Badge>
        </div>
        <div className="col">
          <span>{t("total_fiber")}: </span>
          <Badge bg="light" text="dark">
            {!isNaN(Number(totalFiber)) ? Number(totalFiber).toFixed(1) : "0.0"}{" "}
            g
          </Badge>
        </div>
        <div className="col font-weight-bold">
          <span>{t("total_calories")}: </span>
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
