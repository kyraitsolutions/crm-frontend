export const API_PATH_PREFIX_USER = "/auth";

export const API_ENDPOINT_PATH = {
  AUTH_USER: {
    ME: `${API_PATH_PREFIX_USER}/me`,
    // CREATE: `/organization/onboarding`,
    // UPDATE: `${API_PATH_PREFIX_USER}/user/update`,
    // GET: `${API_PATH_PREFIX_USER}/user/get`,
    // DELETE: `${API_PATH_PREFIX_USER}/user/delete`,
    // ASSIGN: `${API_PATH_PREFIX_USER}/user/assign`,
    ONBOARDING: `/organization/onboarding`,
  },

  ORGANIZATION: {
    ONBOARDING: `/organization/onboarding`,
    // GET_ORGANIZATION_DETAILS_BY_ORGANIZATION_ID: `/organization/:organizationId`,

    getOrganizationDetailsByOrganizationIdPath: (id: string) =>
      `/organization/${id}`,
  },
};
