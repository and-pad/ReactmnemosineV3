import { Route } from "react-router-dom";
//import { PiecesQueries } from "../components/PiecesQueries/PiecesQueries";
import { EditInventory } from "../components/PiecesQueries/edit";
import { InventoryEdit } from "../components/PiecesQueries/inventoryActions";
import PrivateRoute from "../components/PrivateRouteComponent";
import { Navigate } from "react-router-dom";
export function InventoryQueriesActions({
  handleCheckLoginCallback,
  accessToken,
  refreshToken,
  permissions,
}) {
  return (
    <>
      <Route
        path="inventory_queries/actions/:_id/"
        element={
          <PrivateRoute
            element={
              <InventoryEdit
                accessToken={accessToken}
                refreshToken={refreshToken}
                permissions={permissions}
              />
            }
            checkLogin={handleCheckLoginCallback}
          />
        }
      >
        <Route index element={<Navigate to="edit" />} />
        <Route
          path="edit"
          element={
            <PrivateRoute
              element={
                <EditInventory
                  accessToken={accessToken}
                  refreshToken={refreshToken}
                  permissions={permissions}
                />
              }
              checkLogin={handleCheckLoginCallback}
            />
          }
        />
      </Route>
    </>
  );
}
