import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import {
  Box,
  Button,
  Container,
  IconButton,
  Input,
  InputAdornment,
  Paper,
  Table,
  TableContainer,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Checkbox,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import React, { FC, useState } from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";

import { UserPasswordFormModal } from "./UserPasswordFormModal";

import { AironeUserProps } from "pages/EditUserPage";
import { DjangoContext } from "utils/DjangoContext";

interface Props {
  userInfo: AironeUserProps;
  setUserInfo: (userInfo: AironeUserProps) => void;
}

const StyledTableRow = styled(TableRow)(() => ({
  "&:nth-of-type(odd)": {
    backgroundColor: "#607D8B0A",
  },
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

const InputBox: FC = ({ children }) => {
  return (
    <Box
      component="form"
      sx={{
        m: 1,
        p: "2px 4px",
        display: "flex",
        alignItems: "center",
        width: "90%",
      }}
    >
      {children}
    </Box>
  );
};

const ElemChangingPassword: FC<Props> = ({ userInfo }) => {
  const [openModal, setOpenModal] = useState(false);
  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  return (
    <StyledTableRow>
      <TableCell sx={{ width: "400px", wordBreak: "break-word" }}>
        パスワード変更
      </TableCell>
      <TableCell sx={{ width: "750px", p: "0px", wordBreak: "break-word" }}>
        <InputBox>
          <Button variant="contained" onClick={handleOpenModal}>
            パスワードの再設定
          </Button>
          <UserPasswordFormModal
            userId={userInfo.id}
            openModal={openModal}
            onClose={handleCloseModal}
          />
        </InputBox>
      </TableCell>
    </StyledTableRow>
  );
};

const ElemAuthenticationMethod: FC<Props> = ({ userInfo }) => {
  const djangoContext = DjangoContext.getInstance();

  return (
    <StyledTableRow>
      <TableCell sx={{ width: "400px", wordBreak: "break-word" }}>
        認証方法
      </TableCell>
      <TableCell sx={{ width: "750px", p: "0px", wordBreak: "break-word" }}>
        <InputBox>
          {userInfo.authenticateType == djangoContext.userAuthenticateType.local
            ? "ローカル認証"
            : "LDAP 認証"}
        </InputBox>
      </TableCell>
    </StyledTableRow>
  );
};

const ElemAccessTokenConfiguration: FC<Props> = ({ userInfo, setUserInfo }) => {
  return (
    <StyledTableRow>
      <TableCell sx={{ width: "400px", wordBreak: "break-word" }}>
        アクセストークンの有効期限設定
      </TableCell>
      <TableCell sx={{ width: "750px", p: "0px", wordBreak: "break-word" }}>
        <InputBox>
          <Box sx={{ flexDirecton: "column" }}>
            <Box sx={{ pb: "20px" }}>
              {/* This TextField only allow to accept numeric string */}
              <TextField
                label="アクセストークンが有効な期間"
                id="outlined-start-adornment"
                InputProps={{
                  type: "number",
                  endAdornment: (
                    <InputAdornment position="end">秒</InputAdornment>
                  ),
                }}
                variant="standard"
                onChange={(e) => {
                  setUserInfo({
                    ...userInfo,
                    token: {
                      ...userInfo.token,
                      // lifetime: Number(e.target.value.replace(/[^0-9]/g, "")),
                      lifetime: e.target.value ? Number(e.target.value) : null,
                    },
                  });
                }}
                value={userInfo.token.lifetime}
              />
            </Box>

            <Box>
              <TextField
                disabled
                label="作成日"
                id="outlined-start-adornment"
                variant="standard"
                //value="2022/09/15 11:29:30"
                value={userInfo.token.created}
                InputProps={{ disableUnderline: true }}
              />

              <TextField
                disabled
                label="有効期限"
                id="outlined-start-adornment"
                variant="standard"
                value={
                  userInfo.token.created === userInfo.token.expire
                    ? "無期限"
                    : userInfo.token.expire
                }
                InputProps={{ disableUnderline: true }}
              />
            </Box>
          </Box>
        </InputBox>
      </TableCell>
    </StyledTableRow>
  );
};

const ElemAccessToken: FC<Props> = ({ userInfo }) => {
  return (
    <StyledTableRow>
      <TableCell sx={{ width: "400px", wordBreak: "break-word" }}>
        アクセストークン
      </TableCell>
      <TableCell sx={{ width: "750px", p: "0px", wordBreak: "break-word" }}>
        <InputBox>
          <Input
            disabled={true}
            sx={{ width: "100%" }}
            placeholder="更新ボタンを押してトークンをリフレッシュさせてください"
            inputProps={{ "aria-label": "search google maps" }}
            value={userInfo.token?.value}
          />
          <IconButton type="button" sx={{ p: "10px" }} aria-label="search">
            <CopyToClipboard text={userInfo.token?.value}>
              <ContentCopyIcon />
            </CopyToClipboard>
          </IconButton>
        </InputBox>
      </TableCell>
    </StyledTableRow>
  );
};

const ElemEmailAddress: FC<Props> = ({ userInfo, setUserInfo }) => {
  return (
    <StyledTableRow>
      <TableCell sx={{ width: "400px", wordBreak: "break-word" }}>
        メールアドレス
      </TableCell>
      <TableCell sx={{ width: "750px", p: "0px", wordBreak: "break-word" }}>
        <InputBox>
          <Input
            type="email"
            placeholder="メールアドレスを入力してください"
            sx={{ width: "100%" }}
            value={userInfo.email}
            onChange={(e) =>
              setUserInfo({
                ...userInfo,
                email: e.target.value,
              })
            }
          />
        </InputBox>
      </TableCell>
    </StyledTableRow>
  );
};

const ElemUserName: FC<Props> = ({ userInfo, setUserInfo }) => {
  return (
    <StyledTableRow>
      <TableCell sx={{ width: "400px", wordBreak: "break-word" }}>
        名前
      </TableCell>
      <TableCell sx={{ width: "750px", p: "0px", wordBreak: "break-word" }}>
        <InputBox>
          <Input
            type="text"
            placeholder="ユーザ名を入力してください"
            sx={{ width: "100%" }}
            value={userInfo.username}
            onChange={(e) => {
              setUserInfo({ ...userInfo, username: e.target.value });
            }}
          />
        </InputBox>
      </TableCell>
    </StyledTableRow>
  );
};

const ElemUserPassword: FC<Props> = ({ userInfo, setUserInfo }) => {
  return (
    <StyledTableRow>
      <TableCell sx={{ width: "400px", wordBreak: "break-word" }}>
        パスワード
      </TableCell>
      <TableCell sx={{ width: "750px", p: "0px", wordBreak: "break-word" }}>
        <InputBox>
          <Input
            type="password"
            placeholder="パスワードを入力してください"
            sx={{ width: "100%" }}
            value={userInfo.password}
            onChange={(e) => {
              setUserInfo({ ...userInfo, password: e.target.value });
            }}
          />
        </InputBox>
      </TableCell>
    </StyledTableRow>
  );
};

const ElemIsSuperuser: FC<Props> = ({ userInfo, setUserInfo }) => {
  const djangoContext = DjangoContext.getInstance();

  return (
    <StyledTableRow>
      <TableCell sx={{ width: "400px", wordBreak: "break-word" }}>
        管理者権限
      </TableCell>
      <TableCell sx={{ width: "750px", p: "0px", wordBreak: "break-word" }}>
        <Checkbox
          disabled={!djangoContext.user.isSuperuser}
          checked={userInfo.isSuperuser ?? false}
          onChange={(e) => {
            setUserInfo({ ...userInfo, isSuperuser: e.target.checked });
          }}
        />
      </TableCell>
    </StyledTableRow>
  );
};

export const UserForm: FC<Props> = ({ userInfo, setUserInfo }) => {
  return (
    <Container maxWidth="lg" sx={{ pt: "50px", pb: "50px" }}>
      <TableContainer component={Paper}>
        <Table className="table table-bordered">
          <TableHead>
            <TableRow sx={{ backgroundColor: "#455A64" }}>
              <TableCell sx={{ color: "#FFFFFF" }}>項目</TableCell>
              <TableCell sx={{ color: "#FFFFFF" }}>内容</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <ElemUserName userInfo={userInfo} setUserInfo={setUserInfo} />
            <ElemEmailAddress userInfo={userInfo} setUserInfo={setUserInfo} />
            <ElemIsSuperuser userInfo={userInfo} setUserInfo={setUserInfo} />

            {userInfo.id > 0 ? (
              <>
                {/* Undisplay other user's token information */}
                <ElemAccessToken
                  userInfo={userInfo}
                  setUserInfo={setUserInfo}
                />

                {userInfo.token && (
                  <ElemAccessTokenConfiguration
                    userInfo={userInfo}
                    setUserInfo={setUserInfo}
                  />
                )}

                <ElemAuthenticationMethod
                  userInfo={userInfo}
                  setUserInfo={setUserInfo}
                />

                <ElemChangingPassword
                  userInfo={userInfo}
                  setUserInfo={setUserInfo}
                />
              </>
            ) : (
              <ElemUserPassword userInfo={userInfo} setUserInfo={setUserInfo} />
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};
