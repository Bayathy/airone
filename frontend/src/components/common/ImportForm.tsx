import { Box, Button, Input, Typography } from "@mui/material";
import { useSnackbar } from "notistack";
import React, { FC, useState } from "react";
import { useHistory } from "react-router-dom";

interface Props {
  handleImport: (data: string | ArrayBuffer) => Promise<void>;
  handleCancel?: () => void;
}

export const ImportForm: FC<Props> = ({ handleImport, handleCancel }) => {
  const history = useHistory();
  const [file, setFile] = useState<File>();
  const [errorMessage, setErrorMessage] = useState<string>("");
  const { enqueueSnackbar } = useSnackbar();

  const onChange = (event) => {
    setFile(event.target.files[0]);
  };

  const onClick = async () => {
    if (file) {
      const fileReader = new FileReader();
      fileReader.readAsText(file);

      fileReader.onload = async () => {
        try {
          await handleImport(fileReader.result);
          history.go(0);
        } catch (e) {
          setErrorMessage("ファイルのアップロードに失敗しました。");
          enqueueSnackbar("ファイルのアップロードに失敗しました", {
            variant: "error",
          });
        }
      };
    }
  };

  return (
    <Box>
      <Box display="flex" flexDirection="column">
        <Input type="file" onChange={onChange} />

        <Typography color="error" variant="caption" my="4px">
          {errorMessage}
        </Typography>
        <Box display="flex" justifyContent="flex-end">
          <Button
            type="submit"
            variant="contained"
            color="secondary"
            onClick={onClick}
            sx={{ m: "4px" }}
          >
            インポート
          </Button>
          <Button
            variant="contained"
            color="info"
            onClick={handleCancel}
            sx={{ m: "4px" }}
          >
            キャンセル
          </Button>
        </Box>
      </Box>
    </Box>
  );
};
