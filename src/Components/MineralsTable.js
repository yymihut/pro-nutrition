import React, { useContext } from "react";
import { Table, Container } from "react-bootstrap";
import nutrientsDailyIntake from "../Data/nutrients_daily_intake.json";
import { LanguageContext } from "../LanguageContext";
import { translations } from "../translations";

// import { translations } from "../translations";
// const t = (key) => translations[key]?.[language] || translations[key]?.["en"];
// {t("total_calories")}

// ✅ Lista de vitamine/minerale cu risc la supradoză
const riskyNutrients = {
  "Sodium (mg)":
    "Excesul de sare în organism se asociază cu hipertensiune arterială, boli cardiovasculare și renale. Cantitatea maximă de sare recomandată la adulți și copii peste 11 ani este de 6 grame sau o linguriță rasă pe zi, care echivalează cu 2300 mg sodiu.",
  "Calcium (mg)":
    "Ca o regula generala, cantitatea maxima de calciu pe care un adult normal poate sa o consume, in conditii de siguranta, este de 2500 mg in fiecare zi. In realitate, nu este nevoie de o cantitate atat de mare. Pentru majoritatea adultilor, 1000 mg de calciu este un aport suficient. Un aport prea mare de calciu poate cauza, in timp, ritm cardiac neregulat si poate scadea tensiunea arteriala. In cazurile grave, prea mult calciu poate dauna creierului. Acest lucru poate cauza convulsii, confuzie si pierderea constientei. O cantitate prea mare de calciu in sange (calcifiere) poate determina aparitia bolilor cardiovasculare.",
  "Phosphorus (mg)":
    "O cantitate prea mare de acest mineral poate provoca diaree, dar si intarirea organelor si a tesuturilor moi. De asemenea, daca fosforul este la un nivel prea mare, poate fi afectata capacitatea organismului de a folosi in mod eficient alte minerale, precum calciul, fierul, zincul si magneziul.",
  "Iron (Fier) (mg)":
    "Dozele mari pot fi toxice, afectează ficatul și pot cauza greață și constipație. Fierul poate fi dăunător în exces. La persoanele sănătoase, administrarea de doze mari de suplimente de fier (în special pe stomacul gol) poate provoca dureri de stomac, constipație, greață, dureri abdominale, vărsături și diaree. Excesul de fier poate provoca și efecte mai grave, inclusiv inflamarea mucoasei stomacului și ulcere. Dozele mari de fier pot duce la scăderea absorbției de zinc, iar cele extrem de mari (în sute sau mii de miligrame) pot provoca insuficiență multiplă de organe, comă, convulsii.",
  "Zinc (mg)":
    "Prea mult zinc poate duce la deficiență de cupru, greață, varsturi, diaree, dureri de cap și disfuncții imunitare. Pe termen lung, excesul de zinc poate avea consecinte grave asupra sanatatii. Un nivel ridicat de zinc in organism pe o perioada indelungata poate duce la scaderea nivelului de cupru, care este necesar pentru functionarea normala a organismului.",
  "Selenium (µg)":
    "Excesul de seleniu in organism, atunci cand aportul zilnic depaseste 600-800 micrograme, provoaca selenoza. Intoxicatia cu seleniu are printre simptome greturile, varsaturile, diareea, pierderea parului, eruptii cutanate, stare de oboseala, tulburari ale sistemului nervos, in timp ce respiratia poate avea miros de usturoi.",
  "Vitamin A - Retinol (µg)":
    "Prea multă vitamina A poate fi dăunătoare, iar excesul de vitamina A în timpul sarcinii de exemplu a fost legat de malformații congenitale. Chiar si o singură doza mai mare decat cea normala zilnic poate provoca toxicitate hepatică, ameteala, varsaturi, vedere încețoșată, greață.",
  "Vitamin D (µg)":
    "Excesul cauzeaza o concentratie crescuta de calciu in sange. Manifestarile hipervitaminozei D pot include: pietre la rinichi (litiaza renala), greata si varsaturi recurente, constipatie, pierderea apetitului, senzatie de sete excesiva, urinare frecventa, confuzie si scadere in greutate.",
  "Vitamin E (mg)":
    "Dozele mari pot interfera cu coagularea sângelui poate creste riscul de cancer de prostata la barbati, accident vascular cerebral hemoragic si hemoragii..",
  "Vitamin B3 or Niacin (mg)":
    "Simptomele timpurii ale toxicitatii vitaminei B3 se manifesta prin dilatarea vasele de sange (vasodilatatie) cu inrosirea pielii, mancarime si senzatia de caldura. Desi aceste manifestari sunt inofensive, reprezinta un indicator important al toxicitatii cu vitamina B3. Utilizarea prelungita a unor doze crescute de vitamina B3 poate cauza afectare hepatica, in special la pacientii cu boli hepatice preexistente.",
};

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
    const dzr = nutrientsDailyIntake[key]?.daily_recommended_intake;
    return dzr !== "None" && dzr && value > dzr && riskyNutrients[key];
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
            const percent =
              dzr && dzr !== "None"
                ? ((total / dzr) * 100).toFixed(1) + "%"
                : "N/A";
            const isDanger =
              translations.risky_nutrients?.[mineral]?.[language] &&
              dzr &&
              total > dzr;
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
              paddingLeft: "18px",
              marginBottom: 0,
            }}
          >
            {overLimit.map(([nutrient]) => (
              <li key={nutrient} style={{ marginBottom: "16px" }}>
                <strong>
                {translations.nutrientTranslations?.[nutrient]?.[language] || nutrient}:
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
