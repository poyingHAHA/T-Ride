export const getUserId = () => {
  const userId = localStorage.getItem("userId");
  if (userId) {
    return parseInt(userId);
  }
  return 0;
};