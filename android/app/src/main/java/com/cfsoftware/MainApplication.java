package com.cfsoftware;

import android.app.Application;
import android.os.Bundle;
import android.content.Intent;

import com.facebook.react.ReactApplication;
import com.fwpt.reactivenativemqtt.ActiveMQ;
import net.zubricky.AndroidKeyboardAdjust.AndroidKeyboardAdjustPackage;
import org.pgsqlite.SQLitePluginPackage;
import com.rnfs.RNFSPackage;
import com.fileopener.FileOpenerPackage;
import com.dylanvann.fastimage.FastImageViewPackage;
import com.oblador.vectoricons.VectorIconsPackage;
import com.dieam.reactnativepushnotification.ReactNativePushNotificationPackage;
import com.reactnative.ivpusic.imagepicker.PickerPackage;
import com.learnium.RNDeviceInfo.RNDeviceInfo;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;

import java.util.Arrays;
import java.util.List;

public class MainApplication extends Application implements ReactApplication {

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
    @Override
    public boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      return Arrays.<ReactPackage>asList(
          new MainReactPackage(),
            new ActiveMQ(),
            new AndroidKeyboardAdjustPackage(),
            new SQLitePluginPackage(),
            new RNFSPackage(),
            new FileOpenerPackage(),
            new FastImageViewPackage(),
            new VectorIconsPackage(),
            new ReactNativePushNotificationPackage(),
            new PickerPackage(),
            new RNDeviceInfo()
      );
    }

    @Override
    protected String getJSMainModuleName() {
      return "index";
    }
  };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onCreate() {
    super.onCreate();
    SoLoader.init(this, /* native exopackage */ false);

    // starting service...
    Intent service = new Intent(getApplicationContext(), ActiveMQTaskService.class);
    Bundle bundle = new Bundle();
    bundle.putString("service", "ActiveMQ");
    service.putExtras(bundle);
    getApplicationContext().startService(service);
  }
}
