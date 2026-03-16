import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Text,
} from "@react-email/components";

interface WelcomeEmailProps {
  name: string;
}

export default function WelcomeEmail({ name }: WelcomeEmailProps) {
  return (
    <Html>
      <Head />
      <Body>
        <Container>
          <Heading>Welcome to Dev_Next01</Heading>
          <Text>Hi {name}, your account is ready.</Text>
        </Container>
      </Body>
    </Html>
  );
}
