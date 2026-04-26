export const MOCK_ROLES_LEVEL_3 = [
  {
    id: 'role-client-1-id-12345678',
    name: 'client',
    permissions: [
      'create-post',
      'read-post',
      'update-post',
      'delete-post'
    ],
    inherits: []
  },
  {
    id: 'role-moderator-1-id-12345678',
    name: 'moderator',
    permissions: [
      'create-message',
      'read-message',
      'update-message',
      'delete-message'
    ],
    inherits: ['client']
  },
  {
    id: 'role-admin-1-id-12345678',
    name: 'admin',
    permissions: [
      'create-admin-tool',
      'read-admin-tool',
      'update-admin-tool',
      'delete-admin-tool'
    ],
    inherits: ['moderator']
  }
]

export const MOCK_DATABASE_USER_LEVEL_3 = {
  ID: 'trungquandev-sample-id-12345678',
  EMAIL: 'trungquandev.official@gmail.com',
  PASSWORD: 'trungquandev@123',
  ROLES: ['admin', 'moderator', 'client']
}
