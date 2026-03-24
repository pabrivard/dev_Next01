import {
  Body,
  Container,
  Head,
  Hr,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components"

type RegistrationEmailProps = {
  pin: string
  firstName: string
  locale: string
  translations: {
    systemLabel: string
    greeting: string
    body: string
    pinLabel: string
    expiryNote: string
    fallbackText: string
  }
}

export default function RegistrationEmail({
  pin,
  translations,
}: RegistrationEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>{translations.greeting} — DEV_NEXT01</Preview>
      <Body style={{ backgroundColor: "#faf9f9", fontFamily: "sans-serif" }}>
        <Container
          style={{
            maxWidth: "100%",
            width: "100%",
            margin: "40px auto",
            backgroundColor: "#ffffff",
            border: "1px solid #e3e2e2",
            borderRadius: "8px",
            padding: "0",
          }}
        >
          {/* Header label */}
          <Section style={{ padding: "24px 32px 0" }}>
            <Text
              style={{
                fontSize: "11px",
                fontWeight: "600",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "#23527C",
                margin: "0 0 16px",
              }}
            >
              {translations.systemLabel}
            </Text>
            <Hr style={{ borderColor: "#e3e2e2", margin: "0" }} />
          </Section>

          {/* Body */}
          <Section style={{ padding: "32px 32px 0" }}>
            <Text
              style={{
                fontSize: "18px",
                fontWeight: "700",
                color: "#1b1c1c",
                margin: "0 0 16px",
              }}
            >
              {translations.greeting}
            </Text>
            <Text
              style={{
                fontSize: "16px",
                color: "#42474e",
                lineHeight: "1.5",
                margin: "0",
                wordBreak: "break-word",
                overflowWrap: "break-word",
              }}
            >
              {translations.body}
            </Text>
          </Section>

          {/* PIN display */}
          <Section style={{ padding: "24px 32px" }}>
            <Text
              style={{
                fontSize: "11px",
                fontWeight: "600",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "#42474e",
                margin: "0 0 8px",
              }}
            >
              {translations.pinLabel}
            </Text>
            <Text
              style={{
                fontSize: "36px",
                fontWeight: "800",
                color: "#003b63",
                letterSpacing: "0.3em",
                margin: "0",
                fontFamily: "monospace",
              }}
            >
              {pin}
            </Text>
            <Text
              style={{
                fontSize: "12px",
                color: "#72777f",
                margin: "8px 0 0",
              }}
            >
              {translations.expiryNote}
            </Text>
          </Section>

          {/* Footer note */}
          <Section style={{ padding: "0 32px 32px" }}>
            <Hr style={{ borderColor: "#e3e2e2", margin: "0 0 16px" }} />
            <Text
              style={{
                fontSize: "12px",
                color: "#72777f",
                margin: "0",
                wordBreak: "break-word",
                overflowWrap: "break-word",
              }}
            >
              {translations.fallbackText}
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  )
}
