package __PACKAGE__;

import android.app.Activity;
import android.content.Intent;
import androidx.activity.result.ActivityResult;
import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.ActivityCallback;
import com.getcapacitor.annotation.CapacitorPlugin;

@CapacitorPlugin(name = "MusesDriveAuth")
public final class MusesDriveAuthPlugin extends Plugin {
    @PluginMethod public void authorize(PluginCall call) {
        Intent intent = new Intent(getActivity(), MusesDriveAuthActivity.class);
        intent.putExtra("interactive", Boolean.TRUE.equals(call.getBoolean("interactive", false)));
        startActivityForResult(call, intent, "authorized");
    }
    @ActivityCallback private void authorized(PluginCall call, ActivityResult result) {
        if (call == null) return;
        if (result.getResultCode() != Activity.RESULT_OK || result.getData() == null) {
            call.reject("Google authorization not completed"); return;
        }
        String token = result.getData().getStringExtra("accessToken");
        if (token == null || token.isEmpty()) { call.reject("Google authorization not completed"); return; }
        JSObject output = new JSObject(); output.put("accessToken", token); call.resolve(output);
    }
}
