local template = require "resty.template"
--�ر�ģ�建��
template.caching(true)

--render html
template.render("header.html", {})

