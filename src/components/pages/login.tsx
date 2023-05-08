"use client";

import { LoginAction } from "@/actions/login";
import { FieldErrors, errorField } from "@/lib/utils";
import {
  Anchor,
  Button,
  Checkbox,
  Container,
  Divider,
  Flex,
  Group,
  Paper,
  PasswordInput,
  Stack,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import { experimental_useFormStatus as useFormStatus } from "react-dom";
import { FcGoogle } from "react-icons/fc";
import { FaDiscord, FaGithub } from "react-icons/fa";
import { usePocketBase } from "../auth/client";

export type LoginPageProps = {
  loginAction: LoginAction;
};

export const LoginPage = ({ loginAction }: LoginPageProps) => {
  const router = useRouter();
  const [fieldErrors, setFieldErrors] = useState<
    Record<string, string[] | undefined>
  >({});

  return (
    <Container size={420} my={40}>
      <Title align="center" sx={{ fontWeight: 900 }}>
        Welcome back!
      </Title>
      <Text color="dimmed" size="sm" align="center" mt={5}>
        Do not have an account yet?{" "}
        <Anchor size="sm" component={Link} href="/register">
          Create account
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
            const result = await loginAction(formData);

            if (result.ok) {
              notifications.show({
                color: "green",
                title: "Authenticated",
                message: "Success!",
              });
              router.push("/");
              return;
            }

            if (result.error) {
              notifications.show({
                color: "red",
                title: "Error",
                message:
                  result.error.response?.message ??
                  result.error.name ??
                  "Unknown error.",
              });
              setFieldErrors(result.fieldErrors ?? {});
            }
          } catch (e) {
            notifications.show({
              color: "red",
              title: "Error",
              message: (e as any).toString(),
            });
          }
        }}
      >
        <Stack>
          <FormContent fieldErrors={fieldErrors} />
          <Divider label="or continue with" labelPosition="center" />
          <OauthButtons />
        </Stack>
      </Paper>
    </Container>
  );
};

const authenticationMethods = [
  { name: "google", color: undefined, icon: <FcGoogle /> },
  { name: "discord", color: "#5865F2", icon: <FaDiscord /> },
  { name: "github", color: "#181717", icon: <FaGithub /> },
];

type OauthButtonsProps = {};

const OauthButtons = ({}: OauthButtonsProps) => {
  const [authenticatingWith, setAuthenticatingWith] = useState("");
  const pb = usePocketBase();
  const handleLogin = useCallback(
    async (name: string) => {
      setAuthenticatingWith(name);
      try {
        const users = pb.collection("users");
        const methods = await users.listAuthMethods();

        console.log(methods);
      } finally {
        setAuthenticatingWith("");
      }
    },
    [pb]
  );

  return (
    <Flex justify="stretch" gap="sm">
      {authenticationMethods.map(({ name, color, icon }) => (
        <Button
          onClick={() => handleLogin(name)}
          key={name}
          loading={authenticatingWith === name}
          sx={{
            flex: "1",
            color,
            svg: { width: "1.25rem", height: "1.25rem" },
          }}
          variant="default"
        >
          {icon}
        </Button>
      ))}
    </Flex>
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
        name="email"
        label="Email"
        placeholder="you@mantine.dev"
        required
        error={errorField(fieldErrors, "email")}
      />
      <PasswordInput
        name="password"
        label="Password"
        placeholder="Your password"
        required
        error={errorField(fieldErrors, "password")}
      />
      <Group position="apart">
        <Checkbox name="remember_me" label="Remember me" />
        <Anchor component="button" size="sm">
          Forgot password?
        </Anchor>
      </Group>
      <Button fullWidth type="submit" loading={pending}>
        Sign in
      </Button>
    </>
  );
};
