# openresty_research
openresty research

一：Install
1:wget https://openresty.org/download/ngx_openresty-1.9.7.1.tar.gz</br>
2:
./configure --prefix=/Users/daipeng/develop/openresty \
--with-http_ssl_module \
--with-openssl=/Users/daipeng/develop/openssl-1.0.1u \
--with-pcre-jit \
--with-ipv6 \
--with-luajit \
--with-http_iconv_module \
--with-stream \
--with-stream_ssl_module \
--with-threads \
--add-module=/Users/daipeng/develop/stream-lua-nginx-module
	    

3:gmake gmake install</br>
4:vim /etc/profile  </br>
export PATH=$PATH:/usr/local/openresty/nginx/sbin</br>
source /etc/profile</br>



二: Make Workbench</br>
mkdir /usr/local/openresty-test</br>
mkdir conf/ logs/</br>

cd conf </br>
touch nginx.conf(refer:https://github.com/sosojustdo/lua_resty_template_research/blob/master/openresty-test/conf/nginx.conf)</br>

cd logs</br>
touch error.log</br>

run openresty:</br>
nginx -p /usr/local/openresty-test/ -c /usr/local/openresty-test/conf/nginx.conf</br>



三：Reference Material</br>
http://openresty.org/</br>
http://jinnianshilongnian.iteye.com/blog/2190344</br>
https://github.com/openresty/lua-nginx-module</br>
https://github.com/bungle/lua-resty-template</br>
https://github.com/pintsized/lua-resty-http</br>
https://github.com/openresty/nginx-tutorials</br>
OpenResty Best practice.pdf</br>

http://dikar.iteye.com/blog/1477619</br>








