import React, { useContext } from "react";
import { Table, Container } from "react-bootstrap";
import nutrientsDailyIntake from "../Data/nutrients_daily_intake.json";
import nutrientsMaxiumIntake from "../Data/risky_nutrients.json";
import { LanguageContext } from "../LanguageContext";
import { translations } from "../translations";

// import { translations } from "../translations";
// const t = (key) => translations[key]?.[language] || translations[key]?.["en"];
// {t("total_calories")}

const MineralsTable = ({ selectedFoods, foodsData }) => {
  const mineralKeys = Object.keys(nutrientsDailyIntake);
  const { language } = useContext(LanguageContext);
  const t = (key) => translations[key]?.[language] || translations[key]?.["en"];

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

  const overLimit = Object.entries(mineralTotals).filter(([key, value]) => {
    const dzr = nutrientsMaxiumIntake[key]?.daily_maximum_intake;
    return dzr !== "None" && dzr && value > dzr && translations.risky_nutrients[key];
  });

  return (
    <Container className="mt-4 text-center">
      <h5 className="diet-info-title">{t("diet_info_title_mineral")}</h5>
      {overLimit.length > 0 && (
        <div className="nutrient-warning-banner">
          ⚠️{" "}
          {t("nutrient_warning_banner")}
        </div>
      )}  
      <Table
        striped
        bordered
        hover
        className="minerals-table table-sm table-dark"
        responsive
      >
        <thead>
          <tr>
            <th>{t("description")}</th>
            <th>{t("cantitate")}</th>
            <th>{t("procent_dzr")}</th>
          </tr>
        </thead>
        <tbody>
          {mineralKeys.map((mineral) => {
            const total = mineralTotals[mineral] || 0;
            const dzr = nutrientsDailyIntake[mineral]?.daily_recommended_intake;
            const max = nutrientsMaxiumIntake[mineral]?.daily_maximum_intake;
            const percent =
              dzr && dzr !== "None"
                ? ((total / dzr) * 100).toFixed(1) + "%"
                : "N/A";
            const isDanger =
              translations.risky_nutrients?.[mineral]?.[language] &&
              max &&
              total > max;
            const translatedName =
              translations.nutrientTranslations?.[mineral]?.[language] ||
              mineral;

            return (
              <tr key={mineral} className={isDanger ? "row-warning" : ""}>
                <td
                  className={isDanger ? "fw-bold nutrient-warning-label" : ""}
                >
                  {translatedName}{" "}
                </td>
                <td>{total.toFixed(2)}</td>
                <td>{percent}</td>
              </tr>
            );
          })}
        </tbody>
      </Table>
      {overLimit.length > 0 && (
        <div className="nutrient-warning-detail">
          <h6
            className="diet-info-title"
            style={{ fontWeight: "bold", marginBottom: "10px" }}
          >
            {t("overdose_title")}
          </h6>
          <ul
            style={{
              listStyleType: "none",
              paddingLeft: "4px",
              marginBottom: 0,
            }}
          >
            {overLimit.map(([nutrient]) => (
              
              <li key={nutrient} style={{ marginBottom: "16px" }}>
                <strong>
                {translations.nutrientTranslations?.[nutrient]?.[language] || nutrient}  {nutrientsMaxiumIntake[nutrient]?.daily_maximum_intake} max :
                </strong>{" "}
                {translations.risky_nutrients?.[nutrient]?.[language] || "-"}
              </li>
            ))}
          </ul>
        </div>
      )}
    </Container>
  );
};

export default MineralsTable;
