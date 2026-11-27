package __PACKAGE__;

import android.app.Activity;
import android.app.PendingIntent;
import android.content.Intent;
import android.os.Bundle;
import com.google.android.gms.auth.api.identity.AuthorizationRequest;
import com.google.android.gms.auth.api.identity.AuthorizationResult;
import com.google.android.gms.auth.api.identity.Identity;
import com.google.android.gms.common.api.Scope;
import java.util.Collections;

public final class MusesDriveAuthActivity extends Activity {
    private static final int REQUEST = 4901;
    @Override public void onCreate(Bundle state) {
        super.onCreate(state);
        if (state != null) return;
        AuthorizationRequest request = AuthorizationRequest.builder()
            .setRequestedScopes(Collections.singletonList(new Scope("https://www.googleapis.com/auth/drive.readonly")))
            .build();
        Identity.getAuthorizationClient(this).authorize(request)
            .addOnSuccessListener(result -> {
                if (result.hasResolution()) {
                    if (!getIntent().getBooleanExtra("interactive", false)) { fail(); return; }
                    try {
                        PendingIntent pending = result.getPendingIntent();
                        if (pending == null) { fail(); return; }
                        startIntentSenderForResult(pending.getIntentSender(), REQUEST, null, 0, 0, 0);
                    } catch (Exception error) { fail(); }
                } else complete(result);
            }).addOnFailureListener(error -> fail());
    }
    @Override protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        if (requestCode != REQUEST || resultCode != RESULT_OK || data == null) { fail(); return; }
        try { complete(Identity.getAuthorizationClient(this).getAuthorizationResultFromIntent(data)); }
        catch (Exception error) { fail(); }
    }
    private void complete(AuthorizationResult result) {
        String token = result.getAccessToken();
        if (token == null || token.isEmpty()) { fail(); return; }
        Intent response = new Intent();
        response.putExtra("accessToken", token);
        setResult(RESULT_OK, response);
        finish();
    }
    private void fail() { setResult(RESULT_CANCELED); finish(); }
}
