import AddIcon from "@mui/icons-material/Add";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import {
  Box,
  Button,
  Card,
  CardActionArea,
  CardHeader,
  Grid,
  IconButton,
  Pagination,
  Stack,
  Typography,
} from "@mui/material";
import React, { FC, useCallback, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useAsync } from "react-use";

import { aironeApiClientV2 } from "../../apiclient/AironeApiClientV2";
import { Loading } from "../common/Loading";
import { SearchBox } from "../common/SearchBox";

import { UserControlMenu } from "./UserControlMenu";
import { UserImportModal } from "./UserImportModal";

import { newUserPath, userPath } from "Routes";
import { UserList as ConstUserList } from "utils/Constants";

export const UserList: FC = ({}) => {
  const [keyword, setKeyword] = useState("");
  const [page, setPage] = useState(1);
  const [openImportModal, setOpenImportModal] = useState(false);

  const [userAnchorEls, setUserAnchorEls] = useState<{
    [key: number]: HTMLButtonElement;
  } | null>({});

  const users = useAsync(async () => {
    return await aironeApiClientV2.getUsers(page, keyword);
  }, [page, keyword]);
  if (!users.loading && users.error) {
    throw new Error("Failed to get users from AirOne APIv2 endpoint");
  }

  const handleChange = (event, value) => {
    setPage(value);
  };

  const handleExport = useCallback(async () => {
    await aironeApiClientV2.exportUsers("user.yaml");
  }, []);

  const totalPageCount = useMemo(() => {
    return users.loading
      ? 0
      : Math.ceil(users.value.count / ConstUserList.MAX_ROW_COUNT);
  }, [users.loading, users.value]);

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" mb={8}>
        <Box width={500}>
          <SearchBox
            placeholder="ユーザを絞り込む"
            value={keyword}
            onChange={(e) => {
              setKeyword(e.target.value);
              /* Reset page number to prevent vanishing entities from display
               * when user move other page */
              setPage(1);
            }}
          />
        </Box>
        <Box display="flex" alignItems="center">
          <Box mx="8px">
            <Button
              variant="contained"
              color="info"
              sx={{ margin: "0 4px" }}
              onClick={handleExport}
            >
              エクスポート
            </Button>
            <Button
              variant="contained"
              color="info"
              sx={{ margin: "0 4px" }}
              onClick={() => setOpenImportModal(true)}
            >
              インポート
            </Button>
            <UserImportModal
              openImportModal={openImportModal}
              closeImportModal={() => setOpenImportModal(false)}
            />
          </Box>
          <Button
            color="secondary"
            variant="contained"
            component={Link}
            to={newUserPath()}
            sx={{ borderRadius: "24px", height: "100%" }}
          >
            <AddIcon />
            新規ユーザを登録
          </Button>
        </Box>
      </Box>

      {users.loading ? (
        <Loading />
      ) : (
        <Grid container spacing={2}>
          {users.value.results.map((user) => {
            return (
              <Grid item xs={4} key={user.id}>
                <Card sx={{ height: "100%" }}>
                  <CardHeader
                    sx={{
                      p: "0px",
                      mt: "24px",
                      mx: "16px",
                      mb: "16px",
                      ".MuiCardHeader-content": {
                        width: "80%",
                      },
                    }}
                    title={
                      <CardActionArea component={Link} to={userPath(user.id)}>
                        <Typography
                          variant="h6"
                          sx={{
                            textOverflow: "ellipsis",
                            overflow: "hidden",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {user.username}
                        </Typography>
                      </CardActionArea>
                    }
                    action={
                      <>
                        <IconButton
                          onClick={(e) => {
                            setUserAnchorEls({
                              ...userAnchorEls,
                              [user.id]: e.currentTarget,
                            });
                          }}
                        >
                          <MoreVertIcon />
                        </IconButton>
                        <UserControlMenu
                          user={user}
                          anchorElem={userAnchorEls[user.id]}
                          handleClose={(userId: number) =>
                            setUserAnchorEls({
                              ...userAnchorEls,
                              [userId]: null,
                            })
                          }
                        />
                      </>
                    }
                  />
                </Card>
              </Grid>
            );
          })}
        </Grid>
      )}

      <Box display="flex" justifyContent="center" my="30px">
        <Stack spacing={2}>
          <Pagination
            count={totalPageCount}
            page={page}
            onChange={handleChange}
            color="primary"
          />
        </Stack>
      </Box>
    </Box>
  );
};
