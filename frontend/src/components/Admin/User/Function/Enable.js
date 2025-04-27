// File: components/UserManagement/Function/Enable.jsx
export const enableSelectedUsers = (users, selectedUsers, selectAll, setUsers, setSelectedUsers, hideConfirmModal) => {
  if (!selectAll && selectedUsers.length === 0) {
    alert('Vui lòng chọn ít nhất một người dùng để kích hoạt.');
    hideConfirmModal();
    return;
  }

  const updatedUsers = users.map(user => (
    (selectAll || selectedUsers.includes(user.id))
      ? { ...user, status: 'Hoạt động' }
      : user
  ));

  setUsers(updatedUsers);
  setSelectedUsers([]);
  hideConfirmModal();
};
