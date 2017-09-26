# getOriginTime
Don't want to depend on unreliable client time? You're in luck. Every http request includes the servers
time in UTC. This module makes a http request and inspects the Date response header then returns the time
as a string.

## Usage
```
const getOriginTime = require('get-origin-time');

async function doSomethingBasedOnAccurateTime() {
    const dateString = await getOriginTime({
        url, // url to request uses window.location.origin by default
        method, // http method to use, HEAD by default
        timeout // how long to wait for the server to respond 10s by default
    });
    const originTime = new Date(dateString);
    // ... do something interesting with the time
}
```
