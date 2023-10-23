import React from "react";
import { Box } from "@pankod/refine-mui";
import { Header as DefaultHeader } from "./header";
import { Sider as DefaultSider } from "./sider";
import type { RefineLayoutLayoutProps } from "@pankod/refine-mui";
export const Layout: React.FC<RefineLayoutLayoutProps> = ({
  Sider,
  Header,
  Footer,
  OffLayoutArea,
  children,
}) => {
  const SiderToRender = Sider ?? DefaultSider;
  const HeaderToRender = Header ?? DefaultHeader;

  return (
    <Box display="flex" flexDirection="row">
      <SiderToRender />
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          flex: 1,
        }}
      >
        <HeaderToRender />
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            bgcolor: "white",
            minHeight:"100vh",
          }}
        >
          {children}
        </Box>
        {Footer && <Footer />}
      </Box>
      {OffLayoutArea && <OffLayoutArea />}
    </Box>
  );
};