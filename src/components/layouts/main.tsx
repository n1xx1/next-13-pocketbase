"use client";

import { Container } from "@mantine/core";
import { ReactNode } from "react";

export type MainLayoutProps = {
  children?: ReactNode;
};

export const MainLayout = ({ children }: MainLayoutProps) => {
  return <Container>{children}</Container>;
};
