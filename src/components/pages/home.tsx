"use client";

import { Container, Text, Title } from "@mantine/core";
import { ReactNode } from "react";
import { usePocketBase } from "../auth/client";

export type HomePageProps = {
  children?: ReactNode;
};

export const HomePage = ({ children }: HomePageProps) => {
  const pb = usePocketBase();

  const clientInfo = (
    <>
      isValid: {pb.authStore.isValid ? "true" : "false"}, username:{" "}
      {pb.authStore.model?.username ?? "?"}
    </>
  );
  return (
    <Container py="md">
      <Title>Hello World!</Title>
      <Text>
        <b>Server Info</b> {children}
      </Text>
      <Text>
        <b>Client Info</b> {clientInfo}
      </Text>
    </Container>
  );
};
