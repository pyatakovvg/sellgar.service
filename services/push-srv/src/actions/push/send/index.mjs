
import { UnavailableError } from "@package/errors";

import { models } from "@sellgar/db";

import webPush from "web-push";


export default async (data) => {
  const { Subscription } = models;

  const result = await Subscription.findOne({
    where: {
      userUuid: data['userUuid'],
    },
  });

  if ( ! result) {
    return void 0;
  }

  try {
    const item = result.toJSON();
    const subscription = {
      endpoint: item['endpoint'],
      keys: {
        auth: item['auth'],
        p256dh: item['p256dh'],
      },
    };

    const payload = JSON.stringify({
      title: data['title'],
      body: data['message'],
      icon: '/icon-48.png',
    });

    const options = {
      TTL: 3600 // 1sec * 60 * 60 = 1h
    };

    await webPush.sendNotification(subscription, payload, options);
  }
  catch(error) {

    throw new UnavailableError({ code: '6.6.7', message: error['body'] });
  }
}
