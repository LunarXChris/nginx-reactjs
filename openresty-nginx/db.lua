
local pgmoon = require("pgmoon")

local db = {}

-- conntect to Postgres database
function db.connectdb()
    --host on docker use default subnet 172.17.0.0/16
    --check the ip of postgres using docker inspect
    --change the host ip id needed
    local pg = pgmoon.new({
        host = "172.17.0.2",
        port = "5432",
        database = "mydb",
        user = "postgres",
        password = "admin"
    })

    local success, err = pg:connect()
    -- use ngx.ERR so it can be view on console(only log level > ERR is displayed)
    if err then
        ngx.log(ngx.ERR, 'connect pg error#', err)
        ngx.exit(ngx.HTTP_INTERNAL_SERVER_ERROR)
    else
        ngx.log(ngx.ERR, 'connected ', success)
    end

    return pg
end


-- handle show all reqest 
function db.select()
    local pg = db.connectdb()

    local result, err, partial, num_queries = pg:query("select * from pdf")
    pg:keepalive()
    pg = nil

    -- return result if found and encoded as json
    if result == nil then
        ngx.log(ngx.ERR, 'query error#', ' nil')
        ngx.print(nil)
    else
        local json = require "cjson"
        ngx.print(json.encode(result))
    end
end


-- handle search request
function db.query(arg)
    local pg = db.connectdb()

    --configure sql query with input arguments
    local sql = "select * from pdf where "
    local first = true 
    for k, v in pairs(arg) do
        if first then
            sql = sql .. k .. " = " .. pg:escape_literal(v)
            first = false
        else
            sql = sql .. " and " .. k .. " = " .. pg:escape_literal(v)
        end 
    end

    
    ngx.log(ngx.ERR, 'query: ', sql)

    local result, err, partial, num_queries = pg:query(sql)
    pg:keepalive()
    pg = nil

    -- return result if found and encoded as json
    if result == nil then
        ngx.log(ngx.ERR, 'query error#', ' nil')
        ngx.print(nil)
    else
        local json = require "cjson"
        ngx.print(json.encode(result))
    end
end

return db