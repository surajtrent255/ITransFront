export const BASE_URL = 'http://localhost:9999';
export const USER_LOGIN_URL = BASE_URL + '/api/v1/auth/authenticate';

export const USER_REGISTER_URL = BASE_URL + '/api/v1/auth/register';

export const USER_COMPANY_URL = BASE_URL + '/api/v1/company/userCompany';

export const ADD_COMPANY_URL = BASE_URL + '/api/v1/company/add';

export const USER_CONFIGURATION_DETAILS = BASE_URL + '/api/v1/userconfig';

// needs to be revised

export const USER_UPDATE_STATUS_URL =
  BASE_URL + '/api/v1/userconfig/update/role/status';

export const UPDATE_USER_COMPANY_STATUS =
  BASE_URL + '/api/v1/userconfig/update/usercompany/status';

export const USER_ROLE_UPDATE = BASE_URL + '/api/v1/userconfig/add/role';

export const UPDATE_USER_COMPANY_URL =
  BASE_URL + '/api/v1/userconfig/update/company';

export const GET_ALL_ROLES = BASE_URL + '/api/v1/userconfig/role';

export const GET_ALL_USER = BASE_URL + '/api/v1/userconfig/users';

// final urls

export const ASSIGN_COMPANY_TO_USER =
  BASE_URL + '/api/v1/userconfig/assign/user';

export const GET_BRANCH_DETAILS = BASE_URL + '/api/v1/branch';

export const GET_USERS_BY_COMPANYID =
  BASE_URL + '/api/v1/userconfig/users/ByCompanyId';

export const ASSIGN_BRANCH_TO_USER = BASE_URL + '/api/v1/branch/assign';

export const GET_BRANCH_DETAILS_BY_USERID_COMPANYID =
  BASE_URL + '/api/v1/branch/get';
