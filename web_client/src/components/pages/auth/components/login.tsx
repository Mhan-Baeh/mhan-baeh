import { FormProvider, useForm } from "@pankod/refine-react-hook-form";
import * as React from "react";
import {
  LoginPageProps,
  LoginFormTypes,
  BaseRecord,
  HttpError,
  useLogin,
  useTranslate,
  useRouterContext,
} from "@pankod/refine-core";
import {
  Button,
  BoxProps,
  Box,
  Checkbox,
  Container,
  Card,
  CardContent,
  CardContentProps,
  FormControlLabel,
  TextField,
  Typography,
  Divider,
} from "@pankod/refine-mui";
import { FormPropsType } from "../index";
import { layoutStyles, titleStyles } from "./styles";

type LoginProps = LoginPageProps<BoxProps, CardContentProps, FormPropsType>;

/**
 * login will be used as the default type of the <AuthPage> component. The login page will be used to log in to the system.
 * @see {@link https://refine.dev/docs/api-reference/mui/components/mui-auth-page/#login} for more details.
 */
export const LoginPage: React.FC<LoginProps> = ({
  providers,
  registerLink,
  forgotPasswordLink,
  rememberMe,
  contentProps,
  wrapperProps,
  renderContent,
  formProps,
}) => {
  const { onSubmit, ...useFormProps } = formProps || {};
  const methods = useForm<BaseRecord, HttpError, LoginFormTypes>({
    ...useFormProps,
  });
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = methods;

  const { mutate: login, isLoading } = useLogin<LoginFormTypes>();
  const translate = useTranslate();
  const { Link } = useRouterContext();

  const renderProviders = () => {
    if (providers && providers.length > 0) {
      return (
        <>
          {providers.map((provider: any) => {
            return (
              <Button
                key={provider.name}
                fullWidth
                variant="outlined"
                sx={{
                  my: "8px",
                  textTransform: "none",
                }}
                onClick={() => login({ providerName: provider.name })}
                startIcon={provider.icon}
              >
                {provider.label}
              </Button>
            );
          })}
          <Divider style={{ fontSize: 12 }}>
            {translate("pages.login.divider", "or")}
          </Divider>
        </>
      );
    }
    return null;
  };

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
          {translate("pages.login.title", "Login")}
        </Typography>
        <Box
          component="form"
          onSubmit={handleSubmit((data) => {
            if (onSubmit) {
              return onSubmit(data);
            }

            return login(data);
          })}
        >
          {renderProviders()}
          <Typography color="black" className="p-0">
            Email
          </Typography>
          <TextField
            {...register("email", {
              required: true,
            })}
            id="email"
            fullWidth
            placeholder="your_email@gmail.com"
            error={!!errors.email}
            name="email"
            type="email"
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
          <Typography color="black" className="mt-3">
            Password
          </Typography>
          <TextField
            {...register("password", {
              required: true,
            })}
            id="password"
            fullWidth
            name="password"
            helperText={errors?.password?.message}
            error={!!errors.password}
            type="password"
            placeholder="●●●●●●●●"
            autoComplete="current-password"
            inputProps={{ maxLength: 16 }}
            sx={{
              "& .MuiInputBase-root": {
                border: "0px solid #ccc",
                borderRadius: 0,
                height: "40px",
              },
            }}
            className="shadow-md"
          />
          <Box
            component="div"
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          ></Box>
          <div className="flex justify-between mt-3 mb-5">
            <Link
              to="/register"
              className="flex text-xs no-underline text-blue-600 font-thin"
            >
              Create a new account?
            </Link>
            <Link
              to="/forgotpassword"
              className="flex text-xs no-underline text-blue-600 font-thin"
            >
              Forgot your password
            </Link>
          </div>
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
            login
          </Button>
        </Box>
      </div>
    </Card>
  );

  return (
    <FormProvider {...methods}>
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
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              flexDirection: "column",
              alignItems: "center",
              gap: "2.5rem",
            }}
          >
            <div className="flex justify-center">
              <img className="w-11/12" src="mhanbae.png" alt="mhanbae" />
            </div>
            {renderContent ? renderContent(Content) : Content}
          </Box>
        </Container>
      </Box>
    </FormProvider>
  );
};
