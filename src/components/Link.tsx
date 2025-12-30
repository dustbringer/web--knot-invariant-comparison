"use client";

import React from "react";
import { styled } from "@mui/material/styles";
import NextLink from "next/link";
import { removeKey } from "../util/objects";

const StyledLink = styled(NextLink)`
  font-weight: 600;
  color: ${(props) => props.theme.palette.primary.main};
  text-decoration: none;
  transition: all 0.25s ease-in-out;
  &:hover {
    text-decoration: underline;
  }
`;

function Link(
  props: React.PropsWithChildren<{
    href: string;
    inPlace?: boolean;
    sx?: object;
  }>
) {
  const linkprops = props.inPlace
    ? {}
    : {
        target: "_blank",
        rel: "noopener noreferrer",
      };
  return (
    <StyledLink
      {...linkprops}
      {...(removeKey(props, "inPlace") as React.PropsWithChildren<{
        href: string;
      }>)}
    />
  );
}

const NoStyleLink = styled(NextLink)`
  font-weight: normal;
  color: ${(props) =>
    props.theme.palette.mode === "dark"
      ? props.theme.palette.text.primary
      : props.theme.palette.secondary.main};
  text-decoration: none;
  transition: all 0.25s ease-in-out;
  &:focus,
  &:hover,
  &:visited,
  &:link,
  &:hover,
  &:active {
    text-decoration: none;
  }
`;

export function LinkBare(
  props: React.PropsWithChildren<{ href: string; inPlace?: boolean }>
) {
  const linkprops = props.inPlace
    ? {}
    : {
        target: "_blank",
        rel: "noopener noreferrer",
      };
  return (
    <NoStyleLink
      {...linkprops}
      {...(removeKey(props, "inPlace") as React.PropsWithChildren<{
        href: string;
      }>)}
    ></NoStyleLink>
  );
}

export default Link;
