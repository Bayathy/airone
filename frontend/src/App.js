import Grid from "@material-ui/core/Grid";
import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import {
  aclPath,
  advancedSearchPath,
  entitiesPath,
  entityEntriesPath,
  entityHistoryPath,
  entityPath,
  entryPath,
  groupPath,
  groupsPath,
  importEntitiesPath,
  importGroupsPath,
  importUsersPath,
  jobsPath,
  newEntityPath,
  newEntryPath,
  newGroupPath,
  newUserPath,
  passwordPath,
  searchPath,
  showEntryPath,
  userPath,
  usersPath,
} from "./Routes";
import { Header } from "./components/Header";
import { LeftMenu } from "./components/LeftMenu";
import { ACL } from "./pages/ACL";
import { AdvancedSearch } from "./pages/AdvancedSearch";
import { AdvancedSearchResults } from "./pages/AdvancedSearchResults";
import { Dashboard } from "./pages/Dashboard";
import { EditEntity } from "./pages/EditEntity";
import { EditEntry } from "./pages/EditEntry";
import { EditGroup } from "./pages/EditGroup";
import { EditUser } from "./pages/EditUser";
import { EditUserPassword } from "./pages/EditUserPassword";
import { Entity } from "./pages/Entity";
import { EntityHistory } from "./pages/EntityHistory";
import { Entry } from "./pages/Entry";
import { Group } from "./pages/Group";
import { ImportEntity } from "./pages/ImportEntity";
import { ImportEntry } from "./pages/ImportEntry";
import { ImportGroup } from "./pages/ImportGroup";
import { ImportUser } from "./pages/ImportUser";
import { Job } from "./pages/Job";
import { ShowEntry } from "./pages/ShowEntry";
import { User } from "./pages/User";

function App() {
  return (
    <Router>
      <Grid container>
        <Grid item xs={12}>
          <Header />
        </Grid>

        <Grid item xs={2}>
          <LeftMenu />
        </Grid>

        <Grid item xs={10}>
          <Switch>
            <Route path={advancedSearchPath()} component={AdvancedSearch} />
            <Route path={newEntryPath(":entityId")} component={EditEntry} />
            <Route
              path={showEntryPath(":entityId", ":entryId")}
              component={ShowEntry}
            />
            <Route
              path={importEntitiesPath(":entityId")}
              component={ImportEntry}
            />
            <Route
              path={entryPath(":entityId", ":entryId")}
              component={EditEntry}
            />
            <Route
              path={entityEntriesPath(":entityId", ":entityId")}
              component={Entry}
            />
            <Route
              path={entityHistoryPath(":entityId")}
              component={EntityHistory}
            />
            <Route path={newEntityPath()} component={EditEntity} />
            <Route path={importEntitiesPath()} component={ImportEntity} />
            <Route path={entityPath(":entityId")} component={EditEntity} />
            <Route path={entitiesPath()} component={Entity} />
            <Route path={newGroupPath()} component={EditGroup} />
            <Route path={importGroupsPath()} component={ImportGroup} />
            <Route path={groupPath(":groupId")} component={EditGroup} />
            <Route path={groupsPath()} component={Group} />
            <Route path={jobsPath()} component={Job} />
            <Route path={aclPath(":entityId")} component={ACL} />
            <Route path={searchPath()} component={AdvancedSearchResults} />
            <Route path={newUserPath()} component={EditUser} />
            <Route path={importUsersPath()} component={ImportUser} />
            <Route
              path={passwordPath(":userId")}
              component={EditUserPassword}
            />
            <Route path={userPath(":userId")} component={EditUser} />
            <Route path={usersPath()} component={User} />
            <Route path="/" component={Dashboard} />
          </Switch>
        </Grid>
      </Grid>
    </Router>
  );
}

ReactDOM.render(<App />, document.getElementById("app"));
