import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import SettingsIcon from "@material-ui/icons/Settings";
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useAsync } from "react-use";

import { AironeBreadcrumbs } from "../components/common/AironeBreadcrumbs";
import { Loading } from "../components/common/Loading";
import { SearchResults } from "../components/entry/SearchResults";
import { searchEntries } from "../utils/AironeAPIClient";

const useStyles = makeStyles((theme) => ({
  button: {
    margin: theme.spacing(1),
  },
}));

export function AdvancedSearchResults({}) {
  const classes = useStyles();
  const location = useLocation();

  const params = new URLSearchParams(location.search);
  const entityIds = params.getAll("entity");
  const entryName = params.has("entry_name") ? params.get("entry_name") : "";
  const attrInfo = params.has("attrinfo")
    ? JSON.parse(params.get("attrinfo"))
    : [];

  const results = useAsync(async () => {
    return searchEntries(entityIds, entryName, attrInfo)
      .then((resp) => resp.json())
      .then((data) => data.result.ret_values);
  });

  return (
    <div className="container-fluid">
      <AironeBreadcrumbs>
        <Typography component={Link} to="/new-ui/">
          Top
        </Typography>
        {attrInfo.length > 0 && (
          <Typography component={Link} to="/new-ui/advanced_search">
            高度な検索
          </Typography>
        )}
        <Typography color="textPrimary">検索結果</Typography>
      </AironeBreadcrumbs>

      <Box m={1}>
        {!results.loading && (
          <Typography>検索結果: ({results.value.length} 件)</Typography>
        )}
        <Button
          className={classes.button}
          variant="outlined"
          startIcon={<SettingsIcon />}
          color="default"
        >
          高度な検索
        </Button>
        <Button className={classes.button} variant="outlined" color="primary">
          YAML 出力
        </Button>
        <Button className={classes.button} variant="outlined" color="primary">
          CSV 出力
        </Button>
      </Box>

      {!results.loading ? (
        <SearchResults
          results={results.value}
          defaultEntryFilter={entryName}
          defaultAttrsFilter={Object.fromEntries(
            attrInfo.map((i) => [i["name"], i["keyword"] || ""])
          )}
        />
      ) : (
        <Loading />
      )}
    </div>
  );
}
