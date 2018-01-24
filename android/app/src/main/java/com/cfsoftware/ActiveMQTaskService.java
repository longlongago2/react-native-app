package com.cfsoftware;

import com.facebook.react.HeadlessJsTaskService;
import com.facebook.react.jstasks.HeadlessJsTaskConfig;
import com.facebook.react.bridge.Arguments;
import android.content.Intent;
import android.os.Bundle;
import android.support.annotation.Nullable;

public class ActiveMQTaskService extends HeadlessJsTaskService {

  @Override
  protected @Nullable HeadlessJsTaskConfig getTaskConfig(Intent intent) {
    Bundle extras = intent.getExtras();
    if (extras != null) {
      return new HeadlessJsTaskConfig(
          "ActiveMQ",
          Arguments.fromBundle(extras),
          5000,
          true
        );
    }
    return null;
  }

}