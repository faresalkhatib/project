// src/components/Footer.js
import React from "react";
import { Segment, Container, Grid, Icon } from "semantic-ui-react";
import { COLORS, SPACING } from "../utils/designConstants";

const Footer = () => {
  const footerStyle = {
    backgroundColor: COLORS.darkRed,
    color: COLORS.textWhite,
    padding: `${SPACING.xl} 0`,
    marginTop: SPACING.xxl,
    width: "100%",
  };

  const textStyle = {
    margin: SPACING.sm,
    fontSize: "14px",
    textAlign: "center",
  };

  const iconStyle = {
    marginLeft: SPACING.xs,
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
                جامعة مؤتة - نظام حجز قاعات الامتحانات
              </div>
            </Grid.Column>
          </Grid.Row>

          <Grid.Row columns={3} style={{ paddingTop: 0 }}>
            <Grid.Column>
              <div style={textStyle}>
                <Icon name="phone" style={iconStyle} />
                الهاتف: +962-3-2372380
              </div>
            </Grid.Column>
            <Grid.Column>
              <div style={textStyle}>
                <Icon name="mail" style={iconStyle} />
                البريد: info@mutah.edu.jo
              </div>
            </Grid.Column>
            <Grid.Column>
              <div style={textStyle}>
                <Icon name="marker" style={iconStyle} />
                الكرك، الأردن
              </div>
            </Grid.Column>
          </Grid.Row>

          <Grid.Row>
            <Grid.Column width={16}>
              <div style={{ ...textStyle, fontSize: "12px", opacity: 0.8 }}>
                © {new Date().getFullYear()} جامعة مؤتة. جميع الحقوق محفوظة
              </div>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Container>
    </Segment>
  );
};

export default Footer;
