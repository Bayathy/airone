import { Box } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import PropTypes from "prop-types";
import React, { useState } from "react";
import { useHistory } from "react-router-dom";

import { entityEntriesPath } from "../../Routes";
import { copyEntry } from "../../utils/AironeAPIClient";

export default function CopyForm({ entityId, entryId }) {
  const history = useHistory();

  const [entries, setEntries] = useState("");

  const handleSubmit = (event) => {
    copyEntry(entryId, entries).then((_) =>
      history.push(entityEntriesPath(entityId))
    );
    event.preventDefault();
  };

  return (
    <form onSubmit={handleSubmit}>
      <Box className="row">
        <Box className="col">
          <Box className="float-left">
            入力した各行毎に同じ属性値を持つ別エントリを作成
          </Box>
          <Box className="float-right">
            <Button type="submit" variant="contained">
              コピー
            </Button>
          </Box>
        </Box>
      </Box>
      <Box className="row">
        <Box className="col-5">
          <textarea
            cols={40}
            rows={10}
            value={entries}
            onChange={(e) => setEntries(e.target.value)}
          />
        </Box>
      </Box>
    </form>
  );
}

CopyForm.propTypes = {
  entityId: PropTypes.number.isRequired,
  entryId: PropTypes.string.isRequired,
};
