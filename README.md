# Loopback Client issue

## Setup

1. `npm install`
2. Create a .env file or manually set environment variables for `CLIENT_ID` and `AUTHORITY`
3. Execute the scripts directly: `node repro.js`

## Repro Cases

### repro.js

This file demonstrates a race condition where `server.listen` might not finish executing by the time we call `server.address`. To make the repro easy, we monkeypatch the method to wait for one second before calling the real method.

**Expected**: `PublicClientApplication` waits for server to be `listening` before calling `address()`

**Actual**: `PublicClientApplication` immediately calls `server.address()` resulting in a spurious error:

```
AuthError [NodeAuthError]: invalid_loopback_server_address_type: Loopback server address is not type string. This is unexpected.
```

### repro2.js

This file takes a similar approach of monkeypatching `server.listen` but rather than interfering with the correct operation of `listen`, it simply dispatches a fake request after a short timeout in order to force the `authCodeListener` promise inside `LoopbackClient` to reject.

**Expected**: The failure of `authCodeListener` is able to be caught by calling code. It should print out "error caught" followed by the exception.

**Actual**: Node exits without invoking the catch logic, printing the exception directly and not allowing any further recovery or action by the caller.
