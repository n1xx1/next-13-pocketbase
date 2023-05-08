"use client";

import { RegisterAction } from "@/actions/register";
import { FieldErrors, errorField } from "@/lib/utils";
import {
  Anchor,
  Button,
  Checkbox,
  Container,
  Group,
  Paper,
  PasswordInput,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { experimental_useFormStatus as useFormStatus } from "react-dom";

export type RegisterPageProps = {
  registerAction: RegisterAction;
};

export const RegisterPage = ({ registerAction }: RegisterPageProps) => {
  const router = useRouter();
  const [fieldErrors, setFieldErrors] = useState<
    Record<string, string[] | undefined>
  >({});

  return (
    <Container size={420} my={40}>
      <Title align="center" sx={{ fontWeight: 900 }}>
        Welcome!
      </Title>
      <Text color="dimmed" size="sm" align="center" mt={5}>
        Already have an account?{" "}
        <Anchor size="sm" component={Link} href="/login">
          Login
        </Anchor>
      </Text>

      <Paper
        component="form"
        withBorder
        shadow="md"
        p={30}
        mt={30}
        radius="md"
        action={async (formData) => {
          try {
            const result = await registerAction(formData);

            if (result.ok) {
              notifications.show({
                color: "green",
                title: "Account Created",
                message: "Success!",
              });
              router.push("/");
              return;
            }

            if (result.error) {
              console.log(result.error);
              notifications.show({
                color: "red",
                title: "Error",
                message:
                  result.error.response?.message ??
                  result.error.name ??
                  "Unknown error.",
              });
            }
            setFieldErrors(result.fieldErrors ?? {});
          } catch (e) {
            notifications.show({
              color: "red",
              title: "Error",
              message: (e as any).toString(),
            });
          }
        }}
      >
        <FormContent fieldErrors={fieldErrors} />
      </Paper>
    </Container>
  );
};

type FormContentProps = {
  fieldErrors: FieldErrors;
};

const FormContent = ({ fieldErrors }: FormContentProps) => {
  const { pending } = useFormStatus();

  return (
    <>
      <TextInput
        name="username"
        label="Username"
        placeholder="hero-123"
        required
        error={errorField(fieldErrors, "username")}
      />
      <TextInput
        name="email"
        label="Email"
        placeholder="you@mantine.dev"
        required
        mt="md"
        error={errorField(fieldErrors, "email")}
      />
      <PasswordInput
        name="password"
        label="Password"
        placeholder="Your password"
        required
        mt="md"
        error={errorField(fieldErrors, "password")}
      />
      <PasswordInput
        name="passwordConfirm"
        label="Confirm Password"
        placeholder="Confirm"
        required
        mt="md"
        error={errorField(fieldErrors, "passwordConfirm")}
      />
      <Button fullWidth mt="xl" type="submit" loading={pending}>
        Register
      </Button>
    </>
  );
};
