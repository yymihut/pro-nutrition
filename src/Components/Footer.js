import React, { useContext } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { LanguageContext } from "../LanguageContext";
import customIconAboutUs from "../assets/About-us.ico";
import tiktokLogo from "../assets/tiktok_logo.svg";
import emailIcon from "../assets/gmail_icon.ico";
import { translations } from "../translations";

// import { translations } from "../translations";
// const t = (key) => translations[key]?.[language] || translations[key]?.["en"];
// {t("total_calories")}

const Footer = () => {
  const { language } = useContext(LanguageContext); // 🔥 Obținem limba curentă
  const t = (key) => translations[key]?.[language] || translations[key]?.["en"]; // 🔥 Funcția de traducere

  return (
    <footer id="footer" className="bg-dark text-white text-center py-3">
      <Container>
        <Row className="row-footer">
          <Col className="footer-col" md={4}>
            <h5>
              <img
                src={emailIcon}
                alt="Info"
                style={{ width: "30px", height: "30px", marginRight: "5px" }}
              />{" "}
              {t("contact")}{" "}
            </h5>
            <ul className="list-unstyled">
              <li>
                <a href="https://mail.google.com/" className="text-white">
                  pronutritionaiteam@gmail.com
                </a>
              </li>
            </ul>
          </Col>

          <Col className="footer-col" md={4}>
            <h5>
              <img
                src={tiktokLogo}
                alt="Info"
                width="30"
                height="30"
                style={{ marginRight: "5px" }}
              />{" "}
              {language === "ro" ? "Urmărește-ne" : "Follow us"}
            </h5>
            <a href="https://www.tiktok.com" className="text-white mx-2">
              TikTok
            </a>
          </Col>
          <Col className="footer-col" md={4}>
            <h5>
              <img
                src={customIconAboutUs}
                alt="Info"
                style={{ width: "30px", height: "30px", marginRight: "5px" }}
              />{" "}
              {t("about_us")}
            </h5>
            <p>{t("despre_noi_p")}</p>
          </Col>
        </Row>

        <hr className="bg-light" />
        <p>
          {t("proNutritionTeam")} NovaNutriCalc™ | {t("proNutritionTeam_info_text")} {" "}
          {t("proNutritionTeam_info_1")}{" "}| {t("proNutritionTeam_info_2")}{" "}
          <a href="https://www.usda.gov/about-food/food-safety">USDA </a>
        </p>
      </Container>
    </footer>
  );
};

export default Footer;
