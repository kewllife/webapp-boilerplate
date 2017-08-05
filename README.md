# Web App Boilerplate

Setup for Nginx, Express, EJS web app.


upstream webapp {
    server 127.0.0.1:3000;
}

server {
    listen  80           default_server;
    listen  [::]:80      default_server;
    listen  443 ssl      default_server;
    listen  [::]:443 ssl default_server;

    ssl_certificate      /etc/nginx/certs/server.crt;
    ssl_certificate_key  /etc/nginx/certs/server.key;

    location ~ ^/(css/|fonts/|images/|js/|favicon.ico|humans.txt|robots.txt) {
        root /var/www/html/public;
        access_log off;
        expires off;
    }

    location / {
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header Host $http_host;
        proxy_set_header X-NginX-Proxy true;

        proxy_pass http://webapp;
        proxy_redirect off;
    }
}