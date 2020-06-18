var reverseProxy = new require('./reverseProxy')({
    port: 80,
    ssl: {
        port: 443
    }
})


reverseProxy.register("wiki.lavumi.net", "http://localhost:1180", {
    ssl: {
        redirectPort: 3443,
        key: '/etc/letsencrypt/live/*.lavumi.net/privkey.pem',
        cert: '/etc/letsencrypt/live/*.lavumi.net/cert.pem',
        ca: '/etc/letsencrypt/live/*.lavumi.net/chain.pem',
    }
});

reverseProxy.register("lavumi.net", "http://localhost:3000", {
    ssl: {
        key: '/etc/letsencrypt/live/lavumi.net/privkey.pem',
        cert: '/etc/letsencrypt/live/lavumi.net/cert.pem',
        ca: '/etc/letsencrypt/live/lavumi.net/chain.pem',
    }
});
