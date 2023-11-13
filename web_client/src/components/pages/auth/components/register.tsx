import { useForm } from "@pankod/refine-react-hook-form";
import * as React from "react";
import {
  RegisterPageProps,
  BaseRecord,
  HttpError,
  useTranslate,
  useRouterContext,
  useRegister,
} from "@pankod/refine-core";
import { RegisterFormTypes } from "../../../../interfaces/auth";
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
  Divider,
  Link as MuiLink,
} from "@pankod/refine-mui";
import { FormPropsType } from "../index";
import { layoutStyles, titleStyles } from "./styles";

type RegisterProps = RegisterPageProps<
  BoxProps,
  CardContentProps,
  FormPropsType
>;

/**
 * The register page will be used to register new users. You can use the following props for the <AuthPage> component when the type is "register".
 * @see {@link https://refine.dev/docs/api-reference/mui/components/mui-auth-page/#register} for more details.
 */
export const RegisterPage: React.FC<RegisterProps> = ({
  loginLink,
  wrapperProps,
  contentProps,
  renderContent,
  providers,
  formProps,
}) => {
  const { onSubmit, ...useFormProps } = formProps || {};
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<BaseRecord, HttpError, RegisterFormTypes>({
    ...useFormProps,
  });

  const { mutate: registerMutate, isLoading } =
    useRegister<RegisterFormTypes>();
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
                onClick={() =>
                  registerMutate({
                    providerName: provider.name,
                  })
                }
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
      className="w-full py-3 rounded-2xl shadow-xl px-8 sm:px-16"
      {...(contentProps ?? {})}
    >
      <div className="flex flex-col">
        <Typography
          component="h1"
          align="center"
          style={titleStyles}
          color="black"
        >
          {translate("pages.register.title", "Register")}
        </Typography>
        {renderProviders()}
        <Box
          component="form"
          onSubmit={handleSubmit((data) => {
            if (onSubmit) {
              return onSubmit(data);
            }

            return registerMutate(data);
          })}
        >
          <Typography color="black">Email</Typography>
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
            error={!!errors.email}
            helperText={errors["email"] ? errors["email"].message : ""}
            name="email"
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
            Name
          </Typography>
          <TextField
            {...register("name", {
              required: true,
            })}
            id="name"
            fullWidth
            name="name"
            helperText={errors?.name?.message}
            error={!!errors.name}
            placeholder="Martin Carly"
            autoComplete="name"
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
            Phone
          </Typography>
          <TextField
            {...register("phone", {
              required: true,
              pattern: {
                value: /^\d{3}-\d{3}-\d{4}$/,
                message: "Invalid phone number",
              },
            })}
            id="phone"
            fullWidth
            name="phone"
            helperText={errors?.phone?.message}
            error={!!errors.phone}
            placeholder="xxx-xxx-xxxx"
            autoComplete="phone"
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
            helperText={errors["password"] ? errors["password"].message : ""}
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
          <Typography color="black" className="mt-3">
            Confirm Password
          </Typography>
          <TextField
            {...register("confirmPassword", {
              required: true,
            })}
            id="confirmPassword"
            fullWidth
            name="confirmPassword"
            helperText={
              errors["confirmPassword"] ? errors["confirmPassword"].message : ""
            }
            error={!!errors.confirmPassword}
            type="password"
            placeholder="●●●●●●●●"
            autoComplete="current-password"
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
            <Box display="flex" justifyContent="flex-start">
              <div className="flex justify-between mb-5 mt-3">
                <Link
                  to="/"
                  className="flex text-xs no-underline text-blue-600 font-thin"
                >
                  Already has an account?
                </Link>
              </div>
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
            register
          </Button>
        </Box>
      </div>
    </Card>
  );

  return (
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
          gap: "0.5rem",
        }}
      >
        <div className="flex justify-center">
          <img className="w-11/12" src="mhanbae.png" alt="mhanbae" />
        </div>
        {renderContent ? renderContent(Content) : Content}
      </Container>
    </Box>
  );
};
