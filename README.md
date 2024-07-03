## Installation

```bash
#Install the project to your workplace
git clone https://github.com/LunarXChris/nginx-reactjs.git
```



------

## Backend configuration

Docker + OpenResty（Nginx) + PostgreSql

### Docker

Install docker to manage the database and server.

Please refer to the official website: https://www.docker.com/

#### Use Portainer for docker management(if needed)

Documentation for installation:

[Install Portainer CE with Docker on Linux | Portainer Documentation](https://docs.portainer.io/start/install-ce/server/docker/linux)

#### Set Up Postgres Database

1. Create a docker container of Postgres

```bash
#set up a container named 'my-postgres'where ports on localhost and docker are both 5432
#postgres default root user name = 'postgres' and passward is set = 'admin'
docker run -d --name my-postgres -p 5432:5432 -e POSTGRES_PASSWORD=admin postgres
```

2. Create a custom database and data table for storage

```bash
#execute psql to use Postgres command line
docker exec -it my-postgres psql -U postgres

#starting here you are using psql
#<database-name> and <user-name> is set to be 'mydb' and 'postgres'
create database <database-name> owner <user-name>;

#sql query to create table 'pdf'
CREATE TABLE pdf (
  id SERIAL PRIMARY KEY, 
  name VARCHAR (255) UNIQUE NOT NULL, 
  file_size BIGINT NOT NULL, 
  modified_date TIMESTAMP NOT NULL
); 
```

3. Insert data to the pdf table

   Please refer to the file 'db.sql' and insert the data to database.

   You can add more data and copy the pdf to directory /static/ for file access

P.S. PGADMIN can be use for management if necesary: 

[Setting up PostgreSQL and pgAdmin 4 with Docker | by marvinjungre | Medium](https://medium.com/@marvinjungre/get-postgresql-and-pgadmin-4-up-and-running-with-docker-4a8d81048aea)

#### OpenResty-Nginx

Using template: https://github.com/ubergarm/openresty-nginx-jwt

```bash
#build a docker image named 'openresty-test'
cd openresty-nginx
docker build -t openresty-test .

#create and run a container at port 8001
#attach cfssl certificate and key for TLS authentication
docker run --rm -it -v `pwd`/nginx.conf:/nginx.conf -v `pwd`/db.lua:/db.lua -v `pwd`/server.pem:/server.pem -v `pwd`/server-key.pem:/server-key.pem -p 8001:8001 openresty-test
```

   Reference for CFSSL configuration: https://blog.csdn.net/calm0406/article/details/127838421

```bash
#testing for tls authentication
#1. using curl
curl https://localhost:8001/showall --cacert ca.pem --key client-key.pem   --cert client.pem
#2. run tls_client_test.js
node tls_client_test.js
```

------

## Frontend configuration

Vite+React+Electron + Material UI

####  Vite+React+Electron

```bash
# install nodejs and npm if not installed
nvm install --lts

# create vite-project command(not needed)
# 1. using vite, select other -> create-electron-vite -> react
npm create vite <project-name>
# 2. using vite-electron, select react
npm create electron-vite <project-name>

# run the web application on port 5173
cd electron-react
npm install
npm run dev
```

Open browser and go to http://localhost:5173. Electron might not work as TLS handshake fails on unknown reason using Windows subsystem on Linux(WSL).

The result should like this:

![pdf_system](C:\Users\User\Desktop\pdf_system.png) 

#### Material UI

```bash
# install materialUI defualt package
npm install @mui/material @emotion/react @emotion/styled
# install materialUI icon
npm install @mui/icons-material
```

#### NodePolyfills plugin

Use for supporting commonJs package which are no longer supported in Vite (only native ES6 module can be compile)

For example, fs and https module cannot be import with Vite because dynamic import is not allowed

```bash
# installation
npm install --save-dev vite-plugin-node-polyfills
```

