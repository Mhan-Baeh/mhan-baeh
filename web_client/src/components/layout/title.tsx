import React from "react";
import { useRouterContext, TitleProps } from "@pankod/refine-core";
import { Button, Typography } from '@pankod/refine-mui';


export const Title: React.FC<TitleProps> = ({ collapsed }) => {
  const { Link } = useRouterContext();

  return (
    <Button fullWidth variant="text" disableRipple>
      <Link to="/" className="no-underline">
        {collapsed ? (
          <Typography color="white" variant="h4">
            O
          </Typography>
        ) : (
          <Typography color="white" variant="h4">
            OpenVid
          </Typography>
        )}
      </Link>
    </Button>
  );
};

