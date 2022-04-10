Moralis.Cloud.define("addMember", async (request) => {
  const logger = Moralis.Cloud.getLogger();
  try {
    const member = new Moralis.Object("Member");
    member.set("ethAddress", request.params.ethAddress);
    member.set("role", request.params.role);
    member.set("userId", request.user.id);
    await Moralis.Object.saveAll([member], { useMasterKey: true });
    return true;
  } catch (e) {
    logger.error(e);
  }
});

Moralis.Cloud.define("getMember", async (request) => {
  const logger = Moralis.Cloud.getLogger();
  try {
    const memberQuery = new Moralis.Query("Member");
    memberQuery.equalTo("userId", request.user.id);
    const member = memberQuery.first({ useMasterKey: true });
    return member;
  } catch (e) {
    logger.error(e);
  }
});
