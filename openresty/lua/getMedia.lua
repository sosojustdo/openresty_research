local common = require "common"

--�漰�������ղ����û�״̬, ֱ�ӵ���http�ӿ�
local args = ngx.req.get_uri_args()
common.read_http(args)
