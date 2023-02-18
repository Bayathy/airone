import { Box, TextField, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import React, { FC } from "react";

const SampleBox = styled(Box)({
  width: "100%",
  margin: "80px 0",
  backgroundColor: "#607D8B0A",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
});

const SampleTextField = styled(TextField)({
  my: "16px",
  width: "95%",
});

interface Props {
  entries: string;
  setEntries: (entries: string) => void;
}

export const CopyForm: FC<Props> = ({ entries, setEntries }) => {
  return (
    <Box>
      <TextField
        fullWidth
        minRows={6}
        placeholder="コピーするエントリ名"
        multiline
        value={entries}
        onChange={(e) => setEntries(e.target.value)}
      />
      <SampleBox display="flex">
        <Typography variant="h6" mt="24px" color="primary">
          SAMPLE
        </Typography>
        <Typography color="primary">
          (Vm0001、vm0002、…vm006の6エントリを作成する場合)
        </Typography>
        <SampleTextField
          multiline
          disabled
          label="コピーするエントリ名"
          value="vm0001
vm0002
vm0003
vm0004
vm0005
vm0006"
        />
      </SampleBox>
    </Box>
  );
};
