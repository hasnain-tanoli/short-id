const sessionIdToUserMap = new Map();

function setUserId(id, user) {
  sessionIdToUserMap.set(id, user);
}

function getUserId(id) {
  return sessionIdToUserMap.get(id);
}

module.exports = {
  setUserId,
  getUserId,
};
