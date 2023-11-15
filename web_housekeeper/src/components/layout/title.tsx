import React from "react";
import { useRouterContext, TitleProps } from "@pankod/refine-core";
import { Button, Typography } from "@pankod/refine-mui";

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
          <Typography
            color="#142880"
            variant="h4"
            className="flex justify-center items-center gap-2"
          >
            <img
              src="https://media.discordapp.net/attachments/1150062586025476206/1174171541097955329/logo.png?ex=65669f76&is=65542a76&hm=b9ac29eb0d3d65824ac7b1507c5a7e4dd246ee439ce7f1e960f396ec2302b468&=&width=238&height=278"
              alt="logo"
              className="w-16 flex"
            />
            <div className="flex">MB</div>
          </Typography>
        )}
      </Link>
    </Button>
  );
};
