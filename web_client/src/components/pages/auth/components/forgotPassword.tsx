import { useForm } from "@pankod/refine-react-hook-form";
import * as React from "react";
import {
  ForgotPasswordPageProps,
  ForgotPasswordFormTypes,
  BaseRecord,
  HttpError,
  useTranslate,
  useRouterContext,
  useForgotPassword,
} from "@pankod/refine-core";
import {
  Button,
  TextField,
  Box,
  Typography,
  Container,
  Card,
  CardContent,
  BoxProps,
  CardContentProps,
  Link as MuiLink,
} from "@pankod/refine-mui";
import { FormPropsType } from "../index";
import { layoutStyles, titleStyles } from "./styles";

type ForgotPasswordProps = ForgotPasswordPageProps<
  BoxProps,
  CardContentProps,
  FormPropsType
>;

/**
 * The forgotPassword type is a page that allows users to reset their passwords. You can use this page to reset your password.
 * @see {@link https://refine.dev/docs/api-reference/mui/components/mui-auth-page/#forgot-password} for more details.
 */
export const ForgotPasswordPage: React.FC<ForgotPasswordProps> = ({
  loginLink,
  wrapperProps,
  contentProps,
  renderContent,
  formProps,
}) => {
  const { onSubmit, ...useFormProps } = formProps || {};
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<BaseRecord, HttpError, ForgotPasswordFormTypes>({
    ...useFormProps,
  });

  const { mutate, isLoading } = useForgotPassword<ForgotPasswordFormTypes>();
  const translate = useTranslate();
  const { Link } = useRouterContext();

  const Content = (
    <Card
      className="w-full py-3 rounded-2xl shadow-xl px-8 sm:px-16 "
      {...(contentProps ?? {})}
    >
      <div className="flex flex-col">
        <Typography
          component="h1"
          align="center"
          style={titleStyles}
          color="black"
        >
          {translate("pages.forgotPassword.title", "Forgot your password?")}
        </Typography>
        <Box
          component="form"
          onSubmit={handleSubmit((data) => {
            if (onSubmit) {
              return onSubmit(data);
            }

            return mutate(data);
          })}
        >
          <TextField
            {...register("email", {
              required: true,
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: translate(
                  "pages.register.errors.validEmail",
                  "Invalid email address"
                ),
              },
            })}
            id="email"
            fullWidth
            placeholder="your_email@gmail.com"
            name="email"
            type="email"
            error={!!errors.email}
            autoComplete="email"
            sx={{
              "& .MuiInputBase-root": {
                border: "0px solid #ccc",
                borderRadius: 0,
                height: "40px",
              },
            }}
            className="shadow-md"
          />
          {loginLink ?? (
            <Box display="flex" justifyContent="flex-end" className="mt-2 mb-5">
              <Link
                to="/"
                className="flex text-xs no-underline text-blue-600 font-thin"
              >
                Sign In account?
              </Link>
            </Box>
          )}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="error"
            sx={{
              my: "8px",
              p: "8px",
              backgroundColor: "#DC2434",
            }}
            disabled={isLoading}
          >
            {translate(
              "pages.forgotPassword.buttons.submit",
              "Send reset instructions"
            )}
          </Button>
        </Box>
      </div>
    </Card>
  );

  return (
    <>
      <Box component="div" style={layoutStyles} {...(wrapperProps ?? {})}>
        <Container
          component="main"
          maxWidth="sm"
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            height: "100vh",
            backgroundColor: "transparent",
            gap: "2.5rem",
          }}
        >
          <div className="flex justify-center">
            <img
              className="w-11/12"
              src="https://media.discordapp.net/attachments/1150062586025476206/1174171541299277834/mhanbae.png?ex=65669f76&is=65542a76&hm=3bbc64481150e3451dea2e5240e041df612c3d6ce52529611e8b410f50d46df2&=&width=1454&height=278"
              alt="mhanbae"
            />
          </div>
          {renderContent ? renderContent(Content) : Content}
        </Container>
      </Box>
    </>
  );
};
