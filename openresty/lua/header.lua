local template = require "resty.template"
--�ر�ģ�建��
template.caching(false)

--render html
template.render("header.html", {})

