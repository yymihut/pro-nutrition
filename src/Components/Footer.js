import React, { useContext } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { LanguageContext } from "../LanguageContext";
import customIconAboutUs from "../assets/About-us.ico";
import tiktokLogo from "../assets/tiktok_logo.svg";
import emailIcon from "../assets/gmail_icon.ico";

const Footer = () => {
  const { language } = useContext(LanguageContext); // 🔥 Obținem limba curentă

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
              Contact:{" "}
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
              {language === "ro" ? "Despre noi" : "About us"}
            </h5>
            <p>
              {language === "ro"
                ? "Suntem o echipă pasionată de nutriție și sănătate, oferind un calculator nutrițional bazat pe normele UE."
                : "We are a team passionate about nutrition and health, offering a nutritional calculator based on EU norms."}
            </p>
          </Col>
        </Row>

        <hr className="bg-light" />
        <p>
          © 2025 by ProNutritionTeam |{" "}
          {language === "ro"
            ? "„Datele nutriționale sunt furnizate de USDA FoodData Central”"
            : "„Nutritional data provided by USDA FoodData Central”"}{" "}
          |{" "}
          {language === "ro"
            ? "Date nutriționale conform USDA & CoFID"
            : "Contains public sector information licensed under the Open Government Licence v3.0. | McCance and Widdowson’s 'composition of foods integrated dataset' & USDA"}
          <a href="https://www.usda.gov/about-food/food-safety"></a>
        </p>
      </Container>
    </footer>
  );
};

export default Footer;
