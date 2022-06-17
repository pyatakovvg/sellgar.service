
import { models } from '@sellgar/db';


export default async function(userUuid, data) {
  const { UserClaims } = models;

  return UserClaims.bulkCreate(data.map((claim) => ({
    userUuid,
    claimUuid: claim['uuid'],
    value: claim['value'],
  })));
};
