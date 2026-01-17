// src/components/Footer.js
import React from "react";
import { Segment, Container, Grid, Icon } from "semantic-ui-react";
import { COLORS, SPACING } from "../utils/designConstants";
import { useTranslation } from "react-i18next";

const Footer = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";

  const footerStyle = {
    backgroundColor: COLORS.darkRed,
    color: COLORS.textWhite,
    padding: `${SPACING.xl} 0`,
    marginTop: SPACING.xxl,
    width: "100%",
    direction: isRTL ? "rtl" : "ltr",
  };

  const textStyle = {
    margin: SPACING.sm,
    fontSize: "14px",
    textAlign: "center",
  };

  const iconStyle = {
    marginLeft: isRTL ? "0" : SPACING.xs,
    marginRight: isRTL ? SPACING.xs : "0",
  };

  return (
    <Segment style={footerStyle} inverted>
      <Container>
        <Grid stackable textAlign="center">
          <Grid.Row>
            <Grid.Column width={16}>
              <div
                style={{ ...textStyle, fontSize: "18px", fontWeight: "bold" }}
              >
                <Icon name="university" style={iconStyle} />
                {t("footer_title")}
              </div>
            </Grid.Column>
          </Grid.Row>

          <Grid.Row columns={3} style={{ paddingTop: 0 }}>
            <Grid.Column>
              <div style={textStyle}>
                <Icon name="phone" style={iconStyle} />
                {t("phone")}
              </div>
            </Grid.Column>
            <Grid.Column>
              <div style={textStyle}>
                <Icon name="mail" style={iconStyle} />
                {t("email_contact")}
              </div>
            </Grid.Column>
            <Grid.Column>
              <div style={textStyle}>
                <Icon name="marker" style={iconStyle} />
                {t("location")}
              </div>
            </Grid.Column>
          </Grid.Row>

          <Grid.Row>
            <Grid.Column width={16}>
              <div style={{ ...textStyle, fontSize: "12px", opacity: 0.8 }}>
                {t("rights_reserved", { year: new Date().getFullYear() })}
              </div>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Container>
    </Segment>
  );
};

export default Footer;
