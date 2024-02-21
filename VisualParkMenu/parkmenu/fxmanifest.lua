fx_version 'adamant'
game 'gta5'

author "Hookah Leaks | Kerim"

client_scripts {
  'config/cl_config.lua',
  'client/*.lua'
}

server_scripts {
  '@mysql-async/lib/MySQL.lua',
  'config/sv_config.lua',
  'server/*.lua'
}

author 'btwlouis'
version '1.0.0'
description 'Berlin City Garage'


ui_page {
  'html/index.html'
}

files {
  'html/**/*.*'
}