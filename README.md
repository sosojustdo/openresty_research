一：Install
1:wget https://openresty.org/download/ngx_openresty-1.9.7.1.tar.gz
2:
./configure --prefix=/usr/local/openresty \
            --with-pcre-jit \
            --with-ipv6 \
			--with-luajit \
            --without-http_redis2_module \
            --with-http_iconv_module

3:gmake gmake install
4:vim /etc/profile  
export PATH=$PATH:/usr/local/openresty/nginx/sbin
source /etc/profile



二: Make Workbench
mkdir /usr/local/openresty-test
mkdir conf/ logs/

cd conf 
touch nginx.conf(refer:https://github.com/sosojustdo/lua_resty_template_research/blob/master/openresty-test/conf/nginx.conf)

cd logs
touch error.log

run openresty:
nginx -p /usr/local/openresty-test/ -c /usr/local/openresty-test/conf/nginx.conf



三：Reference Material
http://openresty.org/
http://jinnianshilongnian.iteye.com/blog/2190344
https://github.com/openresty/lua-nginx-module
https://github.com/bungle/lua-resty-template
https://github.com/pintsized/lua-resty-http
https://github.com/openresty/nginx-tutorials
OpenResty Best practice.pdf







