import React from "react";
import { useRouterContext, TitleProps } from "@pankod/refine-core";
import { Button, Typography } from '@pankod/refine-mui';


export const Title: React.FC<TitleProps> = ({ collapsed }) => {
  const { Link } = useRouterContext();

  return (
    <Button fullWidth variant="text" disableRipple>
      <Link to="/" className="no-underline">
        {collapsed ? (
          <Typography color="#142880" variant="h4">
            MB
          </Typography>
        ) : (
            <Typography color="#142880" variant="h4" className="flex justify-center items-center gap-2">
              <img src="logo.png" alt="logo" className="w-16 flex"/>
              <div className="flex">
                MB
              </div>
            </Typography>
        )}
      </Link>
    </Button>
  );
};

