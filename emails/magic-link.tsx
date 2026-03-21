import {
  Body,
  Button,
  Container,
  Head,
  Hr,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from "@react-email/components"

type MagicLinkEmailProps = {
  url: string
  locale: string
  translations: {
    systemLabel: string
    greeting: string
    body: string
    ctaButton: string
    fallbackText: string
  }
}

export default function MagicLinkEmail({
  url,
  translations,
}: MagicLinkEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>{translations.ctaButton} — DEV_NEXT01</Preview>
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
          <Section style={{ padding: "32px 32px 32px" }}>
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
                margin: "0 0 32px",
              }}
            >
              {translations.body}
            </Text>
            <Button
              href={url}
              style={{
                backgroundColor: "#23527C",
                color: "#ffffff",
                padding: "12px 24px",
                borderRadius: "6px",
                fontWeight: "500",
                fontSize: "15px",
                display: "inline-block",
                textDecoration: "none",
              }}
            >
              {translations.ctaButton}
            </Button>
            <Text
              style={{
                fontSize: "13px",
                color: "#42474e",
                margin: "24px 0 0",
              }}
            >
              {translations.fallbackText}{" "}
              <Link href={url} style={{ color: "#23527C" }}>
                {url}
              </Link>
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  )
}
