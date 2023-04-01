import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import KeyboardArrowUpRoundedIcon from "@mui/icons-material/KeyboardArrowUpRounded";
import {
  Box,
  Button,
  Container,
  Fab,
  Link,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import React, { Dispatch, FC, SetStateAction, useEffect } from "react";
import { Control, Controller } from "react-hook-form";
import { UseFormSetValue } from "react-hook-form/dist/types/form";
import { useLocation } from "react-router-dom";

import { Schema } from "./entryForm/EntryFormSchema";

import { AttributeValueField } from "components/entry/entryForm/AttributeValueField";

const AnchorLinkButton = styled(Button)(({}) => ({
  border: "0.5px solid gray",
  borderRadius: 16,
  textTransform: "none",
}));

const HeaderTableRow = styled(TableRow)(({}) => ({
  backgroundColor: "#455A64",
}));

const HeaderTableCell = styled(TableCell)(({}) => ({
  color: "#FFFFFF",
  width: "384px",
}));

const RequiredLabel = styled(Typography)(({}) => ({
  border: "0.5px solid gray",
  borderRadius: 16,
  color: "white",
  backgroundColor: "gray",
  padding: "0 8px",
}));

interface Props {
  entryInfo: Schema;
  setIsAnchorLink: Dispatch<SetStateAction<boolean>>;
  control: Control<Schema>;
  setValue: UseFormSetValue<Schema>;
}

export const EntryForm: FC<Props> = ({
  entryInfo,
  setIsAnchorLink,
  control,
  setValue,
}) => {
  const location = useLocation();

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    setIsAnchorLink(false);
  }, [location]);

  return (
    <Container sx={{ mb: "100px" }}>
      <Box mb="20px" display="flex" flexWrap="wrap">
        <Box m="8px">
          <AnchorLinkButton href="#name">
            <Typography sx={{ color: "black" }}>エントリ名</Typography>
            <ArrowDropDownIcon sx={{ color: "black", padding: "0 4px" }} />
          </AnchorLinkButton>
        </Box>
        {Object.keys(entryInfo.attrs).map((attributeName) => (
          <Box key={attributeName} m="8px">
            <AnchorLinkButton
              href={`#attrs-${attributeName}`}
              onClick={() => setIsAnchorLink(true)}
            >
              <Typography sx={{ color: "black", padding: "0 4px" }}>
                {attributeName}
              </Typography>
              <ArrowDropDownIcon sx={{ color: "black" }} />
            </AnchorLinkButton>
          </Box>
        ))}
      </Box>
      <Table>
        <TableHead>
          <HeaderTableRow>
            <HeaderTableCell>項目</HeaderTableCell>
            <HeaderTableCell>内容</HeaderTableCell>
          </HeaderTableRow>
        </TableHead>
        <TableBody>
          <TableRow>
            <TableCell>
              <Box display="flex" alignItems="center">
                {/* an anchor link adjusted fixed headers etc. */}
                <Link
                  id="name"
                  sx={{ marginTop: "-500px", paddingTop: "500px" }}
                />
                <Typography flexGrow={1}>エントリ名</Typography>
                <RequiredLabel>必須</RequiredLabel>
              </Box>
            </TableCell>
            <TableCell>
              <Controller
                name="name"
                control={control}
                defaultValue=""
                render={({ field, fieldState: { error } }) => (
                  <TextField
                    {...field}
                    variant="standard"
                    error={error != null}
                    helperText={error?.message}
                    fullWidth
                  />
                )}
              />
            </TableCell>
          </TableRow>
          {Object.keys(entryInfo.attrs).map((attributeName, index) => (
            <TableRow key={index}>
              <TableCell>
                <Box display="flex" alignItems="center">
                  {/* an anchor link adjusted fixed headers etc. */}
                  <Link
                    id={`attrs-${attributeName}`}
                    sx={{ marginTop: "-500px", paddingTop: "500px" }}
                  />
                  <Typography flexGrow={1}>{attributeName}</Typography>
                  {entryInfo.attrs[attributeName]?.isMandatory && (
                    <RequiredLabel>必須</RequiredLabel>
                  )}
                </Box>
              </TableCell>
              <TableCell>
                <AttributeValueField
                  control={control}
                  setValue={setValue}
                  attrName={attributeName}
                  attrInfo={entryInfo.attrs[attributeName]}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Box display="flex" justifyContent="flex-end" my="12px">
        <Fab color="primary" onClick={scrollToTop}>
          <KeyboardArrowUpRoundedIcon />
        </Fab>
      </Box>
    </Container>
  );
};
