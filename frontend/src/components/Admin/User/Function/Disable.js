// File: components/UserManagement/Function/Disable.jsx
export const disableSelectedUsers = (users, selectedUsers, selectAll, setUsers, setSelectedUsers, hideConfirmModal) => {
  const updatedUsers = users.map(user => (
    (selectAll || selectedUsers.includes(user.id))
      ? { ...user, status: 'Không hoạt động' }
      : user
  ));
  setUsers(updatedUsers);
  setSelectedUsers([]);
  hideConfirmModal();
};

