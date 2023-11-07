import {
  RefineSnackbarProvider,
  CssBaseline,
  GlobalStyles,
  ThemeProvider,
  ReadyPage,
  ErrorComponent,
} from "@pankod/refine-mui";
import { AuthPage } from "components/pages/auth";
import routerProvider from "@pankod/refine-react-router-v6";
import dataProvider from "dataProvider";
import { Refine } from "@pankod/refine-core";
import { REST_PUBLIC_URI } from "environment";
import { Layout } from "components/layout";
import { primaryTheme } from "themes/primary";

import { StyledEngineProvider } from "@mui/material/styles";
import "index.css";
import "react-toastify/dist/ReactToastify.css";
import { notificationProvider } from "providers/notificationProvider";
import { ToastContainer } from "react-toastify";
import authProvider from "authProvider";
import { HouseKeeperList } from "pages/housekeepers";
import { RegisterList } from "pages/registers";

function App() {
  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={primaryTheme}>
        <CssBaseline />
        <GlobalStyles styles={{ html: { WebkitFontSmoothing: "auto" } }} />

        <RefineSnackbarProvider>
          <Refine
            // LoginPage={AuthPage}
            // authProvider={authProvider}
            dataProvider={dataProvider(`${REST_PUBLIC_URI}`)}
            routerProvider={{
              ...routerProvider,
              routes: [
                {
                  path: "/login",
                  element: <AuthPage type="login" />,
                },
              ],
            }}
            notificationProvider={notificationProvider}
            Layout={Layout}
            ReadyPage={ReadyPage}
            catchAll={<ErrorComponent />}
            resources={[
              {
                name: "housekeepers",
                options: {
                  label: "Housekeeper List",
                },
                list: HouseKeeperList,
              },
              {
                name: "registers",
                options: {
                  label: "Housekeeper Register",
                },
                list: RegisterList,
              },
            ]}
          >
            <ToastContainer />
          </Refine>
        </RefineSnackbarProvider>
      </ThemeProvider>
    </StyledEngineProvider>
  );
}

export default App;
