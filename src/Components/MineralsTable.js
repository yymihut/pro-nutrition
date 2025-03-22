import React, { useContext } from "react";
import { Table, Container } from "react-bootstrap";
import nutrientsDailyIntake from "../Data/nutrients_daily_intake.json";
import { LanguageContext } from "../LanguageContext";
import { translations } from "../translations";

// import { translations } from "../translations";
// const t = (key) => translations[key]?.[language] || translations[key]?.["en"];
// {t("total_calories")}

const MineralsTable = ({ selectedFoods, foodsData }) => {
  const mineralKeys = Object.keys(nutrientsDailyIntake);
  const { language } = useContext(LanguageContext);
  const t = (key) => translations[key]?.[language] || translations[key]?.["en"];
  
  const nutrientTranslations = {
    "Sodium (mg)": {
      ro: "Sodiu (mg)",
      en: "Sodium (mg)",
      fr: "Sodium (mg)",
      de: "Natrium (mg)",
    },
    "Potassium (mg)": {
      ro: "Potasiu (mg)",
      en: "Potassium (mg)",
      fr: "Potassium (mg)",
      de: "Kalium (mg)",
    },
    "Calcium (mg)": {
      ro: "Calciu (mg)",
      en: "Calcium (mg)",
      fr: "Calcium (mg)",
      de: "Calcium (mg)",
    },
    "Phosphorus (mg)": {
      ro: "Fosfor (mg)",
      en: "Phosphorus (mg)",
      fr: "Phosphore (mg)",
      de: "Phosphor (mg)",
    },
    "Magnesium (mg)": {
      ro: "Magneziu (mg)",
      en: "Magnesium (mg)",
      fr: "Magnésium (mg)",
      de: "Magnesium (mg)",
    },
    "Folic acid (µg)": {
      ro: "Acid folic (µg)",
      en: "Folic acid (µg)",
      fr: "Acide folique (µg)",
      de: "Folsäure (µg)",
    },
    "Iron (Fier) (mg)": {
      ro: "Fier (mg)",
      en: "Iron (mg)",
      fr: "Fer (mg)",
      de: "Eisen (mg)",
    },
    "Copper - Cupru (mg)": {
      ro: "Cupru (mg)",
      en: "Copper (mg)",
      fr: "Cuivre (mg)",
      de: "Kupfer (mg)",
    },
    "Selenium (µg)": {
      ro: "Selen (µg)",
      en: "Selenium (µg)",
      fr: "Sélénium (µg)",
      de: "Selen (µg)",
    },
    "Zinc (mg)": {
      ro: "Zinc (mg)",
      en: "Zinc (mg)",
      fr: "Zinc (mg)",
      de: "Zink (mg)",
    },
    "Vitamin K (µg)": {
      ro: "Vitamina K (µg)",
      en: "Vitamin K (µg)",
      fr: "Vitamine K (µg)",
      de: "Vitamin K (µg)",
    },
    "Vitamin A - Retinol (µg)": {
      ro: "Vitamina A (Retinol, µg)",
      en: "Vitamin A (Retinol, µg)",
      fr: "Vitamine A (Rétinol, µg)",
      de: "Vitamin A (Retinol, µg)",
    },
    // Adaugă și alte traduceri necesare...
  };

  // 🔍 Funcție de acces aliment după id
  const getFoodById = (id) => foodsData.find((f) => f.id === id);

 // 🔢 Calculează totaluri minerale
 const mineralTotals = mineralKeys.reduce((totals, mineral) => {
  totals[mineral] = selectedFoods.reduce((sum, item) => {
    const food = getFoodById(item.id);
    const value = food && food[mineral] ? food[mineral] : 0;
    return sum + (value * item.quantity) / 100;
  }, 0);
  return totals;
}, {});
  /* */
  return (
    <Container className="mt-4 text-center">
      <h5 className="diet-info-title">
      {t("diet_info_title_mineral")}
      </h5>
      <Table
        striped
        bordered
        hover
        className="minerals-table table-sm table-dark"
        responsive
      >
        <thead>
          <tr>
          <th>
          {t("description")}
            </th>
            <th>{t("cantitate")}</th>
            <th>{t("procent_dzr")}</th>
          </tr>
        </thead>
        <tbody>
        {mineralKeys.map((mineral) => {
            const total = mineralTotals[mineral] || 0;
            const dzr = nutrientsDailyIntake[mineral]?.daily_recommended_intake;
            const percent =
              dzr && dzr !== "None"
                ? ((total / dzr) * 100).toFixed(1) + "%"
                : "N/A";

            const translatedName = nutrientTranslations[mineral]
              ? nutrientTranslations[mineral][language]
              : mineral;

            return (
              <tr key={mineral}>
                <td>{translatedName}</td>
                <td>{total.toFixed(2)}</td>
                <td>{percent}</td>
              </tr>
            );
          })}
        </tbody>
      </Table>
    </Container>
  );
};

export default MineralsTable;
