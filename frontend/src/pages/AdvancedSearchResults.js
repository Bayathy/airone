import { makeStyles } from "@material-ui/core/styles";
import React from "react";
import Typography from "@material-ui/core/Typography";
import { Link, useLocation } from "react-router-dom";
import Button from "@material-ui/core/Button";
import SettingsIcon from "@material-ui/icons/Settings";
import AironeBreadcrumbs from "../components/common/AironeBreadcrumbs";
import { searchEntries } from "../utils/AironeAPIClient";
import { useAsync } from "react-use";
import SearchResults from "../components/entry/SearchResults";
import Box from "@material-ui/core/Box";

const useStyles = makeStyles((theme) => ({
  button: {
    margin: theme.spacing(1),
  },
}));

export default function AdvancedSearchResults({}) {
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

      {!results.loading && <SearchResults results={results.value} />}
    </div>
  );
}
