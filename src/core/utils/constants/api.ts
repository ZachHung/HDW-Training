export const baseRoute = 'api/v1';

export const Routes = {
  AUTH: `/auth`,
  POSTS: '/posts',
};

export const AuthRoutes = {
  POST_TOKEN: `/refresh-token`,
  POST_LOGIN: `/login`,
  POST_REGISTER: ``,
  GET_ALL_USERS: `/all`,
  GET_ME: ``,
};

export const PostRoutes = {
  GET_ALL_POSTS: ``,
  POST_CREATE_POST: ``,
  GET_BY_USER: `{id}/users`,
  GET_BY_ID: `{id}`,
  PUT_UPDATE: `{id}`,
  DELETE_ID: `{id}`,
};

export const EventRoutes = {
  POST_CREATE_EVENT: ``,
  POST_EDIT_ME: `{eventId}/editable/me`,
  POST_EDIT_RELEASE: `{eventId}/editable/release`,
  POST_EDIT_MAINTAIN: `{eventId}/editable/maintain`,
};

export const VoucherRoutes = {
  POST_CREATE_VOUCHER: ``,
  POST_ACTIVATE_VOUCHER: `{eventId}/active`,
};
