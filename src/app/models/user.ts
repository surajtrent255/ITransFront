export class User {
  token!: string;
  user!: {
    id: number;
    firstname: string;
    lastname: string;
    email: string;
    roles: [
      {
        id: number;
        role: string;
        description: string;
      }
    ];
    enabled: boolean;
    username: string;
    authorities: [
      {
        authority: string;
      }
    ];
    accountNonLocked: boolean;
    accountNonExpired: boolean;
    credentialsNonExpired: boolean;
  };
}
