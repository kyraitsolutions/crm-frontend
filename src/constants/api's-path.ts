export const API_PATH_PREFIX_USER = "/auth";

export const API_ENDPOINT_PATH = {
  USER: {
    CREATE: `/user/create`,
    UPDATE: `${API_PATH_PREFIX_USER}/user/update`,
    GET: `${API_PATH_PREFIX_USER}/user/get`,
    DELETE: `${API_PATH_PREFIX_USER}/user/delete`,
    ASSIGN: `${API_PATH_PREFIX_USER}/user/assign`,
    ONBOARDING: `${API_PATH_PREFIX_USER}/user/onboarding`,
  },
};
