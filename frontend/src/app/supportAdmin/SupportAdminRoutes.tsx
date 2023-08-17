import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { useFeature } from "flagged";

import AddOrganizationAdminFormContainer from "./AddOrganizationAdmin/AddOrganizationAdminFormContainer";
import DeviceTypeFormContainer from "./DeviceType/DeviceTypeFormContainer";
import TenantDataAccessFormContainer from "./TenantDataAccess/TenantDataAccessFormContainer";
import SupportAdmin from "./SupportAdmin";
import PendingOrganizationsContainer from "./PendingOrganizations/PendingOrganizationsContainer";
import ManageDeviceTypeFormContainer from "./DeviceType/ManageDeviceTypeFormContainer";
import { HivUploadForm } from "./HIVUpload/HivUploadForm";
import ManageFacility from "./ManageFacility/ManageFacility";
import { Escalations } from "./Escalations/Escalations";

interface Props {
  isAdmin: boolean;
}

const SupportAdminRoutes: React.FC<Props> = ({ isAdmin }) => {
  const hivEnabled = useFeature("hivEnabled") as boolean;

  if (!isAdmin) {
    return <Navigate to="/queue" />;
  }
  return (
    <Routes>
      <Route
        path="pending-organizations"
        element={<PendingOrganizationsContainer />}
      />
      <Route
        path="add-organization-admin"
        element={<AddOrganizationAdminFormContainer />}
      />
      <Route path="create-device-type" element={<DeviceTypeFormContainer />} />
      <Route
        path="manage-devices"
        element={<ManageDeviceTypeFormContainer />}
      />
      <Route
        path="tenant-data-access"
        element={<TenantDataAccessFormContainer />}
      />
      <Route path="manage-facility" element={<ManageFacility />} />
      <Route path="escalate-to-engineering" element={<Escalations />} />
      {hivEnabled && (
        <Route path="hiv-csv-upload" element={<HivUploadForm />} />
      )}
      <Route path="/" element={<SupportAdmin />} />
    </Routes>
  );
};

export default SupportAdminRoutes;
