export const MOCK_ROLES_LEVEL_2 = [
  {
    id: 'role-client-1-id-12345678',
    name: 'client',
    permissions: [
      'create-message',
      'read-message',
      'update-message',
      'delete-message'
    ]
  },
  {
    id: 'role-moderator-1-id-12345678',
    name: 'moderator',
    permissions: [
      'create-message',
      'read-message',
      'update-message',
      'delete-message'
    ]
  },
  {
    id: 'role-admin-1-id-12345678',
    name: 'admin',
    permissions: [
      // messages
      'create-message',
      'read-message',
      'update-message',
      'delete-message',
      // admin tools
      'create-admin-tool',
      'read-admin-tool',
      'update-admin-tool',
      'delete-admin-tool'
    ]
  }
]

export const MOCK_DATABASE_USER_LEVEL_2 = {
  ID: 'trungquandev-sample-id-12345678',
  EMAIL: 'trungquandev.official@gmail.com',
  PASSWORD: 'trungquandev@123',
  ROLE: 'client'
}
