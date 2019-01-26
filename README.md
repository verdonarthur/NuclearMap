# NuclearMap

![Nuclear Warning logo](https://proxy.duckduckgo.com/iu/?u=https://upload.wikimedia.org/wikipedia/commons/thumb/a/ae/Nuclear_symbol.svg/128px-Nuclear_symbol.svg.png&f=1)

## Description
The purpose of this project is to provide information on the use of nuclear energy in the world. The project will consist of 2 vectorized point layers, one containing nuclear power plants, the other containing nuclear accidents. It will be possible to obtain information on power plants or accidents by clicking on the associated points on the map.

## System architecture
Here is a diagram describing in a simplified way the global architecture of the system :

+-----------------------------------------+
|node/ExpressJS                           |
+-----------------------------------------+
|                                         |
| List of nuclear accident (geojson file) +----+
|                                         |    |
+-----------------------------------------+    |
                                               |      +--------------------------------------------+
+-------------------------+                    |      | index.html || localhost:PORT               |
|OverpassAPI              |                    |      +--------------------------------------------+
+-------------------------+                    |      |                                            |
|                         |                +----------> Display of nuclear central with clustering |
| List of Nuclear Central +----------------+   |      |                                            |
|                         |                    +------> Display of nuclear accident                |
+-------------------------+                           |                                            |
                                            +---------> Display of buffer zone                     |
+----------------------------------------+  |         |                                            |
| CartoAPI                               |  |  +------> Display of nbr nuclear central             |
+----------------------------------------+  |  |      |                                            |
|                                        |  |  |  +---> Display of total area buffer zone          |
| 30 Km Security buffer zone calculation +--+  |  |   |                                            |
|                                        |     |  |   +--------------------------------------------+
| Nbr of nuclear central calculation     +-----+  |
|                                        |        |
| Total Area of buffer zone calculation  +--------+
|                                        |
+----------------------------------------+

## How to install
1. clone the repo (git clone)
2. npm i / npm install
3. npm start (to start the express server) and npm run watch/build (dev / production) to launch the compilation of the es2015+ JS in standard JS

