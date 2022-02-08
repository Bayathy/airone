import AddIcon from "@mui/icons-material/Add";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import SearchIcon from "@mui/icons-material/Search";
import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  CardHeader,
  Fab,
  Grid,
  IconButton,
  InputAdornment,
  Menu,
  MenuItem,
  Pagination,
  Stack,
  TextField,
  Theme,
  Typography,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import React, { FC, useState } from "react";
import { Link } from "react-router-dom";

import {
  aclPath,
  entityEntriesPath,
  entityHistoryPath,
  entityPath,
  newEntityPath,
} from "../../Routes";
import { deleteEntity } from "../../utils/AironeAPIClient";
import { EntityList as ConstEntityList } from "../../utils/Constants";
import { Confirmable } from "../common/Confirmable";

const useStyles = makeStyles<Theme>((theme) => ({
  button: {
    margin: theme.spacing(1),
  },
  entityName: {
    margin: theme.spacing(1),
  },
  entityNote: {
    color: theme.palette.text.secondary,
    display: "-webkit-box",
    overflow: "hidden",
    "-webkit-box-orient": "vertical",
    "-webkit-line-clamp": 2,
  },
}));

interface Props {
  entities: {
    id: number;
    name: string;
    note: string;
  }[];
}

interface EntityControlProps {
  entityId: number;
  anchorElem: HTMLButtonElement | null;
  handleClose: (entityId: number) => void;
}

// TODO consider to separate a composite component handling anchor and menu events
const EntityControlMenu: FC<EntityControlProps> = ({
  entityId,
  anchorElem,
  handleClose,
}) => {
  const handleDelete = (event, entityId) => {
    console.log("handleDelete: ", entityId);
    deleteEntity(entityId).then(() => history.go(0));
  };

  return (
    <Menu
      id={`entityControlMenu-${entityId}`}
      open={Boolean(anchorElem)}
      onClose={() => handleClose(entityId)}
      anchorEl={anchorElem}
    >
      <MenuItem component={Link} to={entityPath(entityId)}>
        <Typography>編集</Typography>
      </MenuItem>
      <Confirmable
        componentGenerator={(handleOpen) => (
          <MenuItem onClick={handleOpen}>
            <Typography>削除</Typography>
          </MenuItem>
        )}
        dialogTitle="本当に削除しますか？"
        onClickYes={(e) => handleDelete(e, entityId)}
      />
      <MenuItem component={Link} to={aclPath(entityId)}>
        <Typography>ACL 設定</Typography>
      </MenuItem>
      <MenuItem component={Link} to={entityHistoryPath(entityId)}>
        <Typography>変更履歴</Typography>
      </MenuItem>
    </Menu>
  );
};

export const EntityList: FC<Props> = ({ entities }) => {
  const classes = useStyles();

  const [keyword, setKeyword] = useState("");
  const [page, setPage] = React.useState(1);
  const handleChange = (event, value) => {
    setPage(value);
  };
  const [entityAnchorEls, setEntityAnchorEls] = useState<{
    [key: number]: HTMLButtonElement;
  } | null>({});

  const filteredEntities = entities.filter((entity) => {
    // Search keyword is case insensitive (doesn't matter Lower/Upper cases)
    return entity.name.toLowerCase().indexOf(keyword.toLowerCase()) !== -1;
  });

  const displayedEntities = filteredEntities.slice(
    (page - 1) * ConstEntityList.MAX_ROW_COUNT,
    page * ConstEntityList.MAX_ROW_COUNT
  );

  const totalPageCount = Math.ceil(
    filteredEntities.length / ConstEntityList.MAX_ROW_COUNT
  );

  return (
    <Box>
      {/* This box shows search box and create button */}
      <Box display="flex" justifyContent="space-between" mb={8}>
        <Box className={classes.search} width={500}>
          <TextField
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            variant="outlined"
            size="small"
            placeholder="エンティティ名で絞り込む"
            sx={{
              background: "#0000000B",
            }}
            fullWidth={true}
            value={keyword}
            onChange={(e) => {
              setKeyword(e.target.value);

              /* Reset page number to prevent vanishing entities from display
               * when user move other page */
              setPage(1);
            }}
          />
        </Box>
        <Fab
          color="secondary"
          aria-label="add"
          variant="extended"
          component={Link}
          to={newEntityPath()}
        >
          <AddIcon />
          新規作成
        </Fab>
      </Box>

      {/* This box shows each entity Cards */}
      <Grid container spacing={2}>
        {displayedEntities.map((entity) => (
          <Grid item xs={4} key={entity.id}>
            <Card sx={{ height: "100%" }}>
              <CardHeader
                sx={{
                  p: "0px",
                  mt: "24px",
                  mx: "16px",
                  mb: "16px",
                }}
                title={
                  <CardActionArea
                    component={Link}
                    to={entityEntriesPath(entity.id)}
                  >
                    <Typography variant="h6">{entity.name}</Typography>
                  </CardActionArea>
                }
                action={
                  <>
                    <IconButton
                      onClick={(e) => {
                        setEntityAnchorEls({
                          ...entityAnchorEls,
                          [entity.id]: e.currentTarget,
                        });
                      }}
                    >
                      <MoreVertIcon />
                    </IconButton>
                    <EntityControlMenu
                      entityId={entity.id}
                      anchorElem={entityAnchorEls[entity.id]}
                      handleClose={(entityId: number) =>
                        setEntityAnchorEls({
                          ...entityAnchorEls,
                          [entityId]: null,
                        })
                      }
                    />
                  </>
                }
              />
              <CardContent
                sx={{
                  p: "0px",
                  mt: "0px",
                  mx: "16px",
                  mb: "0px",
                  lineHeight: 2,
                }}
              >
                <Typography className={classes.entityNote}>
                  {entity.note}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
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
