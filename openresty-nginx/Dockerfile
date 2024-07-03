FROM openresty/openresty:alpine-fat

#install pgmoon for database operations
RUN /usr/local/openresty/luajit/bin/luarocks install lua-resty-jwt && /usr/local/openresty/luajit/bin/luarocks install pgmoon

#copy pdf file to docker directory
COPY ./static/ /usr/local/openresty/static/ 

ENTRYPOINT ["/usr/local/openresty/bin/openresty", "-g", "daemon off;", "-c", "/nginx.conf"]
